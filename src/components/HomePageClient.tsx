"use client";
import { useState } from "react";
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import Profile from "@/components/Profile";
import { Post, User } from "@/types";
import Link from "next/link";

interface HomePageClientProps {
  initialPosts: Post[];
  initialUser: User | null;
}

export default function HomePageClient({ initialPosts, initialUser }: HomePageClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [newPost, setNewPost] = useState<Post | undefined>(undefined);

  return (
    <div>
      <h1 className="text-3xl font-bold text-olive text-center mt-10">
        <i>connect</i>Circle
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 mt-10">
        {/* Left Sidebar */}
        <div className="md:col-span-3 lg:col-span-3 p-4 space-y-4 hidden md:block">
          <Profile user={initialUser} />
          <Link href="/profile">
          <div className="mt-4">
            <button className="w-full text-white bg-olive text-floral py-2 px-4 rounded-2xl hover:bg-olive/70 transition">
              Profile
            </button>
          </div>
          </Link>
        </div>

        {/* Main Content (now bigger since no right sidebar) */}
        <div className="col-span-1 md:col-span-5 lg:col-span-9 p-4 space-y-4">
          <CreatePost onPostCreated={setNewPost} />
          <PostFeed newPost={newPost} posts={posts} />
        </div>
      </div>
    </div>
  );
}