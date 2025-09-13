"use client";
import { User } from "@/types";

interface ProfileProps {
  user: User | null;
}

export default function Profile({ user }: ProfileProps) {
  if (!user) {
    return (
      <div className="border p-4 rounded-xl shadow-md bg-olive/20">
        <h1 className="text-center">Your user profile</h1>
        <p className="text-center text-gray-400 mt-2">Not signed in</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-xl shadow-md bg-olive/20">
      <h1 className="text-center">Your user profile</h1>

      <div className="flex items-center space-x-4 mb-4 justify-center">
        <img
          src={user.image || ""}
          alt="Profile Image"
          className="w-16 h-16 rounded-full"
        />
      </div>

      <div className="text-center">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}