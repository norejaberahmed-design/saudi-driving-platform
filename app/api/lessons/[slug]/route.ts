import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const lesson = await prisma.lesson.findFirst({
    where: { slug, status: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      level: true,
      durationMinutes: true,
      content: true,
      lastReviewedAt: true,
      sources: { select: { source: { select: { id: true, title: true, publisher: true, url: true, isOfficial: true, reviewedAt: true } } } }
    }
  });
  if (!lesson) return NextResponse.json({ error: "الدرس غير متاح." }, { status: 404 });
  const session = await getSession();
  const progress = session
    ? await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
        select: { completedAt: true }
      })
    : null;
  return NextResponse.json({
    lesson: {
      ...lesson,
      completedAt: progress?.completedAt ?? null,
      sources: lesson.sources.map(item => item.source)
    }
  });
}
