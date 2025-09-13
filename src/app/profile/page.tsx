// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <p className="text-center mt-10">You are not logged in.</p>;
  }

  // fetch profile
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      linkedIn: true,
      website: true,
      building: true,
    },
  });

const posts = (await prisma.post.findMany({
  where: { author: { email: session.user.email } },
  orderBy: { createdAt: "desc" },
  include: {
    author: true,
    comments: {
      orderBy: { createdAt: "desc" }, 
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, image: true, username: true },
        },
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    likes: {
      where: { user: { email: session.user.email } },
      select: { id: true },
    },
  },
})).map(post => ({
  ...post,
  createdAt: post.createdAt.toISOString(),
  likesCount: post._count.likes,
  commentsCount: post._count.comments,
  likedByMe: post.likes.length > 0,
  comments: post.comments.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  })),
}));

  return <ProfileClient session={session} user={user} posts={posts} />;
}