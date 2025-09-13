"use client";

interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}

export default function FollowingClient({
  initialUsers = [],
  userId,
}: { initialUsers?: User[]; userId: string }) {
  if (!userId) {
    return <div>No userId provided in query parameters.</div>;
  }

  if (initialUsers.length === 0) {
    return <p className="text-gray-400">No following yet</p>;
  }

  return (
    <ul>
      {initialUsers.map((user) => (
        <li
          key={user.id}
          className="flex items-center space-x-4 mb-4 pb-2"
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
              {user.username || "unknown"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}