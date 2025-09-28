import FollowersClient from "./FollowersClient";
import { useSearchParams } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function FollowersPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
})  {


    const userId = (await searchParams).userId!;

    const followers = await prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, name: true, username: true, image: true },
        },
      }
    })

    const followerUsers = followers.map((f) => f.follower);




  return <div>
    <h1 className="text-2xl font-bold mb-4 mt-12">Followers</h1>

    <FollowersClient initialUsers={followerUsers} userId={userId} />


  </div>;
}