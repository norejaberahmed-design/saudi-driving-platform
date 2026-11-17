export type QuizInputAnswer = { questionId: string; selectedIndex: number };
export type QuizKey = { id: string; correctIndex: number; explanation: string; prompt: string; choices?: string[] };

export function gradeQuiz(answers: QuizInputAnswer[], questions: QuizKey[]) {
  const questionMap = new Map(questions.map(question => [question.id, question]));
  if (answers.length === 0 || answers.some(answer => !questionMap.has(answer.questionId))) {
    throw new Error("INVALID_ANSWERS");
  }
  if (new Set(answers.map(answer => answer.questionId)).size !== answers.length) {
    throw new Error("DUPLICATE_ANSWERS");
  }
  const results = answers.map(answer => {
    const question = questionMap.get(answer.questionId)!;
    if (!Number.isInteger(answer.selectedIndex) || answer.selectedIndex < 0 ||
        (question.choices && answer.selectedIndex >= question.choices.length)) {
      throw new Error("INVALID_SELECTION");
    }
    return {
      questionId: answer.questionId,
      selectedIndex: answer.selectedIndex,
      correctIndex: question.correctIndex,
      correctAnswer: question.choices?.[question.correctIndex] ?? null,
      isCorrect: answer.selectedIndex === question.correctIndex,
      explanation: question.explanation,
      prompt: question.prompt
    };
  });
  const correctCount = results.filter(result => result.isCorrect).length;
  const totalCount = results.length;
  return { results, correctCount, totalCount, score: Math.round(correctCount / totalCount * 100) };
}
