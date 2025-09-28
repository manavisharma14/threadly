import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostPageClient from "./PostPageClient";
import { Post } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getPostById(id: string, userEmail?: string | null) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, image: true, username: true },
      },
      replies: {
        include: {
          author: {
            select: { id: true, name: true, image: true, username: true },
          },
          _count: { select: { likes: true } },
          likes: userEmail
            ? {
                where: { user: { email: userEmail } },
                select: { id: true },
              }
            : false,
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { replies: true, likes: true, reposts: true } },
      likes: userEmail
        ? {
            where: { user: { email: userEmail } },
            select: { id: true },
          }
        : false,
    },
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  // Await the params promise to resolve the id
  const { id } = await params;

  const post = await getPostById(id, session?.user?.email);
  if (!post) notFound();

  const safePost: Post = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    repliesCount: post._count.replies,
    repostsCount: post._count.reposts,
    likesCount: post._count.likes,
    likedByMe: session?.user?.email ? post.likes.length > 0 : false,
    replies: post.replies.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      replies: [],
      repliesCount: 0,
      repostsCount: 0,
      likesCount: r._count.likes,
      likedByMe: session?.user?.email ? r.likes.length > 0 : false,
      repostedByMe: false,
    })),
  };

  return <PostPageClient post={safePost} />;
}