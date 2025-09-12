// app/profile/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <p className="text-center mt-10">You are not logged in.</p>;
  }

  // fetch profile
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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

  // fetch posts
  const posts = await prisma.post.findMany({
    where: { author: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return <ProfileClient session={session} user={user} posts={posts} />;
}