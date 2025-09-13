"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import ReplyList from "@/components/ReplyList";
import ReplyForm from "@/components/ReplyForm";

interface ProfileClientProps {
  user: any;
  currentUserId: string;
  isFollowing: boolean;
  posts: any[];
}

export default function ProfileClient({
  user,
  currentUserId,
  isFollowing,
  posts,
}: ProfileClientProps) {
  // Track posts in state so counts can be updated
  const [allPosts, setAllPosts] = useState(
    posts.map((p) => ({ ...p, repliesCount: p.repliesCount }))
  );

  const handleAddComment = (postId: string) => {
    setAllPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, repliesCount: p.repliesCount + 1 } : p
      )
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
              className="bg-floral/80 text-smoky rounded-full px-4 py-1"
              onClick={() =>
                (window.location.href = `/followers?userId=${user.id}`)
              }
            >
              Followers {user._count.followers}
            </Button>
            <Button
              className="bg-floral/80 text-smoky rounded-full px-4 py-1"
              onClick={() =>
                (window.location.href = `/following?userId=${user.id}`)
              }
            >
              Following {user._count.following}
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
            {allPosts.map((post) => (
              <li
                key={post.id}
                className="p-4 rounded-lg bg-smoky border-b border-olive/40 flex justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={post.author?.image || ""}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      {/* <span className="text-sm text-gray-500">{post.author?.name}</span> */}
                      <p className="text-gray-400">{post.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>

                  
                    {/* <Button onClick={() => handleDeletePost(post.id)}>
                      <Trash2 />
                    </Button> */}
                  </div>
                </div>

                <div className="flex gap-5 mb-5 mt-2 justify-end">
                  <LikeButton
                    postId={post.id}
                    initialCount={post.likesCount}
                    initialLiked={post.likedByMe}
                  />
<ReplyButton postId={post.id} count={post.repliesCount} />                
</div>

{/* <ReplyList postId={post.id } initialReplies={post.comments} />
                <ReplyForm
                  postId={post.id}
                  onSuccess={() => {
                    setAllPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id
                          ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 }
                          : p
                      )
                    );
                  }}
                /> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}