import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type Params = { params: { id: string } };

// GET single post + its replies
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, image: true, username: true } },
        replies: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (err) {
    console.error("Error fetching post:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

// POST a reply
export async function POST(req: NextRequest, { params }: Params) {
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
        parentId: params.id,
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