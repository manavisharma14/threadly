// app/api/repost/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const existing = await prisma.repost.findFirst({
    where: { userId, postId },
  });

  if (existing) {
    return NextResponse.json({ error: "Already reposted" }, { status: 400 });
  }

  await prisma.repost.create({
    data: { userId, postId },
  });

  return NextResponse.json({ reposted: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  await prisma.repost.deleteMany({
    where: { userId, postId },
  });

  return NextResponse.json({ reposted: false });
}