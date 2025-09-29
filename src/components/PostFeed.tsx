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
      setPosts((prev) => [{ type: "post" as const, ...newPost }, ...prev]);
    }
  }, [newPost]);

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      <ul>
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
                    const updated: TimelinePost = {
                      ...p,
                      repliesCount: (p.repliesCount ?? 0) + 1,
                      replies: [...(p.replies || []), newReply],
                    };
                    return updated;
                  }
                  return p;
                })
              );
            }}
            onRepostToggle={(reposted) => {
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.type === "post" && p.id === item.id) {
                    const updated: TimelinePost = {
                      ...p,
                      repostedByMe: reposted,
                      repostsCount: reposted ? p.repostsCount + 1 : p.repostsCount - 1,
                    };
                    return updated;
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

  return (
    <li className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4 shadow-sm">
  {/* Author Row */}
  <div className="flex justify-between items-center mb-2">
    <Link href={`/profile/${item.author?.username}`} className="flex items-center gap-2">
      <img
        src={item.author?.image || "/default-avatar.png"}
        alt={item.author?.name || "Author"}
        className="w-8 h-8 rounded-full"
      />
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {item.author?.name || "Anonymous"}
      </p>
    </Link>

    <p className="text-xs text-gray-500">
      {new Date(item.createdAt).toLocaleString()}
    </p>
  </div>

  {/* Post Content */}
  <p className="text-gray-800 dark:text-gray-100 text-base leading-relaxed mb-3">
    {item.content}
  </p>

  {/* Action Buttons */}
  <div className="flex gap-6">
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
</li>
  );
}