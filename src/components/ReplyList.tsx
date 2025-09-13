"use client";
import Link from "next/link";
import { Post } from "@/types";

export default function ReplyList({
  postId,
  replies,
  onReplyAdded,
}: {
  postId: string;
  replies: Post[];
  onReplyAdded?: (reply: Post) => void;
}) {
  return (
    <div className="mt-2 space-y-2">
      {replies.map((reply) => (
        <Link
          key={reply.id}
          href={`/posts/${reply.id}`}
          className="block ml-4 border-l pl-4 rounded-md bg-gray-800/40 hover:bg-gray-700/60 
                     transition cursor-pointer text-sm text-gray-200 p-2"
        >
          <p>
            <span className="font-semibold">{reply.author?.name}</span> —{" "}
            {new Date(reply.createdAt).toLocaleString()}
          </p>
          <p>{reply.content}</p>
        </Link>
      ))}
    </div>
  );
}