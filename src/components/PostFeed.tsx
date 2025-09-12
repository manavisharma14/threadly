"use client";
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";
import CommentButton from "./CommentButton";
import Link from "next/link";

type Post = {
  id: string;
  content: string;


  createdAt: string;
  author?: { id: string; name: string | null; image: string | null,   username: string | string; };
};

export default function PostFeed({ newPost }: { newPost?: Post }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // whenever newPost comes from CreatePost, add it optimistically
  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]);
    }
  }, [newPost]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Recent Posts</h2>
      <ul>
  {posts.map((post) => (
    <li key={post.id} className="border-b border-gray-300 py-4">
      <Link href={`/posts/${post.id}`} className="block">
        <p>{post.content}</p>
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </p>
      </Link>

      <div className="mt-2 flex justify-end">
        {post.author ? (
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-2"
          >
            <img
              src={post.author.image || ""}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <p className="text-sm text-gray-700">- {post.author.name}</p>
          </Link>
        ) : (
          <p className="text-sm text-gray-700">- Anonymous</p>
        )}
      </div>

      <div className="flex gap-5 mb-5">
        <LikeButton postId={post.id} />
        <CommentButton postId={post.id} />
      </div>
    </li>
  ))}
</ul>
    </div>
  );
}