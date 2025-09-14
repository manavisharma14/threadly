"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Post } from "@/types";

export default function ReplyForm({
  post,
  onSuccess,
}: {
  post: Post;
  onSuccess?: (reply: Post) => void;
}) {
  const { data: session } = useSession(); // ✅ get logged-in user
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          parentId: post.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setContent("");
      onSuccess?.(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      {/* "Replying to @username" */}
      {post.author?.username && (
        <p className="text-sm text-gray-500 mb-2">
          Replying to <span className="text-olive">@{post.author.username}</span>
        </p>
      )}

      <div className="flex items-start gap-3 ">
        {/* ✅ Your profile photo */}
        <img
          src={session?.user?.image || "/default-avatar.png"}
          alt={session?.user?.name || "You"}
          className="w-10 h-10 rounded-full"
        />

        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Post your reply"
            className="w-full rounded-2xl bg-dark border border-olive/40 text-floral placeholder-gray-500 focus:ring-0 focus:border-olive"
            rows={3}
            disabled={loading}
          />

          {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

          <div className="flex justify-end gap-3 mt-3">
            <Button
              variant="ghost"
              type="button"
              disabled={loading}
              onClick={() => setContent("")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
            >
              {loading ? "Posting..." : "Reply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}