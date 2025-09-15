// src/app/api/reposts/[postId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidObjectId } from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  // Validate postId format
  if (!isValidObjectId(postId)) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if post exists
    const postExists = await prisma.post.findUnique({ where: { id: postId } });
    if (!postExists) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const existing = await prisma.repost.findFirst({
      where: {
        postId,
        userId: session.user.id,
      },
    });

    if (existing) {
      await prisma.repost.delete({ where: { id: existing.id } });
      return NextResponse.json({ reposted: false });
    } else {
      await prisma.repost.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });
      return NextResponse.json({ reposted: true });
    }
  } catch (err) {
    console.error("Error toggling repost:", err);
    return NextResponse.json(
      { error: "Failed to toggle repost" },
      { status: 500 }
    );
  }
}