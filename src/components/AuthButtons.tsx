// components/AuthButtons.tsx
"use client";
import { signIn, signOut } from "next-auth/react";

export function AuthButtons({ session }: { session: any }) {
  if (session) {
    return (
      <div className="flex gap-4 items-center">
        <img
          src={session.user?.image || ""}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign In</button>;
}


