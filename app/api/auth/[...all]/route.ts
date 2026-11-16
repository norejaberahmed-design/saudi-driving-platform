import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

function unavailable() {
  return NextResponse.json(
    { error: "Authentication is not configured. Set BETTER_AUTH_SECRET before enabling accounts." },
    { status: 503 }
  );
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) return unavailable();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.BETTER_AUTH_SECRET) return unavailable();
  return handlers.POST(request);
}