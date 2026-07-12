import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HomePageClient from "./HomePageClient"
import { getHomeFeed } from "@/lib/feed";

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

   if (!user) {

    return <HomePageClient initialPosts={[]} initialUser={null} />;

  }

  const posts = await getHomeFeed(user.id, 50);

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