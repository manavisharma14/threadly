import FollowingClient from "./FollowingClient";
import { prisma } from "@/lib/prisma";
export default async function Following({
    searchParams
} : { searchParams: Promise<{ userId: string }> }) {

    const userId = (await searchParams).userId;
    const following = await prisma.follows.findMany({
        where: { followerId: userId },
        include: {
          following: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      });
      
      const followingUsers = following.map(f => f.following);

    return <div>
        <h1 className="text-2xl font-bold mb-4 mt-12">Following</h1>
    
        <FollowingClient initialUsers={followingUsers} userId={userId} />
    
    </div>;
}