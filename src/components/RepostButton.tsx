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
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setReposted(data.reposted);
        onRepostToggle?.(data.reposted);
      } else {
        toast.error(data.error || "Failed to repost");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleRepost}
      disabled={disabled || loading}
      className="flex items-center gap-1.5 transition-all"
      style={{
        color: reposted
          ? "#4a7c59"
          : disabled
          ? "rgba(26,26,46,0.2)"
          : "rgba(26,26,46,0.4)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseOver={e => {
        if (!disabled && !loading) e.currentTarget.style.color = "#4a7c59";
      }}
      onMouseOut={e => {
        if (!disabled && !loading)
          e.currentTarget.style.color = reposted ? "#4a7c59" : "rgba(26,26,46,0.4)";
      }}
      title={disabled ? "Can't repost your own post" : reposted ? "Undo repost" : "Repost"}
    >
      <Repeat2
        size={16}
        style={{ transition: "all 0.15s" }}
      />
      <span className="text-xs font-medium">{count > 0 ? count : ""}</span>
    </button>
  );
}