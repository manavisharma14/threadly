"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function CommentButton({ postId }: { postId: string }) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`/api/comments?postId=${postId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = await res.json();
        setCount(data.comments?.length || 0);  // ✅ just count them
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [postId]);

  if (loading) return <span className="text-gray-400 text-sm">…</span>;

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 hover:text-olive transition cursor-pointer">
      <MessageCircle size={18} />
      {count}
    </div>
  );
}