"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function CreatePost({
  onPostCreated,
}: {
  onPostCreated?: (p: any) => void;
}) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const newPost = await res.json();
        setContent("");
        onPostCreated?.(newPost);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <div className="rounded-2xl border border-[#ead7cc] bg-white/90 shadow-sm p-4">
      <div className="flex flex-col gap-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are you building today?"
          className="min-h-[110px] resize-none border-[#e7d2c5] bg-[#fffaf7] text-[#4a3b34] placeholder:text-[#b08f7e] focus-visible:ring-[#d98b73] focus-visible:border-[#d98b73]"
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="rounded-full px-6 py-2 font-medium text-white shadow-md transition-all duration-200 bg-gradient-to-r from-[#e6a48b] to-[#d98b73] hover:from-[#dc957a] hover:to-[#c9785f] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}