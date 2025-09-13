"use client";
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "./ReplyButton";
import Link from "next/link";
import ReplyForm from "./ReplyForm";
import { Post } from "@/types";

interface PostFeedProps {
  posts: Post[];
  newPost?: Post;
}

export default function PostFeed({ posts: initialPosts, newPost }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    if (newPost && !newPost.parentId) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      <ul>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onReplyAdded={(reply) => {
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === post.id
                    ? {
                        ...p,
                        repliesCount: (p.repliesCount ?? 0) + 1,
                        replies: [...(p.replies || []), reply],
                      }
                    : p
                )
              );
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function PostItem({
  post,
  onReplyAdded,
}: {
  post: Post;
  onReplyAdded: (reply: Post) => void;
}) {
  const [replyCount, setReplyCount] = useState(post.repliesCount ?? 0);
  const [replies, setReplies] = useState<Post[]>(post.replies || []);

  return (
    <li className="border-b border-gray-700 py-4">
      {/* Post header */}
      <div className="mb-4 flex justify-between items-start">
        <Link href={`/posts/${post.id}`} className="flex-1">
          <p className="text-gray-200">{post.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </Link>

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
            <p className="text-sm text-gray-300">{post.author.name}</p>
          </Link>
        ) : (
          <p className="text-sm text-gray-300">Anonymous</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col mt-2">
        <div className="flex gap-5 mb-5 mt-2 justify-start">
          <LikeButton
            postId={post.id}
            initialCount={post.likesCount}
            initialLiked={post.likedByMe}
          />

          {/* Reply button opens modal w/ ReplyForm inside */}
          <ReplyButton
            postId={post.id}
            count={replyCount}
            // when reply is added, update local + parent feed
            onReplyAdded={(reply) => {
              setReplyCount((c) => c + 1);
              setReplies((prev) => [...prev, reply]);
              onReplyAdded(reply);
            }}
          />
        </div>
      </div>

      {/* Replies list */}
      {replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="ml-4 border-l border-gray-600 pl-4 text-sm text-gray-300"
            >
              <p>
                <span className="font-semibold">{reply.author?.name}</span> —{" "}
                {new Date(reply.createdAt).toLocaleString()}
              </p>
              <p>{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}