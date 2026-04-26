"use client";
import { useState } from "react";
import FollowButton from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import RepostButton from "@/components/RepostButton";
import { Link2, Globe, Briefcase } from "lucide-react";
import { TimelineItem, TimelinePost, TimelineRepost } from "@/types/timeline";
import { Post, User as BaseUser } from "@/types";

interface User extends BaseUser {
  _count?: {
    followers?: number;
    following?: number;
  };
}

interface ProfileClientProps {
  user: User;
  currentUserId: string;
  isFollowing: boolean;
  posts: TimelineItem[];
}

export default function ProfileClient({
  user,
  currentUserId,
  isFollowing,
  posts,
}: ProfileClientProps) {
  const [allPosts, setAllPosts] = useState<TimelineItem[]>(
    posts.map((p) =>
      p.type === "repost"
        ? { ...p, post: { ...p.post, repliesCount: p.post.repliesCount ?? 0, repostsCount: p.post.repostsCount ?? 0 } }
        : { ...p, repliesCount: p.repliesCount ?? 0, repostsCount: p.repostsCount ?? 0 }
    )
  );

  const handleAddComment = (postId: string) => {
    setAllPosts((prev) =>
      prev.map((p) => {
        const target = p.type === "repost" ? p.post : p;
        if (target.id === postId) {
          if (p.type === "repost") return { ...p, post: { ...p.post, repliesCount: p.post.repliesCount + 1 } };
          return { ...p, repliesCount: p.repliesCount + 1 };
        }
        return p;
      })
    );
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

  const postCount = allPosts.filter((p) => p.type === "post").length;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Profile Card */}
        <div className="bg-white border border-ink/10 rounded-2xl overflow-hidden">
          {/* Banner */}
          <div className="h-24" style={{ background: "linear-gradient(to right, #f5f0e8, #f0d5c8)" }} />

          <div className="px-6 pb-6">
            {/* Avatar + Follow row */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name || "Profile"}
                className="w-20 h-20 rounded-full object-cover"
                style={{ border: "3px solid #faf8f4", boxShadow: "0 0 0 2px #c4613a44" }}
              />
              <div className="flex items-center gap-2 mb-1">
                {currentUserId && currentUserId !== user.id && (
                  <FollowButton
                    isFollowingInitial={isFollowing}
                    targetUserId={user.id}
                    currentUserId={currentUserId}
                  />
                )}
                <button
                  onClick={() => (window.location.href = `/followers?userId=${user.id}`)}
                  className="text-xs text-ink/50 hover:text-terracotta transition-colors px-3 py-1.5 rounded-full border border-ink/15 hover:border-terracotta"
                >
                  {user._count?.followers ?? 0} Followers
                </button>
                <button
                  onClick={() => (window.location.href = `/following?userId=${user.id}`)}
                  className="text-xs text-ink/50 hover:text-terracotta transition-colors px-3 py-1.5 rounded-full border border-ink/15 hover:border-terracotta"
                >
                  {user._count?.following ?? 0} Following
                </button>
              </div>
            </div>

            {/* Name & meta */}
            <h2 className="font-serif text-[1.5rem] font-bold text-ink leading-tight">{user.name}</h2>
            {user.username && <p className="text-sm text-terracotta mt-0.5">@{user.username}</p>}

            {user.bio && (
              <p className="text-sm text-ink/70 mt-3 leading-relaxed max-w-lg">{user.bio}</p>
            )}

            {/* Links */}
            {(user.linkedIn || user.website || user.building) && (
              <div className="flex flex-wrap gap-4 mt-3">
                {user.linkedIn && (
                  <a href={user.linkedIn} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-terracotta transition-colors">
                    <Link2 size={12} /> LinkedIn
                  </a>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-terracotta transition-colors">
                    <Globe size={12} /> Website
                  </a>
                )}
                {user.building && (
                  <span className="flex items-center gap-1.5 text-xs text-ink/50">
                    <Briefcase size={12} /> {user.building}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-5 pt-4 border-t border-ink/10">
              {[
                { num: postCount, label: "Posts" },
                { num: user._count?.following ?? 0, label: "Following" },
                { num: user._count?.followers ?? 0, label: "Followers" },
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
            <h2 className="font-serif text-xl font-bold text-ink">Posts by {user.name}</h2>
            <span className="text-[0.72rem] text-ink/35 uppercase tracking-widest">{postCount} threads</span>
          </div>

          {allPosts.length === 0 ? (
            <div className="text-center py-16 bg-white border border-ink/10 rounded-2xl">
              <p className="text-2xl mb-2">✦</p>
              <p className="text-sm text-ink/40">No posts yet.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {allPosts.map((item) => {
                const isRepost = item.type === "repost";
                const post = isRepost ? (item as TimelineRepost).post : (item as TimelinePost);
                const repostedAt = isRepost ? item.createdAt : null;

                // Avatar color from name
                const avatarColors = [
                  { bg: "#f0d5c8", color: "#c4613a" },
                  { bg: "#d4e6da", color: "#4a7c59" },
                  { bg: "#dce0f8", color: "#4a55b0" },
                  { bg: "#fde8c8", color: "#b07030" },
                ];
                const ac = avatarColors[(post.author?.name?.charCodeAt(0) ?? 0) % avatarColors.length];
                const initials = post.author?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "?";

                return (
                  <li key={item.id} className="bg-white border border-ink/10 rounded-2xl p-5">
                    {isRepost && (
                      <p className="text-[0.72rem] text-terracotta mb-3 italic">
                        ↺ {user.name} reposted · {timeAgo(repostedAt!)}
                      </p>
                    )}

                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {post.author?.image ? (
                          <img
                            src={post.author.image}
                            alt={post.author.name || ""}
                            className="w-8 h-8 rounded-full object-cover"
                            style={{ border: "2px solid #c4613a22" }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                            style={{ background: ac.bg, color: ac.color }}
                          >
                            {initials}
                          </div>
                        )}
                        <div>
                          <span className="text-[0.85rem] font-medium text-ink">{post.author?.name}</span>
                          <span className="text-[0.65rem] text-ink/35 ml-2">{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-[0.92rem] text-ink/80 leading-[1.7] mb-4">{post.content}</p>

                    {/* Actions */}
                    <div className="border-t border-ink/10 pt-3 flex items-center gap-5">
                      <LikeButton postId={post.id} initialCount={post.likesCount} initialLiked={post.likedByMe} />
                      <ReplyButton
                        post={post}
                        count={post.repliesCount}
                        onReplyAdded={() => handleAddComment(post.id)}
                      />
                      <RepostButton
                        postId={post.id}
                        count={post.repostsCount}
                        initiallyReposted={post.repostedByMe ?? false}
                        onRepostToggle={(newState) => {
                          setAllPosts((prev) =>
                            prev.map((p) =>
                              (p.type === "post" && p.id === post.id) ||
                              (p.type === "repost" && p.post.id === post.id)
                                ? p.type === "post"
                                  ? { ...p, repostedByMe: newState, repostsCount: newState ? p.repostsCount + 1 : Math.max(0, p.repostsCount - 1) }
                                  : { ...p, post: { ...p.post, repostedByMe: newState, repostsCount: newState ? p.post.repostsCount + 1 : Math.max(0, p.post.repostsCount - 1) } }
                                : p
                            )
                          );
                        }}
                        disabled={post.author?.id === currentUserId}
                      />
                    </div>
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