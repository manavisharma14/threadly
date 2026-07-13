// src/lib/feed.ts

import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

const FEED_LIMIT = 50;
const FEED_TTL_SECONDS = 60 * 60 * 24;

const FEED_PAYLOAD_TTL_SECONDS = 60;

function feedPayloadKey(userId: string) {
  return `feed:payload:${userId}`;
}
// comment

function feedKey(userId: string) {
  return `feed:${userId}`;
}

async function getFollowingIds(userId: string) {
  const follows = await prisma.follows.findMany({
    where: {
      followerId: userId,
    },
    select: {
      followingId: true,
    },
  });

  return follows.map((follow) => follow.followingId);
}

async function getPostsFromDatabase(userId: string, limit = FEED_LIMIT) {
  const followingIds = await getFollowingIds(userId);

  // Early-stage fallback: show global posts when the user follows nobody.
  if (followingIds.length === 0) {
    return prisma.post.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        createdAt: true,
      },
    });
  }

  const personalizedPosts = await prisma.post.findMany({
    where: {
      parentId: null,
      authorId: {
        in: [userId, ...followingIds],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: {
      id: true,
      createdAt: true,
    },
  });

  // Backfill sparse personalized feeds with recent global posts.
  if (personalizedPosts.length < limit) {
    const globalPosts = await prisma.post.findMany({
      where: {
        parentId: null,
        id: {
          notIn: personalizedPosts.map((post) => post.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit - personalizedPosts.length,
      select: {
        id: true,
        createdAt: true,
      },
    });

    return [...personalizedPosts, ...globalPosts].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  return personalizedPosts;
}

async function rebuildFeed(userId: string, limit = FEED_LIMIT) {
  const posts = await getPostsFromDatabase(userId, limit);
  const key = feedKey(userId);

  if (posts.length === 0) {
    await redis.set(`${key}:initialized`, "1", {
      ex: FEED_TTL_SECONDS,
    });

    return [];
  }

  const pipeline = redis.pipeline();

  for (const post of posts) {
    pipeline.zadd(key, {
      score: post.createdAt.getTime(),
      member: post.id,
    });
  }

  pipeline.expire(key, FEED_TTL_SECONDS);
  pipeline.set(`${key}:initialized`, "1", {
    ex: FEED_TTL_SECONDS,
  });

  await pipeline.exec();

  return posts.map((post) => post.id);
}

async function getFeedPostIds(userId: string, limit = FEED_LIMIT) {
  const key = feedKey(userId);

  try {
    const postIds = await redis.zrange<string[]>(key, 0, limit - 1, {
      rev: true,
    });

    if (postIds.length > 0) {
      return postIds;
    }

    const initialized = await redis.exists(`${key}:initialized`);

    if (initialized) {
      return [];
    }

    return rebuildFeed(userId, limit);
  } catch (error) {
    console.error("Redis feed lookup failed", error);

    const posts = await getPostsFromDatabase(userId, limit);
    return posts.map((post) => post.id);
  }
}
export async function getHomeFeed(userId: string, limit = FEED_LIMIT) {
  const payloadKey = feedPayloadKey(userId);

  try {
    const cachedFeed = await redis.get<
  Array<{
    id: string;
    content: string;
    createdAt: string;
    parentId: string | null;
    author: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
      username: string | null;
    };
    _count: {
      replies: number;
      likes: number;
    };
    likes: Array<{
      userId: string;
    }>;
  }>
>(payloadKey);

if (cachedFeed) {
  return cachedFeed.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
  }));
}
  } catch (error) {
    console.error("Feed payload cache read failed:", error);
  }

  const postIds = await getFeedPostIds(userId, limit);

  if (postIds.length === 0) {
    return [];
  }

  const posts = await prisma.post.findMany({
    where: {
      id: {
        in: postIds,
      },
      parentId: null,
    },
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
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
  });

  const order = new Map(
    postIds.map((postId, index) => [postId, index])
  );

  posts.sort(
    (a, b) =>
      (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(b.id) ?? Number.MAX_SAFE_INTEGER)
  );

  try {
    await redis.set(payloadKey, posts, {
      ex: FEED_PAYLOAD_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Feed payload cache write failed:", error);
  }

  return posts;
}
const MAX_CACHED_POSTS = 1_000;

export async function fanOutPost({
  postId,
  authorId,
  createdAt,
}: {
  postId: string;
  authorId: string;
  createdAt: Date;
}) {
  const followers = await prisma.follows.findMany({
    where: {
      followingId: authorId,
    },
    select: {
      followerId: true,
    },
  });

  const recipientIds = [
    authorId,
    ...followers.map((follow) => follow.followerId),
  ];

  const score = createdAt.getTime();
  const pipeline = redis.pipeline();

  for (const recipientId of recipientIds) {
    const key = feedKey(recipientId);

    // Always invalidate the hydrated payload cache.
    pipeline.del(feedPayloadKey(recipientId));

    const initialized = await redis.exists(`${key}:initialized`);

    if (!initialized) {
      continue;
    }

    pipeline.zadd(key, {
      score,
      member: postId,
    });

    pipeline.zremrangebyrank(
      key,
      0,
      -(MAX_CACHED_POSTS + 1)
    );

    pipeline.expire(key, FEED_TTL_SECONDS);

    pipeline.expire(
      `${key}:initialized`,
      FEED_TTL_SECONDS
    );
  }

  await pipeline.exec();
}

