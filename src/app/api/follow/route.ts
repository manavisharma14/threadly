import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { targetUserId } = body;
    if (!targetUserId || typeof targetUserId !== "string") {
        return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!currentUser) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
    });

    if (!targetUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (currentUser.id === targetUser.id) {
        return NextResponse.json({ message: "You cannot follow yourself" }, { status: 400 });
    }

    const existingFollow = await prisma.follows.findFirst({
        where: {
          followerId: currentUser.id,
          followingId: targetUser.id,
        },
      });
      
    if (existingFollow) {
        return NextResponse.json({ message: "Already following" }, { status: 400 });
    }

    try {
        const follow = await prisma.follows.create({
            data: {
                followerId: currentUser.id,
                followingId: targetUser.id
            }
        })

        return NextResponse.json({ message: "Followed successfully", follow }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}   

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;
    if (!targetUserId || typeof targetUserId !== "string") {
        return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if(!currentUser){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
    })

    if(!targetUser){
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if(currentUser.id === targetUser.id){
        return NextResponse.json({ message: "You cannot unfollow yourself" }, { status: 400 });
    }


    try {
        const unfollow = await prisma.follows.deleteMany({
            where: {
                followerId: currentUser.id,
                followingId: targetUser.id
            }
        })
        return NextResponse.json({ message: "Unfollowed successfully", unfollow }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }


}
