import { describe, expect, it } from "vitest";
import { licenseTracks, schoolStages } from "./driving-school";

describe("digital driving school curriculum", () => {
  it("provides the four Saudi driving licence tracks", () => {
    expect(licenseTracks.map(track => track.id)).toEqual([
      "private",
      "public",
      "motorcycle",
      "public-works"
    ]);
  });

  it("keeps a distinct vehicle-specific curriculum in every track", () => {
    const specificCurricula = licenseTracks.map(track => track.modules.slice(-2).map(module => module.id).join(","));
    for (const track of licenseTracks) {
      expect(track.modules.length).toBeGreaterThan(6);
      expect(new Set(track.modules.map(module => module.id)).size).toBe(track.modules.length);
    }
    expect(new Set(specificCurricula).size).toBe(licenseTracks.length);
  });

  it("includes the ten requested learner journey stages", () => {
    expect(schoolStages).toHaveLength(10);
  });

  it("keeps every lesson assessment answer within its choices", () => {
    for (const track of licenseTracks) {
      for (const lesson of track.modules) {
        expect(lesson.choices.length).toBeGreaterThanOrEqual(2);
        expect(lesson.answer).toBeGreaterThanOrEqual(0);
        expect(lesson.answer).toBeLessThan(lesson.choices.length);
        expect(lesson.objective.length).toBeGreaterThan(10);
        expect(lesson.feedback.length).toBeGreaterThan(10);
      }
    }
  });

  it("contains practical, vehicle-orientation and scenario lessons", () => {
    for (const track of licenseTracks) {
      expect(track.modules.some(module => module.kind === "تعرف على المركبة")).toBe(true);
      expect(track.modules.some(module => module.kind === "مهارة عملية")).toBe(true);
      expect(track.modules.some(module => module.kind === "موقف مروري")).toBe(true);
    }
  });
});
