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
  const [liked, setLiked] = useState<boolean>(initialLiked); // you can hydrate this from server later if needed
  const [count, setCount] = useState<number>(initialCount);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async () => {
    try {
      if (!session?.user?.email) {
        setError("You must be logged in to like a post");
        return;
      }

      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) throw new Error("Failed to update like");

      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count); // backend returns updated count
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition"
    >
      <Heart
        size={18}
        className={liked ? "fill-red-500 text-red-500" : "text-gray-500"}
      />
      {count}
    </button>
  );
}