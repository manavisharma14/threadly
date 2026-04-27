"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

export default function LikeButton({
  postId,
  initialCount = 0,
  initialLiked = false,
}: {
  postId: string;
  initialCount?: number;
  initialLiked?: boolean;
}) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleLike = async () => {
    if (!session?.user?.email) return;

    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1.5 transition-all group"
      style={{ color: liked ? "#c4613a" : "rgba(26,26,46,0.4)" }}
      onMouseOver={e => {
        if (!liked) e.currentTarget.style.color = "#c4613a";
      }}
      onMouseOut={e => {
        if (!liked) e.currentTarget.style.color = "rgba(26,26,46,0.4)";
      }}
    >
      <Heart
        size={16}
        style={{
          fill: liked ? "#c4613a" : "transparent",
          color: liked ? "#c4613a" : "inherit",
          transition: "all 0.15s",
        }}
      />
      <span className="text-xs font-medium">{count > 0 ? count : ""}</span>
    </button>
  );
}