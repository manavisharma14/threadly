"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReplyForm from "./ReplyForm";
import { Post } from "@/types";

export default function ReplyButton({
  postId,
  count = 0,
  onReplyAdded,
}: {
  postId: string;
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
        <DialogContent className="bg-smoky text-floral border border-olive/40">
          <DialogHeader>
            <DialogTitle>Write a reply</DialogTitle>
          </DialogHeader>

          <ReplyForm
            postId={postId}
            onSuccess={(reply) => {
              setOpen(false);        // close after posting
              onReplyAdded?.(reply); // notify parent
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}