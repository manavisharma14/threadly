"use client";
import { useState } from "react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LikeButton from "@/components/LikeButton";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import { Trash2 } from "lucide-react";
import CommentButton from "@/components/CommentButton";
import { User, Post } from "@prisma/client"; 
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

export default function ProfileClient({ session, user, posts } : ProfileClientProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [linkedin, setLinkedin] = useState(user?.linkedIn ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [building, setBuilding] = useState(user?.building ?? "");
  const [allPosts, setAllPosts] = useState(posts);

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

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      setAllPosts(allPosts.filter((p) => p.id !== postId));
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
            <p className="text-floral">{bio || "No bio yet."}</p>
            <p className="text-floral">LinkedIn: {linkedin || "—"}</p>
            <p className="text-floral">Website: {website || "—"}</p>
            <p className="text-floral">Building: {building || "—"}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="ml-auto bg-olive text-bone px-4 py-2 rounded-md">
            Edit Profile
          </DialogTrigger>
          <DialogContent className="bg-smoky text-floral border border-olive/40">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Update what others see on your profile.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-2 ">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@yourhandle"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  placeholder="Founder at…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/you"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://yourdomain.xyz"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="building">What are you building?</Label>
                <Input
                  id="building"
                  placeholder="One-liner about your product"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-olive text-bone hover:bg-olive/80">
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-bone">Your Posts</h2>
        {allPosts.length === 0 ? (
          <p className="text-gray-400">No posts yet. Write your first post!</p>
        ) : (
          <ul className="space-y-4">
            {allPosts.map((post) => (
              <li key={post.id} className="p-4 rounded-lg bg-smoky border-b border-olive/40">
                <div className="flex items-center gap-3">
                  <img src={post.author?.image || ""} alt="" className="w-8 h-8 rounded-full" />
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <span className="text-sm text-bone">{post.author?.name}</span>
                      <p className="text-floral">{post.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button onClick={() => handleDeletePost(post.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-5 mb-5 mt-2 justify-end">
                  <LikeButton postId={post.id} />
                  <CommentButton postId={post.id} />
                </div>

                <CommentList postId={post.id} />
                <CommentForm postId={post.id} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}