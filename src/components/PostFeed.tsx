"use client";
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";
import CommentButton from "./CommentButton";
import Link from "next/link";
import { Post } from "@/types";
import CommentForm from "./CommentForm";

interface PostFeedProps {
  posts: Post[];
  newPost?: Post;
}

export default function PostFeed({ posts: initialPosts, newPost }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // Optimistically add a new post when it's created
  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  if (!posts.length) return <p>No posts yet</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b border-gray-300 py-4">
            {/* Post header */}
            <div className="mb-4 flex justify-between items-start">
              {/* Post content */}
              <Link href={`/posts/${post.id}`} className="flex-1">
                <p className=" text-gray-800">{post.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </Link>

              {/* Author info */}
              {post.author ? (
                <Link
                  href={`/profile/${post.author.username}`}
                  className="flex items-center gap-2 ml-4"
                >
                  <img
                    src={post.author.image || "/default-avatar.png"}
                    alt={post.author.name || "Author"}
                    className="w-6 h-6 rounded-full"
                  />
                  <p className="text-sm text-gray-700">{post.author.name}</p>
                </Link>
              ) : (
                <p className="text-sm text-gray-700">Anonymous</p>
              )}
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-5 mt-2">
              <LikeButton
                postId={post.id}
                initialCount={post.likesCount}
                initialLiked={post.likedByMe}
              />
              <CommentButton postId={post.id} count={post.commentsCount} />
              <CommentForm
                postId={post.id}
                onSuccess={() => {
                  setPosts((prev: Post[]) =>
                    prev.map((p) =>
                      p.id === post.id
                        ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 }
                        : p
                    )
                  );
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}