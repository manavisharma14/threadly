import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if(!postId){
            return NextResponse.json({ error : "postId is required"}, { status: 400 });
        }

        const count = await prisma.like.count({
            where: { postId }
        })

        const session = await getServerSession(authOptions);
        let liked = false;

        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
              where: { email: session.user.email },
              select: { id: true },
            });
      
            if (user) {
              const existing = await prisma.like.findFirst({
                where: { postId, userId: user.id },
                select: { id: true },
              });
              liked = !!existing;
            }
          }
      
          return NextResponse.json({ count, liked });
        } catch (err) {
          console.error("GET /api/likes error", err);
          return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        }
      }

export async function POST(request: NextRequest) {
    try{
        const session = await getServerSession(authOptions);
        if(!session?.user?.email){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { postId } = body;
        if(!postId){
            return NextResponse.json({ error: "postId is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email : session.user.email },
            select: { id: true }
        })

        if(!user){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // check if a like already exists
        const existing = await prisma.like.findFirst({
            where: { postId, userId: user.id },
            select: { id: true }
        });

        let liked: boolean;

        if(existing){
            // unlike
            await prisma.like.delete({
                where: { id: existing.id }

            })
            liked = false;
        } else {
            // create a new liked record
            await prisma.like.create({
                data: { postId, userId: user.id }
            })
            liked = true;
        }

        const count = await prisma.like.count({
            where: { postId }
        })
        return NextResponse.json({ liked, count });
    } catch (err) {
        console.error("POST /api/likes error", err);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }

}