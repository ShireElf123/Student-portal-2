import { describe, expect, it } from "vitest";
import {
  countingBand,
  countingHintFromActivity,
  countingLevelForPlace,
  farmChicksVictoryLines,
  generateCountingScenario,
  pickCountingTemplate,
  shouldUseFarmChicksVictoryQueue,
  spokenPromptGivesCountAway,
  stripSpokenCountOut,
} from "./toddlerReplayEngine";

describe("counting growth bands", () => {
  it("keeps the first road at 1–5, then 6–10, then 11–20", () => {
    expect(countingBand(countingLevelForPlace(0, 1))).toEqual({ min: 1, max: 5, label: "1 to 5" });
    expect(countingBand(countingLevelForPlace(1, 1))).toEqual({ min: 6, max: 10, label: "6 to 10" });
    expect(countingBand(countingLevelForPlace(2, 1))).toEqual({ min: 11, max: 20, label: "11 to 20" });
    expect(countingLevelForPlace(0, 3)).toBe(1);
    expect(countingLevelForPlace(0, 2)).toBe(1);
  });

  it("never rolls a demo-sized 1–5 group on a later land", () => {
    for (let i = 0; i < 20; i++) {
      const mid = generateCountingScenario(2);
      expect(mid.targetCount).toBeGreaterThanOrEqual(6);
      expect(mid.targetCount).toBeLessThanOrEqual(10);
      const deep = generateCountingScenario(3);
      expect(deep.targetCount).toBeGreaterThanOrEqual(11);
      expect(deep.targetCount).toBeLessThanOrEqual(20);
    }
  });

  it("keeps Count the Yellow Chicks on three farm chicks and the authored line", () => {
    const pool = [
      { name: "Pond Ducks", emoji: "🦆", sound: "Quack!", bg: "from-sky-900 to-cyan-950", text: "text-yellow-200" },
      { name: "Farm Chicks", emoji: "🐤", sound: "Cheep!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
    ];
    expect(pickCountingTemplate(pool, "Count the Yellow Chicks").name).toBe("Farm Chicks");
    const hint = countingHintFromActivity({
      title: "Count the Yellow Chicks",
      spokenPrompt: "Look at the cozy hay! Count the fluffy yellow chicks: one, two, three!",
      options: [
        { id: "1", label: "1 Chick", isCorrect: false },
        { id: "3", label: "3 Yellow Chicks", isCorrect: true },
        { id: "5", label: "5 Chicks", isCorrect: false },
      ],
    });
    const scenario = generateCountingScenario(1, pool, hint);
    expect(scenario.targetCount).toBe(3);
    expect(scenario.itemName).toBe("Farm Chicks");
    expect(scenario.spokenPrompt).toContain("fluffy yellow chicks");
    expect(scenario.spokenPrompt.toLowerCase()).not.toContain("one, two, three");
    expect(scenario.spokenPrompt).toContain("How many do you see?");
  });

  it("varies the count on replay when the authored total is not locked", () => {
    const pool = [
      { name: "Farm Chicks", emoji: "🐤", sound: "Cheep!", bg: "from-yellow-900 to-amber-950", text: "text-yellow-200" },
    ];
    const counts = new Set(
      Array.from({ length: 24 }, () => generateCountingScenario(1, pool, { title: "Count the Yellow Chicks" }).targetCount),
    );
    expect(counts.size).toBeGreaterThan(1);
    expect([...counts].every((count) => count >= 1 && count <= 5)).toBe(true);
  });

  it("strips count-out spoiler lines without losing the scene", () => {
    expect(spokenPromptGivesCountAway("Count the chicks: one, two, three!")).toBe(true);
    expect(stripSpokenCountOut("Look at the cozy hay! Count the fluffy yellow chicks: one, two, three!")).toBe(
      "Look at the cozy hay! Count the fluffy yellow chicks.",
    );
  });

  it("builds Farm Valley Farm Chicks victory beats only for counts 1–5", () => {
    expect(farmChicksVictoryLines(3)).toEqual([
      "Hooray! That's right!",
      "3!",
      "Farm Chicks!",
      "Cheep!",
    ]);
    expect(farmChicksVictoryLines(1)?.[1]).toBe("1!");
    expect(farmChicksVictoryLines(5)?.[1]).toBe("5!");
    expect(farmChicksVictoryLines(6)).toBeNull();
    expect(farmChicksVictoryLines(0)).toBeNull();
    expect(shouldUseFarmChicksVictoryQueue("farm-valley", "Farm Chicks", 3)).toBe(true);
    expect(shouldUseFarmChicksVictoryQueue("jungle-canopy", "Farm Chicks", 3)).toBe(false);
    expect(shouldUseFarmChicksVictoryQueue("farm-valley", "Pond Ducks", 3)).toBe(false);
  });
});
