"use client";
import { useState } from "react";
import { Repeat2 } from "lucide-react";
import { toast } from "react-toastify";

type RepostButtonProps = {
  postId: string;
  count?: number;
  initiallyReposted?: boolean;
  onRepostToggle?: (reposted: boolean) => void;
  disabled?: boolean;
};

export default function RepostButton({
  postId,
  count = 0,
  initiallyReposted = false,
  onRepostToggle,
  disabled = false,
}: RepostButtonProps) {
  const [reposted, setReposted] = useState(initiallyReposted);
  const [loading, setLoading] = useState(false);

  const toggleRepost = async () => {
    if (disabled || loading) return;

    setLoading(true);
    
    try {
      const res = await fetch(`/api/reposts/${postId}`, {
        method: reposted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setReposted(data.reposted);
        onRepostToggle?.(data.reposted);
      } else {
        toast.error(data.error || "Failed to repost");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        className={`text-gray-500 ${disabled || loading ? "opacity-50 cursor-not-allowed" : "hover:text-blue-500"}`}
        onClick={toggleRepost}
        title="Repost"
        disabled={disabled || loading}
      >
        <Repeat2 size={28} />
      </button>
      {count >= 0 && <span>{count}</span>}
    </div>
  );
}