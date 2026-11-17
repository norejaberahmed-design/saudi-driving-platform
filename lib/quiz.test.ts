import { describe, expect, it } from "vitest";
import { gradeQuiz } from "./quiz";

describe("gradeQuiz", () => {
  const questions = [
    { id: "q1", correctIndex: 1, explanation: "شرح السؤال الأول", prompt: "السؤال الأول" },
    { id: "q2", correctIndex: 0, explanation: "شرح السؤال الثاني", prompt: "السؤال الثاني" }
  ];

  it("grades answers on the server-side key and returns explanations", () => {
    const result = gradeQuiz([
      { questionId: "q1", selectedIndex: 1 },
      { questionId: "q2", selectedIndex: 2 }
    ], questions);

    expect(result.correctCount).toBe(1);
    expect(result.totalCount).toBe(2);
    expect(result.score).toBe(50);
    expect(result.results[0].explanation).toBe("شرح السؤال الأول");
  });

  it("rejects unknown question identifiers", () => {
    expect(() => gradeQuiz([{ questionId: "unknown", selectedIndex: 0 }], questions))
      .toThrow("INVALID_ANSWERS");
  });

  it("rejects an answer index outside the available options", () => {
    expect(() => gradeQuiz(
      [{ questionId: "q1", selectedIndex: 9 }],
      [{ ...questions[0], choices: ["أ", "ب", "ج"] }]
    )).toThrow("INVALID_SELECTION");
  });

  it("rejects duplicate answers for one question", () => {
    expect(() => gradeQuiz([
      { questionId: "q1", selectedIndex: 1 },
      { questionId: "q1", selectedIndex: 0 }
    ], questions)).toThrow("DUPLICATE_ANSWERS");
  });

  it("returns the correct option only in the graded result", () => {
    const result = gradeQuiz(
      [{ questionId: "q1", selectedIndex: 0 }],
      [{ ...questions[0], choices: ["خطأ", "صحيح", "خيار"] }]
    );
    expect(result.results[0].correctAnswer).toBe("صحيح");
  });

  it("rounds percentage scores consistently", () => {
    const result = gradeQuiz([
      { questionId: "q1", selectedIndex: 1 },
      { questionId: "q2", selectedIndex: 0 },
      { questionId: "q3", selectedIndex: 0 }
    ], [...questions, { id: "q3", correctIndex: 0, explanation: "شرح", prompt: "سؤال" }]);
    expect(result.score).toBe(100);
  });
});