// app/page.tsx
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import HomePageClient from '@/components/HomePageClient';
import { Post, User } from '@/types';
import { TimelineItem } from '@/types/timeline';
import { Prisma } from '@prisma/client';

// Type for repost query result with optional post
type RepostWithPost = Prisma.RepostGetPayload<{
  include: {
    post: {
      include: {
        author: true;
        replies: { include: { author: true; _count: { select: { likes: true } }; likes: boolean } };
        _count: { select: { replies: true; likes: true; reposts: true } };
        likes: boolean;
      };
    };
  };
}>;

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  

  const posts = await prisma.post.findMany({
    where: { parentId: null },
    orderBy: { createdAt: 'desc' },
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
          _count: { select: { likes: true } },
          likes: session?.user?.email
            ? {
                where: { user: { email: session.user.email } },
                select: { id: true },
              }
            : false,
        },
        orderBy: { createdAt: 'asc' },
      },
      _count: { select: { replies: true, likes: true, reposts: true } },
      likes: session?.user?.email
        ? {
            where: { user: { email: session.user.email } },
            select: { id: true },
          }
        : false,
      reposts: session?.user?.email
        ? {
            where: { user: { email: session.user.email } },
            select: { id: true },
          }
        : false,
    },
  });

  // Fetch reposts
  const reposts: RepostWithPost[] = session?.user?.email
    ? await prisma.repost.findMany({
        where: { user: { email: session.user.email } },
        orderBy: { createdAt: 'desc' },
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
                  _count: { select: { likes: true } },
                  likes: session?.user?.email
                    ? {
                        where: { user: { email: session.user.email } },
                        select: { id: true },
                      }
                    : false,
                },
                orderBy: { createdAt: 'asc' },
              },
              _count: { select: { replies: true, likes: true, reposts: true } },
              likes: session?.user?.email
                ? {
                    where: { user: { email: session.user.email } },
                    select: { id: true },
                  }
                : false,
            },
          },
        },
      })
    : [];

  // Map posts to TimelinePost
  const safePosts: TimelineItem[] = posts.map((post) => ({
    type: 'post' as const,
    id: post.id,
    content: post.content,
    createdAt: post.createdAt.toISOString(),
    parentId: post.parentId ?? null,
    author: post.author,
    repliesCount: post._count.replies,
    likesCount: post._count.likes,
    repostsCount: post._count.reposts,
    likedByMe: session?.user?.email ? post.likes.length > 0 : false,
    repostedByMe: session?.user?.email ? post.reposts.length > 0 : false,
    replies: post.replies.map((r) => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
      parentId: r.parentId ?? null,
      author: r.author,
      repliesCount: 0, // Assuming replies count is not applicable for reposts
      likesCount: r._count.likes,
      likedByMe: session?.user?.email ? r.likes.length > 0 : false,
      repostsCount: 0, // Assuming reposts are not applicable for replies
      replies: [], // Assuming nested replies are not included
    })),
  }));

  // Map reposts to TimelineRepost (filter out invalid ones where post is null)
  const safeReposts: TimelineItem[] = reposts
    .filter((r) => r.post !== null) // Skip invalid reposts
    .map((r) => ({
      type: 'repost' as const,
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      count: r.post!._count.reposts,
      post: {
        id: r.post!.id,
        content: r.post!.content,
        createdAt: r.post!.createdAt.toISOString(),
        parentId: r.post!.parentId ?? null,
        author: r.post!.author,
        repliesCount: r.post!._count.replies, // Fixed typo
        likesCount: r.post!._count.likes,
        repostsCount: r.post!._count.reposts,
        likedByMe: session?.user?.email ? r.post!.likes.length > 0 : false,
        repostedByMe: true,
        replies: r.post!.replies.map((reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt.toISOString(),
          parentId: reply.parentId ?? null,
          author: reply.author,
          repliesCount: 0, // Assuming replies count is not applicable for replies
          likesCount: reply._count.likes,
          likedByMe: session?.user?.email ? reply.likes.length > 0 : false,
          repostsCount: 0, // Assuming reposts are not applicable for replies
          replies: [], // Assuming nested replies are not included
        })),
      },
    }));

  // Merge into timeline
  const timeline: TimelineItem[] = [...safePosts, ...safeReposts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Fetch current user
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

  return <HomePageClient initialPosts={timeline} initialUser={currentUser} />;
}