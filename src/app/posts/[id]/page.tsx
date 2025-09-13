import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostPageClient from "./PostPageClient";
import { Post } from "@/types";

async function getPostById(id: string) {
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
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { replies: true, likes: true } },
    },
  });
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) notFound();

  const safePost: Post = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    repliesCount: post._count.replies,
    likesCount: post._count.likes,
    likedByMe: false, // if you want to check session, add logic here
    replies: post.replies.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return <PostPageClient post={safePost} />;
}