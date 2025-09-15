"use client"
import { useState } from "react";
import { Repeat2 } from "lucide-react";

type RepostButtonProps = {
    postId: string;
    count ?: number;
    initiallyReposted?: boolean;
    onRepostToggle?: (reposted: boolean) => void;
}
export default function RepostButton( { postId, count, initiallyReposted = false, onRepostToggle }: RepostButtonProps) {
    const [ reposted, setReposted ] = useState(initiallyReposted);
    const [ loading, setLoading ] = useState(false);
    const toggleRepost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/repost`, {
          method: reposted ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        });
    
        const data = await res.json();
    
        if (res.ok) {
          setReposted(data.reposted);
          onRepostToggle?.(data.reposted);
        } else {
          alert(data.error || "Failed to repost");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    return (
        <button className="text-gray-500" onClick={toggleRepost} title="Repost">
            <Repeat2 size={28} />
            { count }
        </button>
    )
}