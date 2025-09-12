import { prisma } from "@/lib/prisma";
import {Button} from "@/components/ui/button";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  // decode %40 -> @, then remove leading "@"
  const cleanUsername = decodeURIComponent(username); // keep @

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: {
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      linkedIn: true,
      website: true,
      building: true,
    },
  });

  if (!user) {
    return <p className="text-center mt-10">User not found</p>;
  }

  const posts = await prisma.post.findMany({
    where: { author: { username: cleanUsername } },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="mt-10 p-6 w-3/4 mx-auto space-y-8">
      {/* Profile Header */}
      {/* Profile Header */}
<div className="flex items-center gap-8 bg-olive/20 rounded-2xl shadow-md p-8 border border-olive/30">
  <img
    src={user.image || "/default-avatar.png"}
    alt={user.name || "Profile"}
    className="w-28 h-28 rounded-full border-4 border-bone shadow-sm"
  />

  <div className="flex-1">
    <h2 className="text-2xl font-bold text-floral">{user.name}</h2>
    <p className="text-sm text-floral/70">{user.username}</p>

    <p className="mt-3 text-floral/90">
      Bio: {user.bio || "No bio yet."}
    </p>

    <div className="mt-3 text-sm space-y-1">
      <p className="text-floral">LinkedIn: {user.linkedIn || "—"}</p>
      <p className="text-floral">Website: {user.website || "—"}</p>
      <p className="text-floral">Building: {user.building || "—"}</p>
    </div>
  </div>

  <div className="ml-auto flex flex-col gap-3">
    <Button className="bg-floral text-smoky rounded-full px-5 py-2 shadow hover:opacity-90">
      Follow
    </Button>
    <div className="flex gap-2">
      <Button className="bg-floral/80 text-smoky rounded-full px-4 py-1">
        Followers
      </Button>
      <Button className="bg-floral/80 text-smoky rounded-full px-4 py-1">
        Following
      </Button>
    </div>
  </div>
</div>

      {/* Posts */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-bone">Posts by {user.name}</h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts yet.</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="p-4 rounded-lg bg-smoky border-b border-olive/40">
                <p className="text-floral">{post.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleString()}
                </p>

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
