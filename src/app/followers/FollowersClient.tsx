"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

export default function FollowersClient({
  initialUsers = [],
  userId,
}: {
  initialUsers?: User[];
  userId?: string;
}) {
  // ✅ hydrate state with server-passed users
  const [users, setUsers] = useState<User[]>(initialUsers);

  if (!users || users.length === 0) {
    return <p className="text-gray-400">No followers yet</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li
          key={user.id}
          className="flex items-center space-x-4 mb-4 pb-2"
        >
          {user.image && (
            <img
              src={user.image}
              alt={user.name || "User Avatar"}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{user.name || "Unnamed User"}</p>
            <p className="text-sm text-gray-500">{user.username || "unknown"}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}