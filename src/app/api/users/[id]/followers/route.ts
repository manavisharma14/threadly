import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const followers = await prisma.follows.findMany({
    where: { followingId: id },
    include: { follower: true },
  });

  return NextResponse.json(followers.map(f => f.follower));
}