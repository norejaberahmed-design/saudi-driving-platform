import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/dal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category")?.trim();
  const lessons = await prisma.lesson.findMany({
    where: {
      status: "published",
      ...(category && category.length <= 80 ? { category } : {})
    },
    orderBy: [{ category: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      level: true,
      durationMinutes: true,
      lastReviewedAt: true,
      sources: { select: { source: { select: { id: true, title: true, publisher: true, url: true, isOfficial: true, reviewedAt: true } } } }
    }
  });
  const session = await getSession();
  const completedIds = session
    ? await prisma.lessonProgress.findMany({
        where: { userId: session.user.id, lessonId: { in: lessons.map(lesson => lesson.id) } },
        select: { lessonId: true }
      })
    : [];
  const completed = new Set(completedIds.map(item => item.lessonId));
  return NextResponse.json({
    lessons: lessons.map(({ sources, ...lesson }) => ({
      ...lesson,
      completed: completed.has(lesson.id),
      sources: sources.map(item => item.source)
    }))
  });
}
