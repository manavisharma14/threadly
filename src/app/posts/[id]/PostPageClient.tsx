"use client";
import { useState } from "react";
import ReplyButton from "@/components/ReplyButton";
import LikeButton from "@/components/LikeButton";
import ReplyList from "@/components/ReplyList";
import { Post } from "@/types";
import RepostButton from "@/components/RepostButton";
// import { Reply } from "@/types";

export default function PostPageClient({ post }: { post: Post }) {
  const [replyCount, setReplyCount] = useState(post.repliesCount ?? 0);
  const [replies, setReplies] = useState<Post[]>(post.replies || []);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount ?? 0);
  const [repostedByMe, setRepostedByMe] = useState(post.repostedByMe ?? false);

  const onRepostToggle = (reposted: boolean) => {
    setRepostsCount((prev) => (reposted ? prev + 1 : prev - 1));
    setRepostedByMe(reposted);
  };

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
            setReplies((prev) => [...prev, reply]);
          }}
        />
        

        <RepostButton
          postId={post.id}
          count={post.repostsCount}
          initiallyReposted={post.repostedByMe ?? false}
          onRepostToggle={onRepostToggle}
        />


      </div>
      <div className="mt-8 border-t pt-4 items-center justify-center align-middle">
        <ReplyList
          postId={post.id}

          replies={replies}
          onReplyAdded={(reply: Post) => {
            setReplyCount((c) => c + 1)
            setReplies((prev) => [
              ...prev,
              { ...reply, replies: [], repliesCount: 0, likesCount: 0, likedByMe: false, repostsCount: 0 },
            ]);
          }}
        />


      </div>

    </div>
  );
}