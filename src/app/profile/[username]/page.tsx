import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfileClient from "./ProfileClient";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const cleanUsername = decodeURIComponent((await params).username);

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      linkedIn: true,
      website: true,
      building: true,
      _count: {
        select: {
          followers: true,
          following: true,
          likes: true,
          posts: true,
          comments: true,
        },
      },
      followers: {
        where: { followerId: currentUser?.id ?? "" },
        select: { id: true },
      },
    },
  });

  if (!user) {
    return <p className="text-center mt-10">User not found</p>;
  }

  const isFollowing = user.followers.length > 0;

  const postsRaw = await prisma.post.findMany({
    where: { author: { username: cleanUsername } },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      _count: { select: { likes: true, comments: true } },
      likes: currentUser
        ? { where: { userId: currentUser.id }, select: { id: true } }
        : false,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: true },
      },
    },
  });

  const posts = postsRaw.map((post) => ({
    ...post,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    likedByMe: currentUser ? post.likes.length > 0 : false,
  }));

  return (
    <ProfileClient
      user={user}
      currentUserId={currentUser?.id || ""}
      isFollowing={isFollowing}
      posts={posts} // 👈 comments are included here
    />
  );
}