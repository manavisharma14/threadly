import { prisma } from '@/lib/prisma'
import HomePageClient from '@/components/HomePageClient'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Post, User } from "@/types";


export default async function HomePage() {

  const session = await getServerSession(authOptions);

// app/page.tsx (HomePage)
const posts = await prisma.post.findMany({
  where: { parentId: null },
  orderBy: { createdAt: "desc" },
  include: {
    author: {
      select: { id: true, name: true, image: true, username: true },
    },
    replies: {
      include: {
        author: {
          select: { id: true, name: true, image: true, username: true },
        },
        _count: { select: { likes: true } }, // ✅ add count
        likes: session?.user?.email
          ? {
              where: { user: { email: session.user.email } },
              select: { id: true },
            }
          : false,
      },
      orderBy: { createdAt: "asc" },
    },
    _count: { select: { replies: true, likes: true } },
    likes: session?.user?.email
      ? {
          where: { user: { email: session.user.email } },
          select: { id: true },
        }
      : false,
  },
});

const safePosts: Post[] = posts.map((post) => ({
  ...post,
  createdAt: post.createdAt.toISOString(),
  repliesCount: post._count.replies,
  likesCount: post._count.likes,
  likedByMe: session?.user?.email ? post.likes.length > 0 : false,
  replies: post.replies.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  })),
}));
  const currentUser: User | null = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          image: true,
          bio: true,
          linkedIn: true,
          website: true,
          building: true,
        },
      })
    : null;

  return <HomePageClient initialPosts={safePosts} initialUser={currentUser} />;
}