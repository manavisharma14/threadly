"use client";
import { useState } from "react";
import ReplyButton from "@/components/ReplyButton";
import LikeButton from "@/components/LikeButton";
import ReplyList from "@/components/ReplyList";
import { Post } from "@/types";

export default function PostPageClient({ post }: { post: Post }) {
  const [replyCount, setReplyCount] = useState(post.repliesCount ?? 0);
  const [replies, setReplies] = useState<Post[]>(post.replies || []);

  return (
    <div className="w-1/2 mx-auto mt-10 p-4 bg-dark rounded-lg">
      <p>{post.content}</p>
      <p className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleString()}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <img
          src={post.author?.image || "/default-avatar.png"}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <span>{post.author?.name || "Anonymous"}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-5 mb-5 mt-2 justify-end">
        <LikeButton
          postId={post.id}
          initialCount={post.likesCount}
          initialLiked={post.likedByMe}
        />
        <ReplyButton
  post={post}
  count={replyCount}
  onReplyAdded={(reply) => {
    setReplyCount((c) => c + 1);
    setReplies((prev) => [...prev, reply]); // ✅ add reply to local state
  }}
/>
      </div>

      <ReplyList
  postId={post.id}
  replies={replies} 
  onReplyAdded={(reply) => {
    setReplies((prev) => [...prev, reply]); 
  }}
/>
    </div>
  );
}