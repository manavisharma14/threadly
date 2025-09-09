import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// create a new post

export async function POST(req: NextRequest){
    const session = await getServerSession(authOptions);

    if(!session){
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const body = await req.json();
    const { content } = body;

    if( !content || content.length === 0){
        return NextResponse.json({message: "You need to post something"}, {status: 400});
    }

    const post = await prisma.post.create({
        data: {
            content, 
            author: { connect: { email : session.user?.email!}},
        }
    })
    return NextResponse.json(post);
}

// get all posts
export async function GET(){
    const posts = await prisma.post.findMany({
        orderBy: { createdAt : "desc" },
        include: { author: true},
    })

    return NextResponse.json(posts);
}