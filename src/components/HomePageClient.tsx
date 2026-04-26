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

  if (!initialUser) return <LandingPage />;

  return (
    <div className="min-h-screen bg-cream">
      <ToastContainer />


      {/* Feed Layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 px-4 md:px-6 pb-16">
        
        {/* Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className="bg-sand border border-sand-dark rounded-2xl p-5 space-y-4 sticky top-24">
            <Profile user={initialUser} />
            <Link href="/profile">
              <button className="w-full mt-3 bg-ink text-cream py-2.5 px-4 rounded-full text-sm font-medium hover:bg-terracotta transition-colors duration-200">
                View Profile
              </button>
            </Link>
          </div>
        </div>

        {/* Feed */}
        <div className="md:col-span-9">
          <div className="bg-white border border-ink/10 rounded-2xl p-6 shadow-sm space-y-6">
            <CreatePost onPostCreated={handlePostCreated} />
            {posts.length > 0 ? (
              <PostFeed posts={posts} newPost={newPost} currentUser={initialUser} />
            ) : (
              <div className="text-center py-16">
                <p className="text-2xl mb-2">✦</p>
                <p className="text-ink/40 text-sm">No posts yet — be the first to share something.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Logo ── */
function Logo() {
  return (
    <span className="font-serif text-[1.6rem] font-bold text-ink tracking-tight leading-none">
      Thread<em className="italic text-terracotta not-italic" style={{ fontStyle: "italic" }}>O</em>
    </span>
  );
}

/* ── Landing Page ── */
function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <ToastContainer />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-ink/10 flex items-center justify-between px-8 py-4">
        <Logo />
        <div className="flex items-center gap-8">
          <a href="#features" className="text-sm text-ink/50 hover:text-ink transition-colors hidden md:inline">Features</a>
          <a href="#community" className="text-sm text-ink/50 hover:text-ink transition-colors hidden md:inline">Community</a>
          <button
            onClick={() => signIn()}
            className="bg-ink text-cream text-sm font-medium px-5 py-2 rounded-full hover:bg-terracotta transition-colors duration-200"
          >
            Sign in
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta text-[0.72rem] font-medium uppercase tracking-widest px-4 py-1.5 rounded-full mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            Now live — join the conversation
          </div>

          <h1 className="font-serif text-5xl md:text-[3.8rem] font-bold leading-[1.05] tracking-tight mb-6">
            Where ideas
            <em className="block italic text-terracotta not-italic" style={{ fontStyle: "italic" }}>
              find their circle.
            </em>
          </h1>

          <p className="text-[1.05rem] font-light text-ink/55 leading-[1.8] mb-9 max-w-[400px]">
            ThreadO is a thoughtful space for sharing ideas, building connections,
            and growing your network — one thread at a time.
          </p>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => signIn()}
              className="bg-ink text-cream px-7 py-3 rounded-full font-medium text-sm hover:bg-terracotta transition-colors duration-200"
            >
              Start your thread →
            </button>
            <button
              onClick={() => signIn()}
              className="border border-ink/20 text-ink px-6 py-3 rounded-full font-normal text-sm hover:border-ink/60 transition-colors duration-200"
            >
              Explore feed
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-10 pt-8 border-t border-ink/10">
            {[
              { num: "14k+", label: "Active members" },
              { num: "3.2k", label: "Posts today" },
              { num: "98%", label: "Would recommend" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-serif text-[1.9rem] font-bold text-ink leading-none">{num}</div>
                <div className="text-[0.72rem] text-ink/45 mt-1 tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock feed */}
        <div className="relative hidden md:flex flex-col gap-3 bg-sand border border-sand-dark rounded-[24px] p-5">
          <span className="absolute -top-4 right-5 bg-terracotta text-white text-[0.7rem] font-medium px-3 py-1.5 rounded-full"
            style={{ boxShadow: "0 4px 14px rgba(196,97,58,0.3)" }}>
            ✦ trending now
          </span>
          {MOCK_POSTS.map((p, i) => (
            <MockPost key={i} post={p} offset={i === 1} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-terracotta mb-3">Why ThreadO</p>
        <h2 className="font-serif text-[2.6rem] font-bold text-ink mb-10 max-w-[420px] leading-[1.12]">
          Built for real conversations.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`rounded-[20px] p-8 border transition-transform duration-200 hover:-translate-y-1 ${
                i === 1 ? "bg-ink border-ink" : "bg-sand border-sand-dark"
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg mb-5 ${
                i === 1 ? "bg-white/10" : i === 0 ? "bg-terracotta/15" : "bg-sage/15"
              }`}>
                {f.icon}
              </div>
              <h3 className={`font-medium text-[1rem] mb-2 ${i === 1 ? "text-cream" : "text-ink"}`}>
                {f.title}
              </h3>
              <p className={`text-sm font-light leading-[1.7] ${i === 1 ? "text-cream/55" : "text-ink/55"}`}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="max-w-6xl mx-auto px-6 py-8 pb-16">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-terracotta mb-3">What people say</p>
        <h2 className="font-serif text-[2.6rem] font-bold text-ink mb-8 leading-[1.12]">
          Threads worth reading.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-[20px] p-6 border ${
                i === 1 ? "bg-terracotta border-terracotta" : "bg-white border-ink/10"
              }`}
            >
              <p className={`text-sm font-light italic leading-[1.75] mb-5 ${
                i === 1 ? "text-white/90" : "text-ink/65"
              }`}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className={`flex items-center gap-2 text-[0.78rem] font-medium ${
                i === 1 ? "text-white/60" : "text-ink/45"
              }`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                  i === 1 ? "bg-white/20 text-white" : "bg-terracotta/15 text-terracotta"
                }`}>
                  {t.initials}
                </div>
                {t.name} — {t.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-ink rounded-[28px] px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="font-serif text-[2.4rem] font-bold text-cream leading-[1.12] max-w-md">
            Ready to find{" "}
            <em className="italic text-terracotta" style={{ fontStyle: "italic" }}>your people?</em>
          </h2>
          <button
            onClick={() => signIn()}
            className="bg-cream text-ink px-8 py-3.5 rounded-full font-medium text-sm whitespace-nowrap hover:bg-terracotta-light transition-colors duration-200"
          >
            Join ThreadO — it&rsquo;s free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-7 border-t border-ink/10 flex items-center justify-between">
        <Logo />
        <p className="text-[0.78rem] text-ink/35">© 2025 ThreadO. Share thoughts. Build your circle.</p>
      </footer>
    </div>
  );
}

/* ── Static data ── */

const MOCK_POSTS = [
  {
    initials: "JK",
    colorClass: "bg-terracotta/15 text-terracotta",
    name: "Jamie K.",
    time: "2 min ago",
    text: "Just shipped my first open-source project. Months of late nights finally paid off ✨",
  },
  {
    initials: "SR",
    colorClass: "bg-sage/15 text-sage",
    name: "Sofia R.",
    time: "11 min ago",
    text: 'Reminder that "done" is better than "perfect." Ship the thing. Iterate later.',
  },
  {
    initials: "MP",
    colorClass: "bg-indigo-100 text-indigo-600",
    name: "Marcus P.",
    time: "25 min ago",
    text: "The best communities are built around consistency, not size. Quality always wins.",
  },
];

const FEATURES = [
  {
    icon: "◎",
    title: "Your feed, your circle",
    desc: "See posts from people you follow, not an algorithm. ThreadO keeps your feed personal and human.",
  },
  {
    icon: "⟡",
    title: "Genuine connections",
    desc: "Grow a network that actually matters. Discover people who share your passions and spark real dialogue.",
  },
  {
    icon: "⊹",
    title: "Clean, focused writing",
    desc: "No noise. No distractions. Just a beautiful editor that lets your ideas take center stage.",
  },
];

const TESTIMONIALS = [
  {
    quote: "ThreadO feels like the early internet again — genuine, curious people sharing things they actually care about.",
    name: "Anya L.",
    role: "Product Designer",
    initials: "AL",
  },
  {
    quote: "I've built more meaningful connections here in two months than on other platforms in two years.",
    name: "Chris W.",
    role: "Software Engineer",
    initials: "CW",
  },
  {
    quote: "The writing experience is just lovely. Distraction-free, beautiful, and my posts get read by people who care.",
    name: "Nia P.",
    role: "Writer",
    initials: "NP",
  },
];

/* ── MockPost ── */

function MockPost({ post, offset }: { post: typeof MOCK_POSTS[0]; offset?: boolean }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 border border-ink/10 transition-transform duration-200 hover:-translate-y-0.5 ${
        offset ? "translate-x-2" : ""
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${post.colorClass}`}>
          {post.initials}
        </div>
        <div>
          <div className="text-[0.8rem] font-medium text-ink">{post.name}</div>
          <div className="text-[0.68rem] text-ink/40">{post.time}</div>
        </div>
      </div>
      <p className="text-[0.82rem] text-ink/60 leading-[1.6]">{post.text}</p>
      <div className="flex gap-2 mt-3">
        {["♡ Like", "↩ Reply", "⌁ Share"].map((a) => (
          <button
            key={a}
            className="text-[0.68rem] text-ink/40 bg-sand px-2.5 py-1 rounded-full hover:text-ink transition-colors duration-150"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}