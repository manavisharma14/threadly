import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST: create a new post for the logged-in user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content } = await req.json();

    const newPost = await prisma.post.create({
      data: {
        content,
        author: {
          connect: { email: session.user.email }, // link to logged-in user
        },
      },
      include: { author: true }, // return author details in response
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// GET: fetch all posts for logged-in user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { author: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
      include: { author: true },
    });

    return NextResponse.json({posts}); // no need to wrap in {posts}, keep it consistent
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}