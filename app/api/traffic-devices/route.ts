import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const group = url.searchParams.get("group");
  const devices = await prisma.trafficDevice.findMany({
    where: {
      status: "published",
      ...(group && ["لوحات", "علامات أرضية", "أجهزة الطريق"].includes(group) ? { group } : {})
    },
    orderBy: [{ group: "asc" }, { title: "asc" }],
    select: {
      id: true,
      group: true,
      title: true,
      meaning: true,
      action: true,
      context: true,
      shape: true,
      question: true,
      choices: true,
      officialReference: true
    }
  });
  return NextResponse.json({
    devices: devices.map(device => ({
      ...device,
      choices: Array.isArray(device.choices) ? device.choices.filter((choice): choice is string => typeof choice === "string") : []
    })),
    meta: {
      total: devices.length,
      groups: ["لوحات", "علامات أرضية", "أجهزة الطريق"]
    }
  });
}
