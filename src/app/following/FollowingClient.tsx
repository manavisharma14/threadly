"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

export default function FollowingClient() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [followingCount, setFollowingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  if (!userId) {
    return <div>No userId provided in query parameters.</div>;
  }

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${userId}/following`);
        const data = await res.json();
        setUsers(data);
        setFollowingCount(data.length);
      } catch (error) {
        console.error("Error fetching following:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 mt-12">Following</h1>
      <p className="text-center mt-2">This is the Following page.</p>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No following yet</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center space-x-4 mb-4 border-b pb-2"
            >
              {user.image && (
                <img
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold">
                  {user.name || user.username || "Unnamed User"}
                </p>
                <p className="text-sm text-gray-500">
                  @{user.username || "unknown"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}