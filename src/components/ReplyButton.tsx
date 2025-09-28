"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Post } from "@/types";
import ReplyForm from "./ReplyForm";

export default function ReplyButton({
  post,
  count = 0,
  onReplyAdded,
}: {
  post: Post;
  count?: number;
  onReplyAdded?: (reply: Post) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-olive transition cursor-pointer"
      >
        <MessageCircle size={18} />
        {count}
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
  className="!rounded-3xl  bg-white dark:bg-smoky text-floral border border-olive/40 max-w-lg 
              shadow-lg data-[state=open]:animate-fadeIn"
>      <DialogHeader>
            <DialogTitle className="sr-only">Reply Dialog</DialogTitle>
          </DialogHeader>

          {/* 🟢 Show parent post like Twitter */}
          <div className="flex items-start gap-3 border-b border-gray-700 pb-3 mb-3">
            <img
              src={post.author?.image || "/default-avatar.png"}
              alt={post.author?.name || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{post.author?.name}</p>
              <p className="text-sm text-gray-400">@{post.author?.username}</p>
              <p className="mt-1 text-gray-200">{post.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 🟢 Reply form */}
          <ReplyForm
            post={post}
            onSuccess={(reply) => {
              setOpen(false);
              onReplyAdded?.(reply);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

