import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, image: true, username: true, bio: true, linkedIn: true, website: true, building: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { username, bio, linkedIn, website, building } = await req.json();

  // (Optional) basic validation/sanitization here

  try {
    const updated = await prisma.user.update({
      where: { email: session.user.email },
      data: { username, bio, linkedIn, website, building },
      select: { username: true, bio: true, linkedIn: true, website: true, building: true },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    // handle unique username conflict
    if (e?.code === "P2002") return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}