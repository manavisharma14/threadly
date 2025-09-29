"use client";

import { useState } from "react";
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import Profile from "@/components/Profile";
import { Post, User } from "@/types";
import { TimelineItem } from "@/types/timeline";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";

interface HomePageClientProps {
  initialPosts: TimelineItem[];
  initialUser: User | null;
}

export default function HomePageClient({ initialPosts, initialUser }: HomePageClientProps) {
  const [posts, setPosts] = useState<TimelineItem[]>(initialPosts || []);
  const [newPost, setNewPost] = useState<Post | undefined>(undefined);

  const handlePostCreated = (post: Post) => {
    setNewPost(post);
    setPosts((prev) => [{ type: "post", ...post }, ...prev]);
  };

  return (
    <div className="min-h-screen ">
      <ToastContainer />

      {/* Branding Header */}
      <div className="text-center mt-10">
        <h1 className="text-4xl font-extrabold text-olive tracking-tight">
          connect<span className="italic">Circle</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Share thoughts. Build your circle. Stay connected.
        </p>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-10 px-4 md:px-10">
        
        {/* Left Sidebar */}
        <div className="hidden md:block md:col-span-4">
          {initialUser ? (
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow space-y-4">
              <Profile user={initialUser} />
              <Link href="/profile">
                <button className="w-full bg-olive text-white py-2 px-4 rounded-2xl hover:bg-olive/80 transition">
                  View Profile
                </button>
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow text-center space-y-4">
              <h2 className="text-lg font-semibold text-gray-700">Sign in to start posting!</h2>
              <p className="text-sm text-gray-500">Join connectCircle to share updates and grow your network.</p>
              <Link href="/signin">
                <button className="bg-olive mt-4 text-white py-2 px-6 rounded-2xl hover:bg-olive/80 transition" onClick={() => signIn()}>
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 space-y-6 bg-white p-6 rounded-xl shadow">
          {initialUser && <CreatePost onPostCreated={handlePostCreated} />}
          
          {posts.length > 0 ? (
            <PostFeed posts={posts} newPost={newPost} currentUser={initialUser} />
          ) : (
            <p className="text-center text-gray-500 mt-6">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
}