import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Optional helper (guard ObjectId-ish strings)
const isLikelyObjectId = (v: string) => /^[0-9a-fA-F]{24}$/.test(v);

// GET /api/comments?postId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    if (!isLikelyObjectId(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
      },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("GET /api/comments error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/comments
// body: { postId: string, content: string }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    let { postId, content } = body as { postId?: string; content?: string };

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    if (!isLikelyObjectId(postId)) {
      return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
    }

    content = (content ?? "").trim();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }
    if (content.length > 500) {
      return NextResponse.json({ error: "Content too long (max 500)" }, { status: 400 });
    }

    // Resolve user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // (Optional) ensure post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId,            // or: post: { connect: { id: postId } }
        userId: user.id,   // <- IMPORTANT: pass userId field
        content,
      },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}