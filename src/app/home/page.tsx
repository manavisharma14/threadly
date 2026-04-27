import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HomePageClient from "./HomePageClient"

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <HomePageClient initialPosts={[]} initialUser={null} />;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          username: true,
        },
      },
      _count: { select: { replies: true, likes: true } },
      likes: {
        where: { userId: user?.id },
        select: { userId: true },
      },
    },
  });

  const formattedPosts = posts.map((post) => ({
    type: "post" as const,
    id: post.id,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    parentId: post.parentId,
    author: post.author,
    replies: [],
    repliesCount: post._count.replies,
    likesCount: post._count.likes,
    repostsCount: 0,
    likedByMe: post.likes.length > 0,
    repostedByMe: false,
  }));

  return <HomePageClient initialPosts={formattedPosts} initialUser={user} />;
}