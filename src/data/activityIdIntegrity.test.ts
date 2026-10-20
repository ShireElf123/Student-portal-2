/**
 * Activity-ID integrity: every evidence event must name a real, canonical
 * learning activity. Aliases resolve; unknown IDs fail closed; static call
 * sites cannot drift off the registry.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import * as ts from "typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LEARNING_ACTIVITY_DEFINITIONS,
  resolveActivityDefinition,
} from "./activitySkillRegistry";
import {
  getInitialLearnerModel,
  recordLearningEvent,
  setActiveLearnerId,
} from "../utils/learnerBrain";

vi.mock("../firebaseCore", () => ({
  saveLearnerModelToCloud: vi.fn().mockResolvedValue(undefined),
  fetchLearnerModelFromCloud: vi.fn().mockResolvedValue(null),
  recordCloudLearningEvent: vi.fn().mockResolvedValue(undefined),
  notifySyncStatus: vi.fn(),
}));

class MemoryStorage {
  private values = new Map<string, string>();
  get length(): number {
    return this.values.size;
  }
  clear(): void {
    this.values.clear();
  }
  getItem(key: string): string | null {
    return this.values.get(String(key)) ?? null;
  }
  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.values.delete(String(key));
  }
  setItem(key: string, value: string): void {
    this.values.set(String(key), String(value));
  }
}

/** Mirrors ACTIVITY_ALIASES in activitySkillRegistry.ts (kept local so a missing export still fails closed). */
const EXPECTED_ALIASES: Record<string, string> = {
  "speed-math-blitz-sprint": "primary-lab-speed-math",
  "toddler-music-piano": "toddler-piano-music",
};

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (!/\.tsx?$/.test(entry.name) || /\.(test|spec)\.[jt]sx?$/.test(entry.name)) return [];
    return [path];
  });
}

function objectProperties(object: ts.ObjectLiteralExpression): Record<string, ts.Expression | undefined> {
  const properties: Record<string, ts.Expression | undefined> = {};
  for (const property of object.properties) {
    if (ts.isShorthandPropertyAssignment(property)) {
      properties[property.name.text] = property.name;
      continue;
    }
    if (!ts.isPropertyAssignment(property)) continue;
    const name = property.name && (ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name))
      ? property.name.text
      : undefined;
    if (name) properties[name] = property.initializer;
  }
  return properties;
}

function stringLiteral(value: ts.Expression | undefined): string | undefined {
  return value && ts.isStringLiteralLike(value) ? value.text : undefined;
}

function isInsideTry(node: ts.Node): boolean {
  let current: ts.Node | undefined = node.parent;
  while (current) {
    if (ts.isTryStatement(current)) return true;
    current = current.parent;
  }
  return false;
}

