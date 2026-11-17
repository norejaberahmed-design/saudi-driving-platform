import { NextResponse } from "next/server";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "سجّل الدخول لعرض سجل اختبارات حسابك." }, { status: 401 });
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { completedAt: "desc" },
    take: 30,
    select: {
      id: true,
      score: true,
      correctCount: true,
      totalCount: true,
      completedAt: true,
      answers: {
        select: {
          selectedIndex: true,
          isCorrect: true,
          question: { select: { id: true, prompt: true, choices: true, explanation: true, category: true } }
        }
      }
    }
  });
  return NextResponse.json({ attempts });
}
