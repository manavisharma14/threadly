import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    const following = await prisma.follows.findMany({
      where: { followerId: id },
      include: { following: true },
    });
  
    return NextResponse.json(following.map(f => f.following));
  }