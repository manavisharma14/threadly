"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import ReplyList from "@/components/ReplyList";
import ReplyForm from "@/components/ReplyForm";
import { Trash2 } from "lucide-react";
import ReplyButton from "@/components/ReplyButton";
import { Post } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  posts: (Post & { author: { name: string | null; image: string | null } })[];
};

export default function ProfileClient({ session, user, posts }: ProfileClientProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [linkedin, setLinkedin] = useState(user?.linkedIn ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [building, setBuilding] = useState(user?.building ?? "");

  const [allPosts, setAllPosts] = useState<
    (Post & { author: { name: string | null; image: string | null } })[]
  >(posts);

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
      setAllPosts((prev) => prev.filter((p) => p.id !== postId));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || "Failed to delete post");
    }
  };

  return (
    <div className="mt-10 p-6 w-3/4 mx-auto space-y-8">
      {/* Header */}
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

        {/* Edit profile dialog */}
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
    <div>
      <label className="block text-sm text-floral/80 mb-1">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
      />
    </div>

    <div>
      <label className="block text-sm text-floral/80 mb-1">Bio</label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
        rows={3}
      />
    </div>

    <div>
      <label className="block text-sm text-floral/80 mb-1">LinkedIn</label>
      <input
        type="url"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
      />
    </div>

    <div>
      <label className="block text-sm text-floral/80 mb-1">Website</label>
      <input
        type="url"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
      />
    </div>

    <div>
      <label className="block text-sm text-floral/80 mb-1">Building</label>
      <input
        type="text"
        value={building}
        onChange={(e) => setBuilding(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-gray-800 text-floral border border-gray-600"
      />
    </div>

    {/* Save button */}
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen(false)}
      >
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
        {allPosts.filter((p) => !p.parentId).length === 0 ? (
          <p className="text-gray-400">No posts yet. Write your first post!</p>
        ) : (
          <ul className="space-y-4">
            {allPosts
              .filter((post) => !post.parentId) // ✅ hide replies
              .map((post) => (
                <li
                  key={post.id}
                  className="p-4 rounded-lg bg-smoky border-b border-olive/40"
                >
                  {/* Post header */}
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author?.image || ""}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <span className="text-sm text-gray-500">
                          {post.author?.name}
                        </span>
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

                  {/* Actions row */}
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
    setAllPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              repliesCount: (p.repliesCount ?? 0) + 1,
              replies: [...(p.replies || []), reply],
            }
          : p
      )
    );
  }}
/>                  </div>

                  {/* Replies */}
                  {/* <ReplyList postId={post.id} initialReplies={post.replies || []} /> */}
                  {/* <ReplyForm
  post={post}
  onSuccess={(reply) => {
    setAllPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              repliesCount: (p.repliesCount ?? 0) + 1,
              replies: [...(p.replies || []), reply], // ✅ persist new reply
            }
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