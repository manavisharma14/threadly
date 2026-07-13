import {
  NotificationEventStatus,
} from "@prisma/client";

import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : String(error);
}

export const processLikeNotification =
  inngest.createFunction(
    {
      id: "process-like-notification",

      // Inngest retries the failed function automatically.
      retries: 5,

      triggers: [
        {
          event: "notification/like.created",
        },
      ],

      // Runs only after all retries have been exhausted.
      onFailure: async ({ event, error }) => {
        const originalEvent = event.data.event;

        const notificationEventId =
          originalEvent.data
            .notificationEventId as string;

        await prisma.notificationEvent.update({
          where: {
            id: notificationEventId,
          },
          data: {
            status:
              NotificationEventStatus.DEAD_LETTER,
            lastError: getErrorMessage(error),
            deadLetteredAt: new Date(),
            lockedAt: null,
            lockedBy: null,
          },
        });
      },
    },

    async ({ event, step }) => {
      const notificationEventId =
        event.data.notificationEventId as string;

      const notificationEvent = await step.run(
        "load-notification-event",
        async () => {
          return prisma.notificationEvent.findUnique({
            where: {
              id: notificationEventId,
            },
          });
        }
      );

      if (!notificationEvent) {
        throw new Error(
          `NotificationEvent ${notificationEventId} not found`
        );
      }

      // Prevent already-completed work from running again.
      if (
        notificationEvent.status ===
        NotificationEventStatus.COMPLETED
      ) {
        return {
          skipped: true,
          reason: "already-completed",
        };
      }

      await step.run("mark-processing", async () => {
        return prisma.notificationEvent.update({
          where: {
            id: notificationEventId,
          },
          data: {
            status:
              NotificationEventStatus.PROCESSING,
            lastError: null,
          },
        });
      });

      try {
        await step.run(
          "create-notification",
          async () => {
            return prisma.notification.upsert({
              where: {
                eventId: notificationEventId,
              },

              // If it already exists, do nothing.
              update: {},

              create: {
                eventId: notificationEventId,
                type: notificationEvent.type,
                actorId:
                  notificationEvent.actorId,
                recipientId:
                  notificationEvent.recipientId,
                postId:
                  notificationEvent.postId,
              },
            });
          }
        );
      } catch (error) {
        // Record the failed attempt, then rethrow so
        // Inngest performs its automatic retry.
        await prisma.notificationEvent.update({
          where: {
            id: notificationEventId,
          },
          data: {
            status:
              NotificationEventStatus.RETRYING,

            attemptCount: {
              increment: 1,
            },

            lastError: getErrorMessage(error),
          },
        });

        throw error;
      }

      await step.run("mark-completed", async () => {
        return prisma.notificationEvent.update({
          where: {
            id: notificationEventId,
          },
          data: {
            status:
              NotificationEventStatus.COMPLETED,
            processedAt: new Date(),
            lastError: null,
            lockedAt: null,
            lockedBy: null,
          },
        });
      });

      return {
        processed: true,
        notificationEventId,
      };
    }
  );