describe("activity-ID integrity", () => {
  let storage: MemoryStorage;
  let learnerId = "activity-id-learner";
  let resetId = 0;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
    vi.stubGlobal("window", new EventTarget());
    learnerId = `activity-id-learner-${resetId++}`;
    setActiveLearnerId(`reset-learner-${resetId}`);
    setActiveLearnerId(learnerId);
    getInitialLearnerModel(learnerId);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("resolves known aliases to canonical activity IDs and records the canonical ID", () => {
    for (const [alias, canonical] of Object.entries(EXPECTED_ALIASES)) {
      const definition = resolveActivityDefinition(alias);
      expect(definition.id, `${alias} should resolve to ${canonical}`).toBe(canonical);
      expect(resolveActivityDefinition(canonical).id).toBe(canonical);
    }

    const event = recordLearningEvent({
      id: "alias-canonical-event",
      learnerId,
      activityId: "speed-math-blitz-sprint",
      experienceId: "speed-math-blitz-sprint",
      contentId: "alias-check",
      eventType: "question_answered",
      activityType: "math-blitz",
      activityTitle: "Alias canonicalization",
      skillId: "math-k1-addition-subtraction",
      domain: "math",
      gradeBand: "2-3",
      result: "success",
      score: 100,
      difficulty: "easy",
      attempts: 1,
      hintsUsed: 0,
    });
    expect(event.activityId).toBe("primary-lab-speed-math");
  });

  it("rejects unknown activity IDs at resolve and at the evidence gateway", () => {
    expect(() => resolveActivityDefinition("not-a-real-activity")).toThrow(/Unknown learning activity ID/);
    expect(() => resolveActivityDefinition("")).toThrow(/Unknown learning activity ID/);
    expect(() =>
      recordLearningEvent({
        learnerId,
        activityId: "invented-activity",
        experienceId: "practice-arena",
        contentId: "should-not-record",
        eventType: "question_answered",
        activityType: "practice-session",
        activityTitle: "Unknown activity",
        domain: "general",
        gradeBand: "2-3",
        result: "explored",
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
      })
    ).toThrow(/Unknown learning activity ID/);
  });

  it("keeps aliases unique, non-cyclic, and pointed at real registry entries", () => {
    const canonicalIds = new Set(LEARNING_ACTIVITY_DEFINITIONS.map((activity) => activity.id));
    const aliasKeys = Object.keys(EXPECTED_ALIASES);
    expect(new Set(aliasKeys).size).toBe(aliasKeys.length);

    for (const [alias, canonical] of Object.entries(EXPECTED_ALIASES)) {
      expect(canonicalIds.has(alias), `${alias} must not collide with a canonical id`).toBe(false);
      expect(canonicalIds.has(canonical), `${alias} target ${canonical} is missing`).toBe(true);
      expect(EXPECTED_ALIASES[canonical], `${alias} target ${canonical} must not itself be an alias`).toBeUndefined();
      expect(resolveActivityDefinition(alias).id).toBe(canonical);
    }
  });

  it("rejects an aliased activity recorded against the wrong experience", () => {
    expect(() =>
      recordLearningEvent({
        learnerId,
        activityId: "speed-math-blitz-sprint",
        experienceId: "practice-arena",
        contentId: "wrong-experience",
        eventType: "question_answered",
        activityType: "math-blitz",
        activityTitle: "Wrong experience",
        skillId: "math-k1-addition-subtraction",
        domain: "math",
        gradeBand: "2-3",
        result: "success",
        score: 100,
        difficulty: "easy",
        attempts: 1,
        hintsUsed: 0,
      })
    ).toThrow(/belongs to experience speed-math-blitz-sprint/);
  });

  it("keeps every statically declared evidence activityId on the registry (canonical or alias)", () => {
    const root = resolve(process.cwd(), "src");
    const findings: string[] = [];
    let staticCount = 0;

    for (const filePath of sourceFiles(root)) {
      const text = readFileSync(filePath, "utf8");
      const source = ts.createSourceFile(
        filePath,
        text,
        ts.ScriptTarget.Latest,
        true,
        filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      );

      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          node.expression.getText(source).split(".").at(-1) === "recordLearningEvent" &&
          node.arguments[0] &&
          ts.isObjectLiteralExpression(node.arguments[0])
        ) {
          const properties = objectProperties(node.arguments[0]);
          const activityId = stringLiteral(properties.activityId);
          if (activityId) {
            staticCount += 1;
            const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
            try {
              const definition = resolveActivityDefinition(activityId);
              const experienceId = stringLiteral(properties.experienceId);
              if (experienceId && experienceId !== definition.experienceId) {
                findings.push(
                  `${relative(process.cwd(), filePath)}:${line}: ${activityId} uses experience ${experienceId}, expected ${definition.experienceId}`
                );
              }
            } catch (error) {
              findings.push(`${relative(process.cwd(), filePath)}:${line}: ${String(error)}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }

    expect(staticCount).toBeGreaterThan(20);
    expect(findings).toEqual([]);
  });

  it("inventories dynamic (non-literal) evidence activityId call sites so they cannot grow silently", () => {
    const root = resolve(process.cwd(), "src");
    const dynamicSites: string[] = [];
    const unguardedLiteralSites: string[] = [];
    const unguardedDynamicSites: string[] = [];

    for (const filePath of sourceFiles(root)) {
      const text = readFileSync(filePath, "utf8");
      const source = ts.createSourceFile(
        filePath,
        text,
        ts.ScriptTarget.Latest,
        true,
        filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
      );

      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          node.expression.getText(source).split(".").at(-1) === "recordLearningEvent" &&
          node.arguments[0] &&
          ts.isObjectLiteralExpression(node.arguments[0])
        ) {
          const properties = objectProperties(node.arguments[0]);
          const activityExpr = properties.activityId;
          const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
          const loc = `${relative(process.cwd(), filePath)}:${line}`;
          if (!activityExpr || !ts.isStringLiteralLike(activityExpr)) {
            const label = activityExpr ? `${loc} (${activityExpr.getText(source)})` : loc;
            dynamicSites.push(label);
            if (!isInsideTry(node)) unguardedDynamicSites.push(label);
          } else if (!isInsideTry(node)) {
            unguardedLiteralSites.push(`${loc} (${activityExpr.text})`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }

    const expectedDynamic = [
      "src/components/ToddlerK1Studio.tsx:51 (game.activityId)",
      "src/components/ToddlerSecretZones.tsx:91 (zone.activityId)",
      "src/components/ToddlerWorldsNavigator.tsx:493 (activeActivity.id)",
      "src/contentEngine/gameAdapters.ts:79 (engine.activityId)",
      "src/contentEngine/gameAdapters.ts:126 (engine.activityId)",
      "src/contentEngine/gameAdapters.ts:173 (engine.activityId)",
      "src/contentEngine/gameAdapters.ts:228 (engine.activityId)",
      "src/contentEngine/gameAdapters.ts:272 (engine.activityId)",
      "src/data/toddler/toddlerProgressManager.ts:197 (activityId)",
    ];
    expect(dynamicSites.sort()).toEqual(expectedDynamic.sort());
    // Every production recordLearningEvent call — literal or dynamic — must be
    // inside try/catch so a registry miss cannot freeze a game.
    expect(unguardedLiteralSites).toEqual([]);
    expect(unguardedDynamicSites).toEqual([]);
  });
});
