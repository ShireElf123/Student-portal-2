import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import * as ts from "typescript";
import { describe, expect, it } from "vitest";
import {
  getActivitiesForSkill,
  LEARNING_ACTIVITY_DEFINITIONS,
  resolveActivityDefinition,
  resolveSkillForActivity,
  validateLearningActivityRegistry,
} from "./activitySkillRegistry";
import { CURRICULUM_SKILL_NODES } from "./curriculumUniverse";
import { GUIDED_ASSESSMENTS } from "./assessmentTemplates";
import { PICTURE_BOOKS } from "./pictureBooksData";
import { ALL_TODDLER_WORLDS } from "./toddler/toddlerWorldsArchitecture";
import { DIAGNOSTIC_PLACEMENT_QUESTIONS } from "../utils/pedagogicalEngine";

type StringPropertyMap = Record<string, ts.Expression | undefined>;

function stringLiteral(value: ts.Expression | undefined): string | undefined {
  return value && ts.isStringLiteralLike(value) ? value.text : undefined;
}

function objectProperties(object: ts.ObjectLiteralExpression): StringPropertyMap {
  const properties: StringPropertyMap = {};
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = property.name && (ts.isIdentifier(property.name) || ts.isStringLiteralLike(property.name))
      ? property.name.text
      : undefined;
    if (name) properties[name] = property.initializer;
  }
  return properties;
}

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    if (!/\.tsx?$/.test(entry.name) || /\.(test|spec)\.[jt]sx?$/.test(entry.name)) return [];
    return [path];
  });
}

