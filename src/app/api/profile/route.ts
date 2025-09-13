import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id; // safely extract id

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { id: true, name: true, image: true, username: true },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: { id: true, name: true, image: true, username: true },
          },
        },
      },
      likes: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false, // ✅ use userId variable here
      _count: { select: { comments: true, likes: true } },
    },
  });

  // ✅ Map Prisma results into your Post type
  const formatted = posts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    comments: post.comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    })),
    commentsCount: post._count.comments,
    likesCount: post._count.likes,
    likedByMe: post.likes ? post.likes.length > 0 : false,
  }));

  return NextResponse.json(formatted);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { username, bio, linkedIn, website, building } = await req.json();

  try {
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: { username, bio, linkedIn, website, building },
      select: {
        username: true,
        bio: true,
        linkedIn: true,
        website: true,
        building: true,
      },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e?.code === "P2002")
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 409 }
      );
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
