import { describe, expect, it } from "vitest";
import { devices, officialReferences } from "./traffic-devices";

describe("Saudi traffic-device starter catalogue integrity", () => {
  it("contains 45 uniquely identified learning records", () => {
    expect(devices).toHaveLength(45);
    expect(new Set(devices.map(device => device.id)).size).toBe(45);
  });

  it("keeps the published study question and answer key structurally valid", () => {
    for (const device of devices) {
      expect(device.title.length).toBeGreaterThan(1);
      expect(device.meaning.length).toBeGreaterThan(10);
      expect(device.action.length).toBeGreaterThan(10);
      expect(device.question.length).toBeGreaterThan(5);
      expect(device.choices.length).toBeGreaterThanOrEqual(2);
      expect(device.answer).toBeGreaterThanOrEqual(0);
      expect(device.answer).toBeLessThan(device.choices.length);
      expect(device.explanation.length).toBeGreaterThan(5);
    }
  });

  it("preserves the starter category counts without claiming official catalogue coverage", () => {
    expect(devices.filter(device => device.group === "لوحات")).toHaveLength(21);
    expect(devices.filter(device => device.group === "علامات أرضية")).toHaveLength(10);
    expect(devices.filter(device => device.group === "أجهزة الطريق")).toHaveLength(14);
  });

  it("only attaches a reference to an existing device identifier", () => {
    const ids = new Set(devices.map(device => device.id));
    expect(Object.keys(officialReferences).every(id => ids.has(id))).toBe(true);
  });
});
