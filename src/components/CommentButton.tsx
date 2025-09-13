"use client";
import { MessageCircle } from "lucide-react";

export default function CommentButton({
  postId,
  count = 0,
}: {
  postId: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 hover:text-olive transition cursor-pointer">
      <MessageCircle size={18} />
      {count}
    </div>
  );
}