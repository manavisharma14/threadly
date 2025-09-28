import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileClient from "./ProfileClient";
import { TimelineItem, TimelinePost, TimelineRepost } from "@/types/timeline";
import { Post, User } from "@/types";

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

  // 1. Fetch original posts by the user
  const originalPosts = await prisma.post.findMany({
    where: { author: { username: cleanUsername } },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      _count: { select: { likes: true, replies: true, reposts: true } },
      likes: currentUser
        ? { where: { userId: currentUser.id }, select: { id: true } }
        : false,
      replies: {
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          _count: { select: { likes: true, replies: true, reposts: true } },
          likes: currentUser
            ? { where: { userId: currentUser.id }, select: { id: true } }
            : false,
          reposts: currentUser
            ? { where: { userId: currentUser.id }, select: { id: true } }
            : false,
        },
      },
    },
  });

  // 2. Fetch reposts made by the user
  const reposts = await prisma.repost.findMany({
    where: { user: { username: cleanUsername } },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          author: true,
          _count: { select: { likes: true, replies: true, reposts: true } },
          likes: currentUser
            ? { where: { userId: currentUser.id }, select: { id: true } }
            : false,
          replies: {
            orderBy: { createdAt: "desc" },
            include: {
              author: true,
              _count: { select: { likes: true, replies: true, reposts: true } },
              likes: currentUser
                ? { where: { userId: currentUser.id }, select: { id: true } }
                : false,
              reposts: currentUser
                ? { where: { userId: currentUser.id }, select: { id: true } }
                : false,
            },
          },
        },
      },
    },
  });

  // 3. Normalize original posts
  const normalizedPosts: TimelinePost[] = await Promise.all(
    originalPosts.map(async (post) => {
      const repostedByMe = currentUser
        ? (await prisma.repost.findFirst({
            where: { userId: currentUser.id, postId: post.id },
          })) !== null
        : false;

      return {
        type: "post" as const,
        id: post.id,
        content: post.content,
        createdAt: post.createdAt.toISOString(),
        author: post.author,
        authorId: post.authorId,
        parentId: post.parentId ?? null,
        likesCount: post._count.likes,
        repliesCount: post._count.replies,
        repostsCount: post._count.reposts,
        likedByMe: currentUser ? post.likes.length > 0 : false,
        repostedByMe,
        replies: post.replies.map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt.toISOString(),
          author: r.author,
          authorId: r.authorId,
          parentId: r.parentId ?? null,
          replies: [],
          likesCount: r._count.likes,
          repliesCount: r._count.replies,
          repostsCount: r._count.reposts,
          likedByMe: currentUser ? r.likes.length > 0 : false,
          repostedByMe: currentUser ? r.reposts.length > 0 : false,
        })),
      };
    })
  );

  // 4. Normalize reposts
  const normalizedReposts: TimelineRepost[] = reposts
    .filter((repost) => repost.post !== null)
    .map((repost) => ({
      type: "repost" as const,
      id: repost.id,
      count: repost.post!._count.reposts,
      createdAt: repost.createdAt.toISOString(),
      post: {
        id: repost.post!.id,
        content: repost.post!.content,
        createdAt: repost.post!.createdAt.toISOString(),
        author: repost.post!.author,
        authorId: repost.post!.authorId,
        parentId: repost.post!.parentId ?? null,
        likesCount: repost.post!._count.likes,
        repliesCount: repost.post!._count.replies,
        repostsCount: repost.post!._count.reposts,
        likedByMe: currentUser ? repost.post!.likes.length > 0 : false,
        repostedByMe: currentUser
          ? reposts.some((r) => r.postId === repost.post!.id && r.userId === currentUser.id)
          : false,
        replies: repost.post!.replies.map((r) => ({
          id: r.id,
          content: r.content,
          createdAt: r.createdAt.toISOString(),
          author: r.author,
          authorId: r.authorId,
          parentId: r.parentId ?? null,
          replies: [],
          likesCount: r._count.likes,
          repliesCount: r._count.replies,
          repostsCount: r._count.reposts,
          likedByMe: currentUser ? r.likes.length > 0 : false,
          repostedByMe: currentUser ? r.reposts.length > 0 : false,
        })),
      },
    }));

  // 5. Merge & sort timeline
  const timeline: TimelineItem[] = [...normalizedPosts, ...normalizedReposts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <ProfileClient
      user={user}
      currentUserId={currentUser?.id || ""}
      isFollowing={isFollowing}
      posts={timeline}
    />
  );
}