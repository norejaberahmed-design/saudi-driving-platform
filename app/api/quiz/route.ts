import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";
import { quizSubmissionSchema } from "@/lib/validation";
import { gradeQuiz } from "@/lib/quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category")?.trim();
  const requestedCount = Number(url.searchParams.get("count") ?? 20);
  const count = Number.isFinite(requestedCount) ? Math.min(30, Math.max(1, Math.floor(requestedCount))) : 20;
  const where = {
    status: "published",
    ...(category && category.length <= 80 ? { category } : {})
  };
  const available = await prisma.quizQuestion.findMany({
    where,
    orderBy: { createdAt: "asc" },
    take: 200,
    select: {
      id: true,
      prompt: true,
      choices: true,
      category: true,
      difficulty: true
    }
  });
  // Shuffle on the server so repeated visits do not always expose the same sequence.
  const questions = [...available]
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count)
    .map(({ value }) => value);
  return NextResponse.json({
    questions,
    meta: { requestedCount: count, availableCount: available.length, returnedCount: questions.length, category: category || null }
  });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = quizSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات الإجابة غير صحيحة." }, { status: 400 });
  }

  const session = await getSession();
  const ids = parsed.data.answers.map(answer => answer.questionId);
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length !== ids.length) {
    return NextResponse.json({ error: "يوجد سؤال مكرر في الإجابات." }, { status: 400 });
  }

  const questions = await prisma.quizQuestion.findMany({
    where: { id: { in: uniqueIds }, status: "published" },
    select: { id: true, correctIndex: true, explanation: true, prompt: true, choices: true }
  });
  if (questions.length !== uniqueIds.length) {
    return NextResponse.json({ error: "تعذر التحقق من بعض الأسئلة." }, { status: 400 });
  }

  let graded;
  try {
    graded = gradeQuiz(parsed.data.answers, questions.map(question => ({
      ...question,
      choices: Array.isArray(question.choices) ? question.choices.filter((choice): choice is string => typeof choice === "string") : []
    })));
  } catch {
    return NextResponse.json({ error: "توجد إجابة خارج خيارات السؤال أو بيانات غير صالحة." }, { status: 400 });
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: session?.user.id,
      visitorKey: session ? null : parsed.data.visitorKey,
      score: graded.score,
      correctCount: graded.correctCount,
      totalCount: graded.totalCount,
      answers: {
        create: graded.results.map(answer => ({
          questionId: answer.questionId,
          selectedIndex: answer.selectedIndex,
          isCorrect: answer.isCorrect
        }))
      }
    },
    select: { id: true, score: true, correctCount: true, totalCount: true, completedAt: true }
  });

  return NextResponse.json({ attempt, results: graded.results });
}
