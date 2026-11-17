import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [lessons, questions, trafficDevices] = await Promise.all([
      prisma.lesson.count({ where: { status: "published" } }),
      prisma.quizQuestion.count({ where: { status: "published" } }),
      prisma.trafficDevice.count({ where: { status: "published" } })
    ]);
    return NextResponse.json({
      status: "ok",
      database: "connected",
      content: { lessons, questions, trafficDevices }
    });
  } catch {
    return NextResponse.json({
      status: "degraded",
      database: "unavailable_or_schema_not_migrated"
    }, { status: 503 });
  }
}
