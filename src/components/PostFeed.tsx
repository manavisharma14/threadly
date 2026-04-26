"use client";
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import Link from "next/link";
import RepostButton from "@/components/RepostButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TimelineItem, TimelinePost } from "@/types/timeline";
import { Post, User } from "@/types";

interface PostFeedProps {
  posts: TimelineItem[];
  newPost?: Post;
  currentUser: User | null;
}

export default function PostFeed({ posts: initialPosts, newPost, currentUser }: PostFeedProps) {
  const [posts, setPosts] = useState<TimelineItem[]>(
    initialPosts.filter((p) => p.type === "post")
  );

  useEffect(() => {
  if (newPost && !newPost.parentId) {
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === newPost.id);
      if (exists) return prev;

      return [{ type: "post", ...newPost }, ...prev];
    });
  }
}, [newPost]);

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-xl font-bold text-ink">Recent Posts</h2>
        <span className="text-[0.72rem] text-ink/35 uppercase tracking-widest">{posts.length} threads</span>
      </div>
      <ul className="space-y-3">
        {posts.map((item) => (
          <PostItem
            key={item.id}
            item={item as TimelinePost}
            currentUser={currentUser}
            onReplyAdded={(reply) => {
              setPosts((prev): TimelineItem[] =>
                prev.map((p) => {
                  if (p.type === "post" && p.id === item.id) {
                    const newReply: Post = {
                      ...reply,
                      parentId: item.id,
                      replies: [],
                      repliesCount: 0,
                      likesCount: 0,
                      repostsCount: 0,
                      likedByMe: false,
                      repostedByMe: false,
                    };
                    return {
                      ...p,
                      repliesCount: (p.repliesCount ?? 0) + 1,
                      replies: [...(p.replies || []), newReply],
                    } as TimelinePost;
                  }
                  return p;
                })
              );
            }}
            onRepostToggle={(reposted) => {
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.type === "post" && p.id === item.id) {
                    return {
                      ...p,
                      repostedByMe: reposted,
                      repostsCount: reposted ? p.repostsCount + 1 : p.repostsCount - 1,
                    } as TimelinePost;
                  }
                  return p;
                })
              );
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function PostItem({
  item,
  currentUser,
  onReplyAdded,
  onRepostToggle,
}: {
  item: TimelinePost;
  currentUser: User | null;
  onReplyAdded: (reply: Post) => void;
  onRepostToggle: (reposted: boolean) => void;
}) {
  const [replyCount, setReplyCount] = useState(item.repliesCount ?? 0);
  const [replies, setReplies] = useState<Post[]>(item.replies || []);

  const isOwnPost = !!(currentUser?.id && item.author?.id && currentUser.id === item.author.id);

  // Generate a consistent avatar color from the author's name
  const avatarColors = [
    { bg: "bg-terracotta/15", text: "text-terracotta" },
    { bg: "bg-sage/15", text: "text-sage" },
    { bg: "bg-indigo-100", text: "text-indigo-600" },
    { bg: "bg-amber-100", text: "text-amber-700" },
  ];
  const colorIdx = (item.author?.name?.charCodeAt(0) ?? 0) % avatarColors.length;
  const avatarColor = avatarColors[colorIdx];

  const initials = item.author?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <li className="bg-white border border-ink/10 rounded-2xl p-5 transition-shadow hover:shadow-sm">
      {/* Author Row */}
      <div className="flex items-center justify-between mb-3">
        <Link
          href={`/profile/${item.author?.username}`}
          className="flex items-center gap-2.5 group"
        >
          {item.author?.image ? (
            <img
              src={item.author.image}
              alt={item.author.name || "Author"}
              className="w-8 h-8 rounded-full object-cover"
              style={{ border: "2px solid #c4613a22" }}
            />
          ) : (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold ${avatarColor.bg} ${avatarColor.text}`}>
              {initials}
            </div>
          )}
          <span className="text-[0.85rem] font-medium text-ink group-hover:text-terracotta transition-colors">
            {item.author?.name || "Anonymous"}
          </span>
          {isOwnPost && (
            <span className="text-[0.65rem] bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full font-medium">
              you
            </span>
          )}
        </Link>
        <span className="text-[0.72rem] text-ink/35">
          {timeAgo(item.createdAt)}
        </span>
      </div>

      {/* Content */}
      <p className="text-[0.92rem] text-ink/80 leading-[1.7] mb-4">
        {item.content}
      </p>

      {/* Divider */}
      <div className="border-t border-ink/8 pt-3">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={item.id}
            initialCount={item.likesCount}
            initialLiked={item.likedByMe}
          />
          <ReplyButton
            post={item}
            count={replyCount}
            onReplyAdded={(reply) => {
              const newReply: Post = {
                ...reply,
                parentId: item.id,
                replies: [],
                repliesCount: 0,
                likesCount: 0,
                repostsCount: 0,
                likedByMe: false,
                repostedByMe: false,
              };
              setReplyCount((c) => c + 1);
              setReplies((prev) => [...prev, newReply]);
              onReplyAdded(reply);
            }}
          />
          <RepostButton
            postId={item.id}
            count={item.repostsCount}
            initiallyReposted={item.repostedByMe ?? false}
            onRepostToggle={onRepostToggle}
            disabled={isOwnPost}
          />
        </div>
      </div>

      {/* Inline replies */}
      {replies.length > 0 && (
        <div className="mt-4 space-y-2 pl-4 border-l-2 border-sand-dark">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-sand rounded-xl px-4 py-3">
              <p className="text-[0.8rem] font-medium text-ink mb-1">
                {reply.author?.name || "Anonymous"}
              </p>
              <p className="text-[0.82rem] text-ink/60 leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}