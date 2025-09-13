import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all top-level posts (public feed)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { parentId: null }, // only top-level posts
      include: {
        author: { select: { id: true, name: true, image: true, username: true } },
        _count: { select: { replies: true, likes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new top-level post (requires login)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: session.user.id, // ✅ linked to logged-in user
        parentId: null,
      },
      include: { author: true },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}