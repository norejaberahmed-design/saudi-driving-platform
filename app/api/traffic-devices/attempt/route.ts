import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";
import { trafficDeviceSubmissionSchema } from "@/lib/validation";
import { gradeQuiz } from "@/lib/quiz";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = trafficDeviceSubmissionSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "بيانات الاختبار غير صحيحة." }, { status: 400 });

  const ids = parsed.data.answers.map(answer => answer.deviceId);
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length !== ids.length) {
    return NextResponse.json({ error: "يوجد عنصر مكرر في الإجابات." }, { status: 400 });
  }

  const devices = await prisma.trafficDevice.findMany({
    where: { id: { in: uniqueIds }, status: "published" },
    select: { id: true, title: true, question: true, choices: true, answer: true, explanation: true }
  });
  if (devices.length !== uniqueIds.length) {
    return NextResponse.json({ error: "تعذر التحقق من بعض عناصر الاختبار." }, { status: 400 });
  }

  const questionKeys = devices.map(device => ({
    id: device.id,
    prompt: device.question,
    correctIndex: device.answer,
    explanation: device.explanation,
    choices: Array.isArray(device.choices) ? device.choices.filter((choice): choice is string => typeof choice === "string") : []
  }));
  let graded;
  try {
    graded = gradeQuiz(parsed.data.answers.map(answer => ({
      questionId: answer.deviceId,
      selectedIndex: answer.selectedIndex
    })), questionKeys);
  } catch {
    return NextResponse.json({ error: "إحدى الإجابات لا تطابق خيارات العنصر." }, { status: 400 });
  }

  const session = await getSession();
  const attempt = await prisma.trafficDeviceAttempt.create({
    data: {
      userId: session?.user.id,
      visitorKey: session ? null : parsed.data.visitorKey ?? null,
      score: graded.score,
      correctCount: graded.correctCount,
      totalCount: graded.totalCount,
      answers: {
        create: graded.results.map(result => ({
          deviceId: result.questionId,
          selectedIndex: result.selectedIndex,
          isCorrect: result.isCorrect
        }))
      }
    },
    select: { id: true, score: true, correctCount: true, totalCount: true, completedAt: true }
  });

  const titleById = new Map(devices.map(device => [device.id, device.title]));
  return NextResponse.json({
    attempt,
    results: graded.results.map(result => ({
      ...result,
      title: titleById.get(result.questionId) ?? result.prompt
    }))
  });
}
