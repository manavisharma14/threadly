"use client"
import { useState, useEffect } from "react";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?postId=${postId}`);
        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = await res.json();
        console.log("Fetched comments:", data); // 🔍 see structure
        setComments(data.comments || []);      // ✅ make sure it's an array
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="mt-2 space-y-2">
      {loading && <p>Loading comments...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && comments.length === 0 && (
        <p className="text-gray-400">No comments yet.</p>
      )}
      {comments.map((comment) => (
        <div key={comment.id} className="p-2 rounded">
          <p className="text-sm">{comment.content}</p>
          <p className="text-xs text-gray-500">
            {comment.user?.name || "Anonymous"} •{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}