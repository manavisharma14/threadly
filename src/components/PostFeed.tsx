// components/PostFeed.tsx
"use client";
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import Link from "next/link";
import { Repeat2 } from "lucide-react";
import RepostButton from "@/components/RepostButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Post, Reply, User } from "@/types";
import { TimelineItem } from "@/types/timeline";

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
      setPosts((prev) => [{ type: "post", ...newPost }, ...prev]);
    }
  }, [newPost]);

  const normalizePost = (item: TimelineItem): Post => {
    if (item.type === "post") {
      return item;
    }
    return {
      ...item.post,
      parentId: null,
      replies: item.post.replies || [],
    };
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      <ul>
        {posts.map((item) => (
          <PostItem
            key={item.id}
            item={item}
            currentUser={currentUser}
            onReplyAdded={(reply) => {
              setPosts((prev) =>
                prev.map((p) => {
                  const isMatch =
                    p.type === "post" && item.type === "post" && p.id === item.id 
                  //   p.type === "repost" && item.type === "repost" && p.post.id === item.post.id;
                  // if (!isMatch) return p;
                  return p.type === "post"
                    ? {
                        ...p,
                        repliesCount: (p.repliesCount ?? 0) + 1,
                        replies: [...(p.replies || []), reply],
                      }
                    : {
                        ...p,
                        count: p.count,
                        post: {
                          ...p.post,
                          repliesCount: (p.post.repliesCount ?? 0) + 1,
                          replies: [...(p.post.replies || []), reply],
                        },
                      };
                })
              );
            }}
            onRepostToggle={(reposted) => {
              setPosts((prev) =>
                prev.map((p) => {
                  const isMatch =
                    p.type === "post" && item.type === "post" && p.id === item.id ||
                    p.type === "repost" && item.type === "repost" && p.post.id === item.post.id;
                  if (!isMatch) return p;
                  return p.type === "post"
                    ? {
                        ...p,
                        repostedByMe: reposted,
                        repostsCount: reposted ? p.repostsCount + 1 : p.repostsCount - 1,
                      }
                    : {
                        ...p,
                        post: {
                          ...p.post,
                          repostedByMe: reposted,
                          repostsCount: reposted ? p.post.repostsCount + 1 : p.post.repostsCount - 1,
                        },
                      };
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
  item: TimelineItem;
  currentUser: User | null;
  onReplyAdded: (reply: Reply) => void;
  onRepostToggle: (reposted: boolean) => void;
}) {
  const post = item.type === "post" ? item : item.post;
  const isRepost = item.type === "repost";
  const [replyCount, setReplyCount] = useState(post.repliesCount ?? 0);
  const [replies, setReplies] = useState<Reply[]>(post.replies || []);

  return (
    <li className="border-b border-gray-700 py-4">
      {isRepost && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
          <Repeat2 size={16} />
          <span>Reposted by {currentUser?.username || currentUser?.name || "You"}</span>
        </div>
      )}
      <div className="mb-4 flex justify-between items-start">
        <Link href={`/posts/${post.id}`} className="flex-1">
          <p className="text-gray-800">{post.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </Link>

        {post.author ? (
          <Link
            href={`/profile/${post.author.username}`}
            className="flex items-center gap-2 ml-4"
          >
            <img
              src={post.author.image || "/default-avatar.png"}
              alt={post.author.name || "Author"}
              className="w-6 h-6 rounded-full"
            />
            <p className="text-sm text-gray-500">{post.author.name}</p>
          </Link>
        ) : (
          <p className="text-sm text-gray-300">Anonymous</p>
        )}
      </div>

      <div className="flex gap-5 mb-5 mt-2 justify-start">
        <LikeButton
          postId={post.id}
          initialCount={post.likesCount}
          initialLiked={post.likedByMe}
        />

        <ReplyButton
          post={post}
          count={replyCount}
          onReplyAdded={(reply) => {
            setReplyCount((c) => c + 1);
            setReplies((prev) => [...prev, reply]);
            onReplyAdded(reply);
          }}
        />

<RepostButton
  postId={post.id}
  count={post.repostsCount}
  initiallyReposted={post.repostedByMe ?? false}
  onRepostToggle={onRepostToggle}
/>
      </div>
    </li>
  );
}