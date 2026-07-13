import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { NotificationType } from "@prisma/client";
import { inngest } from "@/lib/inngest";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: "postId is required" }, { status: 400 });
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
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { postId } = body;
        if (!postId) {
            return NextResponse.json({ error: "postId is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                authorId: true
            }
        });

        if (!post) {
            return NextResponse.json({ error: " Post not found" }, { status: 404 });
        }

        // check if a like already exists
        const existing = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: user.id,
                    postId,
                }
            },
            select: { id: true, }
        });

        let liked: boolean;
        let notificationEventId: string | null = null;

        if (existing) {
            // unlike
            await prisma.like.delete({
                where: { id: existing.id }

            })
            liked = false;
        } else {
            const result = await prisma.$transaction(async (tx) => {
                const like = await tx.like.create({
                    data: {
                        postId,
                        userId: user.id,
                    }
                });

                if (post.authorId === user.id) {
                    return {
                        eventId: null,
                    }
                }

                const notificationEvent = await tx.notificationEvent.create({
                    data: {
                        type: NotificationType.LIKE,
                        actorId: user.id,
                        recipientId: post.authorId,
                        postId,
                        idempotencyKey: `like-event:${like.id}`,
                        deduplicationKey: `like:${like.id}`,
                    },
                });
                return {
                    eventId: notificationEvent.id,
                }
            });
            liked = true;
            notificationEventId = result.eventId;
        }

        if (notificationEventId) {

            try {
                await inngest.send({
                    name: "notification/like.created",
                    data: {
                        notificationEventId,
                    },
                });
            } catch (error) {
                console.error(
                    "Failed to send notification event to Inngest:",
                    error
                );
            }
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