describe("learning infrastructure integrity", () => {
  it("validates the curriculum, activity links, route targets, and prerequisite graph", () => {
    expect(validateLearningActivityRegistry()).toEqual([]);
    expect(CURRICULUM_SKILL_NODES.length).toBeGreaterThan(0);

    for (const skill of CURRICULUM_SKILL_NODES) {
      expect(getActivitiesForSkill(skill.id).length, `${skill.id} needs a registered activity`).toBeGreaterThan(0);
      for (const prerequisiteId of skill.prerequisites) {
        expect(CURRICULUM_SKILL_NODES.some((candidate) => candidate.id === prerequisiteId),
          `${skill.id} has an unknown prerequisite ${prerequisiteId}`).toBe(true);
      }
    }

    for (const activity of LEARNING_ACTIVITY_DEFINITIONS) {
      expect(activity.id.trim()).not.toBe("");
      expect(activity.experienceId.trim()).not.toBe("");
      expect(activity.launch.targetId.trim()).not.toBe("");
      for (const skillId of activity.skillIds) {
        expect(CURRICULUM_SKILL_NODES.some((node) => node.id === skillId),
          `${activity.id} maps to missing skill ${skillId}`).toBe(true);
      }
    }
  });

  it("classifies every toddler-world activity, including engagement-only activities", () => {
    const worldActivities = ALL_TODDLER_WORLDS.flatMap((world) =>
      world.areas.flatMap((area) => area.activities.map((activity) => ({ world, area, activity })))
    );
    const registeredWorldActivities = LEARNING_ACTIVITY_DEFINITIONS.filter(
      (activity) => activity.experienceType === "toddler-world" || activity.launch.targetId.startsWith("world:")
    );

    expect(worldActivities).toHaveLength(37);
    expect(registeredWorldActivities).toHaveLength(37);
    expect(new Set(registeredWorldActivities.map((activity) => activity.id)).size).toBe(37);
    const engagementOnlyIds = new Set([
      "act-color-mix-orange", "act-color-mix-green", "act-music-high-low", "act-sticker-crown-pick",
      "act-feelings-happy-smile", "act-habits-toothbrush", "act-habits-listening-ears", "act-family-sweet-baby",
    ]);
    const actualEngagementOnlyIds = new Set<string>();

    for (const { world, area, activity } of worldActivities) {
      expect(activity.learningObjective.trim()).not.toBe("");
      const definition = resolveActivityDefinition(activity.id);
      expect(definition.launch.route).toBe("toddler");
      expect(definition.launch.targetId).toBe(`world:${world.id}:${area.id}:${activity.id}`);
      expect(definition.experienceId).toBe("toddler-worlds-navigator");
      expect(definition.minimumWorldStars).toBe(area.requiredStarsToUnlock);
      if (definition.skillIds.length > 0) {
        expect(definition.experienceType).toBe("toddler-world");
        expect(definition.skillIds).toHaveLength(1);
        expect(activity.learningObjective.trim()).not.toBe("");
      } else {
        expect(definition.experienceType).toBe("engagement");
        actualEngagementOnlyIds.add(activity.id);
      }
    }
    expect(actualEngagementOnlyIds).toEqual(engagementOnlyIds);
  });

  it("maps all scored assessment and picture-book responses to real curriculum skills", () => {
    const assessmentActivity = resolveActivityDefinition("guided-assessment");
    let assessmentSkillCount = 0;
    for (const assessment of GUIDED_ASSESSMENTS) {
      for (const item of assessment.items) {
        if (!item.skillId) continue;
        assessmentSkillCount += 1;
        expect(CURRICULUM_SKILL_NODES.some((node) => node.id === item.skillId),
          `${assessment.id}/${item.id} references ${item.skillId}`).toBe(true);
        expect(assessmentActivity.skillIds).toContain(item.skillId);
      }
    }
    expect(assessmentSkillCount).toBeGreaterThan(0);

    const bookActivity = resolveActivityDefinition("picture-book-interaction");
    let bookInteractionCount = 0;
    for (const book of PICTURE_BOOKS) {
      for (const page of book.pages) {
        const interaction = page.learningInteraction;
        if (!interaction) continue;
        bookInteractionCount += 1;
        expect(CURRICULUM_SKILL_NODES.some((node) => node.id === interaction.skillId),
          `${book.id}/${interaction.id} references ${interaction.skillId}`).toBe(true);
        expect(bookActivity.skillIds).toContain(interaction.skillId);
      }
    }
    expect(bookInteractionCount).toBeGreaterThan(0);
  });

  it("maps diagnostic learning objectives to skills in the same domain and grade band", () => {
    expect(DIAGNOSTIC_PLACEMENT_QUESTIONS.every((question) => question.skillId)).toBe(true);
    for (const question of DIAGNOSTIC_PLACEMENT_QUESTIONS) {
      const skill = CURRICULUM_SKILL_NODES.find((node) => node.id === question.skillId);
      expect(skill, `${question.id} has a missing skill mapping`).toBeDefined();
      expect(skill?.domain, `${question.id} has the wrong domain mapping`).toBe(question.discipline);
      expect(skill?.gradeBand, `${question.id} has the wrong grade-band mapping`).toBe(question.targetGradeBand);
    }
  });

  it("keeps skill resolution explicit instead of inventing a fallback", () => {
    expect(resolveSkillForActivity("practice-session", "Mathematics", "fractions").skillId)
      .toBe("math-23-fractions");
    expect(resolveSkillForActivity("practice-session", "Reading", "vocabulary").skillId)
      .toBe("read-23-vocabulary-morphology");
    expect(resolveSkillForActivity("unregistered-general-activity").unmapped).toBe(true);
    expect(() => resolveSkillForActivity("read-not-a-real-skill")).toThrow(/Unknown curriculum skill/);
  });

  it("keeps every statically declared learning event attached to its canonical activity and experience", () => {
    const root = resolve(process.cwd(), "src");
    const findings: string[] = [];
    let eventCount = 0;

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
        if (ts.isCallExpression(node) && node.expression.getText(source).split(".").at(-1) === "recordLearningEvent" &&
          node.arguments[0] && ts.isObjectLiteralExpression(node.arguments[0])) {
          const properties = objectProperties(node.arguments[0]);
          const activityId = stringLiteral(properties.activityId);
          if (activityId) {
            eventCount += 1;
            const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
            let definition;
            try {
              definition = resolveActivityDefinition(activityId);
            } catch (error) {
              findings.push(`${relative(process.cwd(), filePath)}:${line}: ${String(error)}`);
            }
            if (definition) {
              const experienceId = stringLiteral(properties.experienceId);
              if (experienceId !== definition.experienceId) {
                findings.push(`${relative(process.cwd(), filePath)}:${line}: ${activityId} uses experience ${experienceId ?? "<missing>"}, expected ${definition.experienceId}`);
              }
              const skillId = stringLiteral(properties.skillId);
              if (skillId && !definition.skillIds.includes(skillId)) {
                findings.push(`${relative(process.cwd(), filePath)}:${line}: ${activityId} is not mapped to ${skillId}`);
              }
              const domain = stringLiteral(properties.domain);
              const skill = skillId && CURRICULUM_SKILL_NODES.find((candidate) => candidate.id === skillId);
              if (skill && domain && domain !== "general" && domain !== skill.domain) {
                findings.push(`${relative(process.cwd(), filePath)}:${line}: ${skillId} reports the wrong domain ${domain}`);
              }
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }

    expect(eventCount).toBeGreaterThan(20);
    expect(findings).toEqual([]);
  });
});
