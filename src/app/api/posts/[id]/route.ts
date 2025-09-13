import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);


    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    // Find the post
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: { email: true } } },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Check ownership
    if (post.author.email !== session.user.email) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete post
    const deletedPost = await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(deletedPost, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        _count: {
          select: { comments: true, likes: true },
        },
        likes: session?.user?.email
          ? {
              where: { user: { email: session.user.email } },
              select: { id: true },
            }
          : false,
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Transform into safe shape for frontend
    const safePost = {
      ...post,
      createdAt: post.createdAt.toISOString(),
      commentsCount: post._count.comments,
      likesCount: post._count.likes,
      likedByMe: post.likes ? post.likes.length > 0 : false,
    };

    return NextResponse.json(safePost, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts/[id] error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}