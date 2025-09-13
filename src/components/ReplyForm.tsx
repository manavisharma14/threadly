"use client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function ReplyForm({
  postId,
  onSuccess,
}: {
  postId: string;
  onSuccess?: (reply: any) => void;
}) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), parentId: postId }),
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
    <div className="flex flex-col gap-4 mt-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your reply..."
        rows={3}
        disabled={loading}
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex justify-end gap-3">
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
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}