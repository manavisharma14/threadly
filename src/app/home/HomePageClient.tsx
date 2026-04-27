"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import CreatePost from "@/components/CreatePost";
import PostFeed from "@/components/PostFeed";
import Profile from "@/components/Profile";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Post, User } from "@/types";
import { TimelineItem } from "@/types/timeline";
import LandingPage from "@/app/landing/page";
import UsernameSetup from "@/components/UsernameSetup";

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

  // Not logged in → landing page
  if (!initialUser) return <LandingPage />;

  // Logged in but no username → username setup
  if (!initialUser.username) return <UsernameSetup />;

  // Logged in + username → feed
  return (
    <div className="min-h-screen bg-cream">
      <ToastContainer />


      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 px-4 md:px-6 pb-16">

        {/* Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div
            className="rounded-2xl p-5 space-y-4 sticky top-24"
            style={{ background: "#f5f0e8", border: "1px solid #ede6d6" }}
          >
            <Profile user={initialUser} />
            <Link href="/profile">
              <button
                className="w-full mt-3 py-2.5 px-4 rounded-full text-sm font-medium transition-colors"
                style={{ background: "#1a1a2e", color: "#faf8f4" }}
                onMouseOver={e => (e.currentTarget.style.background = "#c4613a")}
                onMouseOut={e => (e.currentTarget.style.background = "#1a1a2e")}
              >
                View Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Feed */}
        <div className="md:col-span-9">
          <div
            className="rounded-2xl p-6 space-y-6"
            style={{ background: "#ffffff", border: "1px solid rgba(26,26,46,0.10)" }}
          >
            <CreatePost onPostCreated={handlePostCreated} />
            {posts.length > 0 ? (
              <PostFeed posts={posts} newPost={newPost} currentUser={initialUser} />
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">✦</p>
                <p className="text-sm" style={{ color: "rgba(26,26,46,0.4)" }}>
                  No posts yet — be the first to share something.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}