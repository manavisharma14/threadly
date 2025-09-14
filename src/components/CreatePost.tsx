"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function CreatePost({ onPostCreated }: { onPostCreated?: (p: any) => void }) {
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

        // tell parent about the new post
        onPostCreated?.(newPost);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  return (
    <div>
      <div className="flex gap-2 flex-col">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind today?"
          className="w-full"
        />
        <Button
          onClick={handleSubmit}
          className="mt-2 bg-olive hover:bg-olive/70 text-white px-4 py-2 rounded"
        >
          POST!
        </Button>
      </div>
    </div>
  );
}