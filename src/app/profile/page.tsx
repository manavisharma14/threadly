// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";
import { TimelineItem } from "@/types/timeline";
import { Prisma } from "@prisma/client";

// Type for repost query result with optional post
type RepostWithPost = Prisma.RepostGetPayload<{
  include: {
    post: {
      include: {
        author: true;
        replies: {
          select: {
            id: true;
            content: true;
            createdAt: true;
            author: true;
          };
        };
        _count: { select: { likes: true; replies: true; reposts: true } };
        likes: boolean;
      };
    };
  };
}>;

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <p className="text-center mt-10">You are not logged in.</p>;
  }

  // Fetch profile
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

  // Fetch posts
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
            createdAt: true,
            emailVerified: true,
            bio: true,
            linkedIn: true,
            website: true,
            building: true,
            updatedAt: true,
          },
        },
        replies: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                username: true,
                createdAt: true,
                emailVerified: true,
                bio: true,
                linkedIn: true,
                website: true,
                building: true,
                updatedAt: true,
              },
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
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }));

  // Fetch reposts
  const reposts = (
    await prisma.repost.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                username: true,
                createdAt: true,
                emailVerified: true,
                bio: true,
                linkedIn: true,
                website: true,
                building: true,
                updatedAt: true,
              },
            },
            replies: {
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    username: true,
                    createdAt: true,
                    emailVerified: true,
                    bio: true,
                    linkedIn: true,
                    website: true,
                    building: true,
                    updatedAt: true,
                  },
                },
              },
            },
            _count: { select: { likes: true, replies: true, reposts: true } },
            likes: {
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
        repostedByMe: true,
        replies: r.post!.replies.map((reply) => ({
          ...reply,
          createdAt: reply.createdAt.toISOString(),
        })),
      },
    }));

  // Merge into timeline
  const timeline: TimelineItem[] = [...posts, ...reposts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <ProfileClient session={session} user={user} posts={timeline} />;
}