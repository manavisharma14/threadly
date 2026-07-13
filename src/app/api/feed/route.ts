// src/app/api/feed/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getHomeFeed } from "@/lib/feed";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const startedAt = performance.now();

  try {
    const posts = await getHomeFeed(session.user.id, 50);

    const durationMs = performance.now() - startedAt;

    return NextResponse.json({
      posts,
      metadata: {
        count: posts.length,
        durationMs: Number(durationMs.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Feed request failed:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}