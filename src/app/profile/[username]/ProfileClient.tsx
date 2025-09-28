"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import RepostButton from "@/components/RepostButton";
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
        ? {
          ...p,
          post: {
            ...p.post,
            repliesCount: p.post.repliesCount ?? 0,
            repostsCount: p.post.repostsCount ?? 0,
          },
        }
        : {
          ...p,
          repliesCount: p.repliesCount ?? 0,
          repostsCount: p.repostsCount ?? 0,
        }
    )
  );

  const handleAddComment = (postId: string) => {
    setAllPosts((prev) =>
      prev.map((p) => {
        const target = p.type === "repost" ? p.post : p;
        if (target.id === postId) {
          if (p.type === "repost") {
            return {
              ...p,
              post: { ...p.post, repliesCount: p.post.repliesCount + 1 },
            };
          }
          return { ...p, repliesCount: p.repliesCount + 1 };
        }
        return p;
      })
    );
  };

  return (
    <div className="mt-10 p-6 w-3/4 mx-auto space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-8 bg-olive/20 rounded-2xl shadow-md p-8 border border-olive/30">
        <img
          src={user.image || "/default-avatar.png"}
          alt={user.name || "Profile"}
          className="w-28 h-28 rounded-full border-4 border-bone shadow-sm"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-floral">{user.name}</h2>
          <p className="text-sm text-floral/70">@{user.username}</p>
          <p className="mt-3 text-floral/90">{user.bio || "No bio yet."}</p>

          <div className="mt-3 text-sm space-y-1">
            <p className="text-floral">LinkedIn: {user.linkedIn || "—"}</p>
            <p className="text-floral">Website: {user.website || "—"}</p>
            <p className="text-floral">Building: {user.building || "—"}</p>
          </div>
        </div>

        <div className="ml-auto flex flex-col gap-3">
          {currentUserId && currentUserId !== user.id && (
            <FollowButton
              isFollowingInitial={isFollowing}
              targetUserId={user.id}
              currentUserId={currentUserId}
            />
          )}
          <div className="flex gap-2">
            <Button
              className="bg-olive/80 text-smoky rounded-full px-4 py-1"
              onClick={() =>
                (window.location.href = `/followers?userId=${user.id}`)
              }
            >
              Followers {user._count?.followers ?? 0}
            </Button>
            <Button
              className="bg-olive/80 text-smoky rounded-full px-4 py-1"
              onClick={() =>
                (window.location.href = `/following?userId=${user.id}`)
              }
            >
              Following {user._count?.following ?? 0}
            </Button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Posts by {user.name}
        </h2>

        {allPosts.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {allPosts.map((item) => {
              const isRepost = item.type === "repost";
              const post = isRepost ? (item as TimelineRepost).post : (item as TimelinePost);
              const repostedAt = isRepost ? item.createdAt : null;

              return (
                <li
                  key={item.id}
                  className="p-4 rounded-lg bg-smoky border-b border-olive/40 flex flex-col"
                >
                  {/* Repost Meta */}
                  {isRepost && (
                    <p className="text-xs text-olive mb-2 italic">
                      {user.name} reposted on{" "}
                      {new Date(repostedAt!).toLocaleString()}
                    </p>
                  )}

                  {/* Post Content */}
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author?.image || "/default-avatar.png"}
                      alt={post.author?.name || "Author"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-gray-400">{post.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex gap-5 mt-3 justify-end">
                    <LikeButton
                      postId={post.id}
                      initialCount={post.likesCount}
                      initialLiked={post.likedByMe}
                    />
                    <ReplyButton
                      post={post}
                      count={post.repliesCount}
                      onReplyAdded={() => handleAddComment(post.id)}
                    />
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
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
                                  ? {
                                    ...p,
                                    repostedByMe: newState,
                                    repostsCount: newState
                                      ? p.repostsCount + 1
                                      : Math.max(0, p.repostsCount - 1),
                                  }
                                  : {
                                    ...p,
                                    post: {
                                      ...p.post,
                                      repostedByMe: newState,
                                      repostsCount: newState
                                        ? p.post.repostsCount + 1
                                        : Math.max(0, p.post.repostsCount - 1),
                                    },
                                  }
                                : p
                            )
                          );
                        }}
                        disabled={post.author?.id === currentUserId}
                      />

                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
