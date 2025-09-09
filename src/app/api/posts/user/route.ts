import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function GET(req: NextRequest){
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

try{
    const posts = await prisma.post.findMany({
        where: { author: {email: session.user.email } },
        orderBy: { createdAt : "desc" },
        include: { author: true},
    })
return NextResponse.json({posts});
} catch (error) {
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});    
}
}