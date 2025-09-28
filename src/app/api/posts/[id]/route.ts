import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET single post + its replies
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    const post = await prisma.post.findUnique({
      where: { id: (await params).id },
      include: {
        author: { select: { id: true, name: true, image: true, username: true } },
        _count: { select: { replies: true, likes: true } },
        replies: {
          include: {
            author: { select: { id: true, name: true, image: true, username: true } },
            _count: { select: { likes: true } },
            likes: { select: { userId: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        likes: { select: { userId: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const likedByMe = session?.user?.id
      ? post.likes.some((like) => like.userId === session.user.id)
      : false;

    const formattedPost = {
      ...post,
      likesCount: post._count.likes,
      repliesCount: post._count.replies,
      likedByMe,
      replies: post.replies.map((r) => ({
        ...r,
        likesCount: r._count.likes,
        likedByMe: session?.user?.id
          ? r.likes.some((like) => like.userId === session.user.id)
          : false,
      })),
    };

    return NextResponse.json(formattedPost);
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// POST reply
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const reply = await prisma.post.create({
      data: {
        content,
        parentId: (await params).id,
        authorId: session.user.id,
      },
      include: { author: true },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (err) {
    console.error("Error creating reply:", err);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}