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
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 transition-all"
        style={{ color: "rgba(26,26,46,0.4)" }}
        onMouseOver={e => (e.currentTarget.style.color = "#1a1a2e")}
        onMouseOut={e => (e.currentTarget.style.color = "rgba(26,26,46,0.4)")}
      >
        <MessageCircle size={16} />
        <span className="text-xs font-medium">{count > 0 ? count : ""}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!rounded-3xl !bg-white !border-ink/10 max-w-lg !p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-base font-bold text-ink">
              Reply to thread
            </DialogTitle>
          </DialogHeader>

          {/* Parent post preview */}
          <div
            className="flex items-start gap-3 rounded-xl p-4 mt-1"
            style={{ background: "#f5f0e8", border: "1px solid #ede6d6" }}
          >
            <img
              src={post.author?.image || "/default-avatar.png"}
              alt={post.author?.name || "User"}
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              style={{ border: "2px solid #c4613a22" }}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium" style={{ color: "#1a1a2e" }}>
                  {post.author?.name}
                </span>
                {post.author?.username && (
                  <span className="text-xs" style={{ color: "rgba(26,26,46,0.4)" }}>
                    @{post.author.username}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(26,26,46,0.7)" }}>
                {post.content}
              </p>
            </div>
          </div>

          {/* Reply form */}
          <div className="mt-3">
            <ReplyForm
              post={post}
              onSuccess={(reply) => {
                setOpen(false);
                onReplyAdded?.(reply);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}