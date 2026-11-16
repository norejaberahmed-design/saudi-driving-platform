import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";
import { quizSubmissionSchema } from "@/lib/validation";
import { gradeQuiz } from "@/lib/quiz";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const questions = await prisma.quizQuestion.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "asc" },
    take: 20,
    select: {
      id: true,
      prompt: true,
      choices: true,
      category: true,
      difficulty: true
    }
  });
  return NextResponse.json({ questions });
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
    select: { id: true, correctIndex: true, explanation: true, prompt: true }
  });
  if (questions.length !== uniqueIds.length) {
    return NextResponse.json({ error: "تعذر التحقق من بعض الأسئلة." }, { status: 400 });
  }

  const graded = gradeQuiz(parsed.data.answers, questions);
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