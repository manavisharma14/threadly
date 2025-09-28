import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";
import { TimelineItem } from "@/types/timeline";
import { Prisma } from "@prisma/client";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <p className="text-center mt-10">You are not logged in.</p>;
  }

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

  const posts = (
    await prisma.post.findMany({
      where: { author: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
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
          },
        },
        replies: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            parentId: true,
            author: {
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
              },
            },
            _count: { select: { likes: true, replies: true, reposts: true } },
            likes: {
              where: { user: { email: session.user.email } },
              select: { id: true },
            },
            reposts: {
              where: { user: { email: session.user.email } },
              select: { id: true },
            },
          },
        },
        _count: { select: { likes: true, replies: true, reposts: true } },
        likes: {
          where: { user: { email: session.user.email } },
          select: { id: true },
        },
        reposts: {
          where: { user: { email: session.user.email } },
          select: { id: true },
        },
      },
    })
  ).map((post) => ({
    
    type: "post" as const,
    id: post.id,
    parentId: post.parentId ?? null,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    author: post.author,
    likesCount: post._count.likes,
    repliesCount: post._count.replies,
    repostsCount: post._count.reposts,
    likedByMe: post.likes.length > 0,
    repostedByMe: post.reposts.length > 0,
    replies: post.replies.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      author: r.author,
      parentId: r.parentId ?? null,
      likesCount: r._count.likes,
      repliesCount: r._count.replies,
      repostsCount: r._count.reposts,
      likedByMe: r.likes.length > 0,
      repostedByMe: r.reposts.length > 0,
      replies: [], // Assuming replies are not nested further
    })),
  }));

  // Fetch reposts
  const reposts = (
    await prisma.repost.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            parentId: true,
            author: {
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
              },
            },
            replies: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                content: true,
                createdAt: true,
                parentId: true,
                author: {
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
                  },
                },
                _count: { select: { likes: true, replies: true, reposts: true } },
                likes: {
                  where: { user: { email: session.user.email } },
                  select: { id: true },
                },
                reposts: {
                  where: { user: { email: session.user.email } },
                  select: { id: true },
                },
              },
            },
            _count: { select: { likes: true, replies: true, reposts: true } },
            likes: {
              where: { user: { email: session.user.email } },
              select: { id: true },
            },
            reposts: {
              where: { user: { email: session.user.email } },
              select: { id: true },
            },
          },
        },
      },
    })
  )
    .filter((r) => r.post !== null) // Skip invalid reposts
    .map((r) => ({
      type: "repost" as const,
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      count: r.post!._count.reposts,
      post: {
        id: r.post!.id,
        parentId: r.post!.parentId ?? null,
        content: r.post!.content,
        createdAt: r.post!.createdAt.toISOString(),
        author: r.post!.author,
        likesCount: r.post!._count.likes,
        repliesCount: r.post!._count.replies,
        repostsCount: r.post!._count.reposts,
        likedByMe: r.post!.likes.length > 0,
        repostedByMe: r.post!.reposts.length > 0,
        replies: r.post!.replies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt.toISOString(),
          author: reply.author,
          parentId: reply.parentId ?? null,
          likesCount: reply._count.likes,
          repliesCount: reply._count.replies,
          repostsCount: reply._count.reposts,
          likedByMe: reply.likes.length > 0,
          repostedByMe: reply.reposts.length > 0,
          replies: [], // Assuming replies are not nested further
        })),
      },
    }));

  // Merge into timeline
  const timeline: TimelineItem[] = [...posts, ...reposts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <ProfileClient session={session} user={user} posts={timeline} />;
}