// src/app/notifications/page.tsx

"use client";

import { useEffect, useState } from "react";

type NotificationItem = {
  id: string;
  type: "LIKE" | "REPLY" | "FOLLOW" | "REPOST";
  isRead: boolean;
  createdAt: string;
  actor: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  post: {
    id: string;
    content: string;
  } | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to load notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border p-6 text-center text-gray-500">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-2xl border p-4 ${
                notification.isRead ? "bg-white" : "bg-orange-50"
              }`}
            >
              <div className="flex items-start gap-3">
                {notification.actor.image ? (
                  <img
                    src={notification.actor.image}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                )}

                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">
                      {notification.actor.name ??
                        notification.actor.username ??
                        "Someone"}
                    </span>{" "}
                    {notification.type === "LIKE" &&
                      "liked your post."}
                  </p>

                  {notification.post?.content && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {notification.post.content}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}