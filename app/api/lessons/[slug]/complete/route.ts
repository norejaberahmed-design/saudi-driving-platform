import { NextResponse } from "next/server";
import { getSession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "سجّل الدخول لحفظ تقدمك." }, { status: 401 });

  const { slug } = await context.params;
  const lesson = await prisma.lesson.findFirst({
    where: { slug, status: "published" },
    select: { id: true }
  });
  if (!lesson) return NextResponse.json({ error: "الدرس غير متاح." }, { status: 404 });

  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    update: { completedAt: new Date() },
    create: { userId: session.user.id, lessonId: lesson.id }
  });

  return NextResponse.json({ saved: true });
}