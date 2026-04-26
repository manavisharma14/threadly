"use client";
import { useState, useEffect } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import { Trash2, Link2, Globe, Briefcase } from "lucide-react";
import RepostButton from "@/components/RepostButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TimelineItem, TimelinePost, TimelineRepost } from "@/types/timeline";
import { Post } from "@/types";
import ReplyList from "@/components/ReplyList";

type ProfileClientProps = {
  session: Session;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
    username: string | null;
    bio: string | null;
    linkedIn: string | null;
    website: string | null;
    building: string | null;
  } | null;
  posts: TimelineItem[];
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-sand border border-sand-dark text-ink text-sm placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-terracotta/40 transition";

export default function ProfileClient({ session, user, posts }: ProfileClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [linkedin, setLinkedin] = useState(user?.linkedIn ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [building, setBuilding] = useState(user?.building ?? "");
  const [allPosts, setAllPosts] = useState<TimelineItem[]>(posts);

  useEffect(() => {
    if (!user?.username) setOpen(true);
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, bio, linkedIn: linkedin, website, building }),
    });
    if (res.ok) {
      setOpen(false);
      setEditOpen(false);
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message ?? "Failed to update profile");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      setAllPosts((prev) => prev.filter((p) => p.type !== "post" || p.id !== postId));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || "Failed to delete post");
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const postCount = allPosts.filter((p) => p.type === "post" && !p.parentId).length;

  return (
    <div className="min-h-screen bg-cream">
      {/* Username setup modal */}
      {!user?.username && (
        <Dialog open={open} onOpenChange={() => {}}>
          <DialogContent className="!rounded-3xl bg-white border border-ink/10 max-w-md shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-center font-serif text-xl font-bold text-ink">
                Pick your username
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-ink/50">
                This will be your unique name on ThreadO.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
                required
                className={inputClass}
              />
              <button
                type="submit"
                className="w-full bg-ink text-cream py-2.5 rounded-full text-sm font-medium hover:bg-terracotta transition-colors"
              >
                Save & Continue
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Profile Card */}
        <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-r from-sand to-terracotta/15" />

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <img
                src={user?.image || "/default-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "3px solid #faf8f4", boxShadow: "0 0 0 2px #c4613a44" }}
              />
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <button className="mb-1 border border-ink/20 text-ink text-sm px-4 py-1.5 rounded-full hover:border-terracotta hover:text-terracotta transition-colors">
                    Edit Profile
                  </button>
                </DialogTrigger>
                <DialogContent className="!rounded-3xl bg-white border border-ink/10 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-lg font-bold text-ink">Edit profile</DialogTitle>
                    <DialogDescription className="text-sm text-ink/45">
                      Update what others see on your profile.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSave} className="space-y-3 mt-2">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Bio"
                      className={inputClass}
                      rows={3}
                    />
                    <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className={inputClass} />
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" className={inputClass} />
                    <input type="text" value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="What are you building?" className={inputClass} />
                    <div className="flex justify-end gap-2 pt-1">
                      <button type="button" onClick={() => setEditOpen(false)} className="text-sm text-ink/45 px-4 py-2 rounded-full hover:text-ink transition-colors">
                        Cancel
                      </button>
                      <button type="submit" className="bg-ink text-cream text-sm px-5 py-2 rounded-full hover:bg-terracotta transition-colors">
                        Save
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Name & meta */}
            <h2 className="font-serif text-[1.5rem] font-bold text-ink leading-tight">{user?.name}</h2>
            {username && <p className="text-sm text-terracotta mt-0.5">@{username}</p>}
            <p className="text-sm text-ink/45 mt-0.5">{user?.email}</p>

            {bio && <p className="text-sm text-ink/70 mt-3 leading-relaxed max-w-lg">{bio}</p>}

            {/* Links */}
            {(linkedin || website || building) && (
              <div className="flex flex-wrap gap-4 mt-3">
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-terracotta transition-colors">
                    <Link2 size={12} /> LinkedIn
                  </a>
                )}
                {website && (
                  <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-terracotta transition-colors">
                    <Globe size={12} /> Website
                  </a>
                )}
                {building && (
                  <span className="flex items-center gap-1.5 text-xs text-ink/50">
                    <Briefcase size={12} /> {building}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-5 pt-4 border-t border-ink/10">
              {[
                { num: postCount, label: "Posts" },
                { num: 0, label: "Following" },
                { num: 0, label: "Followers" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div className="font-serif text-xl font-bold text-ink">{num}</div>
                  <div className="text-[0.65rem] text-ink/40 uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold text-ink">Your Posts</h2>
            <span className="text-[0.72rem] text-ink/35 uppercase tracking-widest">{postCount} threads</span>
          </div>

          {allPosts.filter((p) => p.type === "post" && !p.parentId).length === 0 ? (
            <div className="text-center py-16 bg-white border border-ink/10 rounded-2xl">
              <p className="text-2xl mb-2">✦</p>
              <p className="text-sm text-ink/40">No posts yet — share your first thought.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {allPosts
                .filter(
                  (item): item is TimelinePost | TimelineRepost =>
                    (item.type === "post" && !item.parentId) || item.type === "repost"
                )
                .map((item) => {
                  const isRepost = item.type === "repost";
                  const post = isRepost ? item.post : item;
                  const repostedAt = isRepost ? item.createdAt : null;

                  return (
                    <li key={item.id} className="bg-white border border-ink/10 rounded-2xl p-5">
                      {isRepost && (
                        <p className="text-[0.72rem] text-terracotta mb-3 italic flex items-center gap-1">
                          ↺ You reposted · {timeAgo(repostedAt!)}
                        </p>
                      )}

                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={post.author?.image || "/default-avatar.png"}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                            style={{ border: "2px solid #c4613a22" }}
                          />
                          <div>
                            <span className="text-[0.85rem] font-medium text-ink">{post.author?.name}</span>
                            <span className="text-[0.65rem] text-ink/35 ml-2">{timeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-ink/25 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Content */}
                      <p className="text-[0.92rem] text-ink/80 leading-[1.7] mb-4">{post.content}</p>

                      {/* Actions */}
                      <div className="border-t border-ink/8 pt-3 flex items-center gap-5">
                        <LikeButton postId={post.id} initialCount={post.likesCount} initialLiked={post.likedByMe} />
                        <ReplyButton
                          post={post}
                          count={post.repliesCount}
                          onReplyAdded={(reply) => {
                            setAllPosts((prev): TimelineItem[] =>
                              prev.map((p) => {
                                if (p.type === "post" && p.id === post.id) {
                                  return {
                                    ...p,
                                    repliesCount: p.repliesCount + 1,
                                    replies: [...p.replies, { ...reply, author: { ...reply.author, email: reply.author.email ?? null } }],
                                  } as TimelinePost;
                                }
                                if (p.type === "repost" && p.post.id === post.id) {
                                  return {
                                    ...p,
                                    post: {
                                      ...p.post,
                                      repliesCount: p.post.repliesCount + 1,
                                      replies: [...(p.post.replies || []), { ...reply, author: { ...reply.author, email: reply.author.email ?? null } }],
                                    },
                                  } as TimelineRepost;
                                }
                                return p;
                              })
                            );
                          }}
                        />
                      </div>

                      {/* Replies */}
                      <ReplyList
                        postId={post.id}
                        replies={post.replies || []}
                        onReplyAdded={(reply: Post) => {
                          setAllPosts((prev): TimelineItem[] =>
                            prev.map((p) => {
                              if (p.type === "post" && p.id === post.id) {
                                return {
                                  ...p,
                                  repliesCount: p.repliesCount + 1,
                                  replies: [
                                    ...p.replies,
                                    { ...reply, parentId: post.id, replies: [], repliesCount: 0, likesCount: 0, repostsCount: 0, likedByMe: false, repostedByMe: false },
                                  ],
                                } as TimelinePost;
                              }
                              return p;
                            })
                          );
                        }}
                      />
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}