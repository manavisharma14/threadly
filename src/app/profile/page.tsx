"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  // profile fields
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [building, setBuilding] = useState("");

  // Load profile + posts
  useEffect(() => {
    if (!session?.user?.email) return;

    (async () => {
      // profile
      const profRes = await fetch("/api/profile", { method: "GET" });
      if (profRes.ok) {
        const u = await profRes.json();
        setUsername(u.username ?? "");
        setBio(u.bio ?? "");
        setLinkedin(u.linkedIn ?? "");
        setWebsite(u.website ?? "");
        setBuilding(u.building ?? "");
      }

      // posts
      const res = await fetch("/api/posts/user", {
        headers: { "Content-Type": "application/json", email: session?.user?.email || "" },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    })();
  }, [session?.user?.email]);

  if (!session) return <p className="text-center mt-10">You are not logged in.</p>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username: username?.trim() || null,
      bio: bio?.trim() || null,
      linkedIn: linkedin?.trim() || null,
      website: website?.trim() || null,
      building: building?.trim() || null,
    };

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh(); // revalidate server components if any
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message ?? "Failed to update profile");
    }
  };

  return (
    <div className="mt-10 p-6 w-3/4 mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 bg-olive/20 rounded-xl shadow-md p-6">
        <img
          src={session.user?.image || ""}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-bone"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-bone">{session.user?.name}</h2>
          <p className="text-sm text-floral/70">{session.user?.email}</p>

          <div className="mt-3 space-y-1 text-sm">
            <p className="text-bone/90">{bio || "No bio yet."}</p>
            <p className="text-bone/80">LinkedIn: {linkedin || "—"}</p>
            <p className="text-bone/80">Website: {website || "—"}</p>
            <p className="text-bone/80">Building: {building || "—"}</p>
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
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="@yourhandle" value={username} onChange={(e) => setUsername(e.target.value)} 
                  className="rounded-xl border border-white/10 mt-2 bg-white/5 text-floral placeholder:text-floral/40
                  focus:border-olive/60 focus:ring-2 focus:ring-olive/30 mb-3" />
                
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" placeholder="Founder at…" value={bio} onChange={(e) => setBio(e.target.value)}
                className="rounded-xl border border-white/10  mt-2 bg-white/5 text-floral placeholder:text-floral/40
                focus:border-olive/60 focus:ring-2 focus:ring-olive/30 mb-3" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input id="linkedin" placeholder="https://linkedin.com/in/you" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} 
                className="rounded-xl border border-white/10 mt-2 bg-white/5 text-floral placeholder:text-floral/40
                focus:border-olive/60 focus:ring-2 focus:ring-olive/30 mb-3"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourdomain.xyz" value={website} onChange={(e) => setWebsite(e.target.value)} 
                className="rounded-xl border border-white/10 mt-2 bg-white/5 text-floral placeholder:text-floral/40
                focus:border-olive/60 focus:ring-2 focus:ring-olive/30 mb-3"/>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="building">What are you building?</Label>
                <Input id="building" placeholder="One-liner about your product" value={building} onChange={(e) => setBuilding(e.target.value)}
                className="rounded-xl border border-white/10  mt-2 bg-white/5 text-floral placeholder:text-floral/40
                focus:border-olive/60 focus:ring-2 focus:ring-olive/30 mb-3" />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-olive text-bone hover:bg-olive/80">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-bone">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts yet. Write your first post!</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id as string} className="p-4 rounded-lg bg-smoky border-b border-olive/40">
                <p className="text-floral">{post.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2 mt-2 justify-end">
                  <img src={post.author?.image || ""} alt="" className="w-8 h-8 rounded-full" />
                  <span className="text-sm text-bone">{post.author?.name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}