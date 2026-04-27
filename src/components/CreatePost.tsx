"use client";
import { useState } from "react";

export default function CreatePost({
  onPostCreated,
}: {
  onPostCreated?: (p: any) => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

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
      }
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
      setLoading(false);
    }
  };

  const charLimit = 280;
  const remaining = charLimit - content.length;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#faf8f4", border: "1px solid #ede6d6" }}
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
        placeholder="What are you thinking about today?"
        rows={3}
        className="w-full resize-none bg-transparent text-sm leading-relaxed focus:outline-none"
        style={{
          color: "#1a1a2e",
          fontFamily: "'DM Sans', sans-serif",
        }}
      />

      <div
        className="flex items-center justify-between mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(26,26,46,0.08)" }}
      >
        {/* Char count */}
        <span
          className="text-xs"
          style={{
            color: remaining < 40 ? "#c4613a" : "rgba(26,26,46,0.3)",
          }}
        >
          {remaining < 100 ? `${remaining} left` : ""}
        </span>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className="px-6 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: !content.trim() || loading ? "rgba(26,26,46,0.12)" : "#1a1a2e",
            color: !content.trim() || loading ? "rgba(26,26,46,0.35)" : "#faf8f4",
            cursor: !content.trim() || loading ? "not-allowed" : "pointer",
          }}
          onMouseOver={e => {
            if (content.trim() && !loading)
              e.currentTarget.style.background = "#c4613a";
          }}
          onMouseOut={e => {
            if (content.trim() && !loading)
              e.currentTarget.style.background = "#1a1a2e";
          }}
        >
          {loading ? "Posting..." : "Post thread"}
        </button>
      </div>
    </div>
  );
}