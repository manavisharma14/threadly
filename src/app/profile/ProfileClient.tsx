"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import ReplyButton from "@/components/ReplyButton";
import { Trash2 } from "lucide-react";
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

export default function ProfileClient({ session, user, posts }: ProfileClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [linkedin, setLinkedin] = useState(user?.linkedIn ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [building, setBuilding] = useState(user?.building ?? "");

  const [allPosts, setAllPosts] = useState<TimelineItem[]>(posts);

  // Save profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { username, bio, linkedIn: linkedin, website, building };

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message ?? "Failed to update profile");
    }
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      setAllPosts((prev) => prev.filter((p) => p.type !== "post" || p.id !== postId));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || "Failed to delete post");
    }
  };

  // Normalize TimelineItem to Post
  const normalizePost = (item: TimelineItem): Post => {
    if (item.type === "post") {
      return item; // TimelinePost extends Post, so it's compatible
    }
    // For TimelineRepost, extract the nested post
    return {
      ...item.post,
      parentId: null, // Reposts typically don't have a parentId
      replies: item.post.replies || [], // Ensure replies is an array
    };
  };

  return (
    <div className="mt-10 p-6 w-3/4 mx-auto space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6 bg-olive/20 rounded-xl shadow-md p-6">
        <img
          src={user?.image || ""}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-bone"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-floral">{user?.name}</h2>
          <p className="text-sm text-floral/70">{user?.email}</p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-floral">{username}</p>
            <p className="text-floral">{bio || "No bio yet."}</p>
            <p className="text-floral">LinkedIn: {linkedin || "—"}</p>
            <p className="text-floral">Website: {website || "—"}</p>
            <p className="text-floral">Building: {building || "—"}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="ml-auto bg-olive text-white px-4 py-2 rounded-xl hover:bg-olive/60">
            Edit Profile
          </DialogTrigger>
          <DialogContent className="bg-smoky text-floral border border-olive/40">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Update what others see on your profile.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Bio"
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
                rows={3}
              />
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="LinkedIn"
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
              />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website"
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
              />
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Building"
                className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-white">Your Posts</h2>
        {allPosts.filter((p) => p.type === "post" && !p.parentId).length === 0 ? (
          <p className="text-gray-400">No posts yet. Write your first post!</p>
        ) : (
          <ul className="space-y-4">
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
                  <li
                    key={item.id}
                    className="p-4 rounded-lg bg-smoky border-b border-olive/40"
                  >

{isRepost && (
                    <p className="text-xs text-olive mb-2 italic">
                      You reposted on{" "}
                      {new Date(repostedAt!).toLocaleString()}
                    </p>
                  )}  
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author?.image || ""}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 flex justify-between items-start">
                        <div>
                          <span className="text-sm text-gray-500">{post.author?.name}</span>
                          <p className="text-gray-400">{post.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Button onClick={() => handleDeletePost(post.id)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-5 mb-5 mt-2 justify-end">
                      <LikeButton
                        postId={post.id}
                        initialCount={post.likesCount}
                        initialLiked={post.likedByMe}
                      />
                      <ReplyButton
                        post={post}
                        count={post.repliesCount}
                        onReplyAdded={(reply) => {
                          setAllPosts((prev): TimelineItem[] =>
                            prev.map((p) => {
                              if (p.type === "post" && p.id === post.id) {
                                const updated: TimelinePost = {
                                  ...p,
                                  repliesCount: p.repliesCount + 1,
                                  replies: [
                                    ...p.replies,
                                    {
                                      ...reply,
                                      author: {
                                        ...reply.author,
                                        email: reply.author.email ?? null,
                                      },
                                    },
                                  ],
                                };
                                return updated;
                              }
                              if (p.type === "repost" && p.post.id === post.id) {
                                const updated: TimelineRepost = {
                                  ...p,
                                  post: {
                                    ...p.post,
                                    repliesCount: p.post.repliesCount + 1,
                                    replies: [
                                      ...(p.post.replies || []),
                                      {
                                        ...reply,
                                        author: {
                                          ...reply.author,
                                          email: reply.author.email ?? null,
                                        },
                                      },
                                    ],
                                  },
                                };
                                return updated;
                              }
                              return p;
                            })
                          );
                        }}
                      />
                      {/* <RepostButton
  postId={post.id}
  initiallyReposted={post.repostedByMe ?? false}
  onRepostToggle={(newState) => {
    setAllPosts((prev) => {
      const alreadyExists = prev.some(
        (p) => p.type === "repost" && p.post.id === post.id
      );

      if (newState && !alreadyExists) {
        // ✅ Add repost to the top of the timeline
        const newRepost: TimelineRepost = {
          type: "repost",
          id: `temp-${Date.now()}`, // temp id, optionally replace
          createdAt: new Date().toISOString(),
          count: (post.repostsCount ?? 0) + 1,
          post: {
            ...post,
            repostedByMe: true,
          },
        };
        return [newRepost, ...prev];
      }

      // ✅ Just update repostedByMe on matching post
      return prev.map((p) =>
        (p.type === "post" && p.id === post.id) ||
        (p.type === "repost" && p.post.id === post.id)
          ? p.type === "post"
            ? { ...p, repostedByMe: newState }
            : { ...p, post: { ...p.post, repostedByMe: newState } }
          : p
      );
    });
  }}
/> */}
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