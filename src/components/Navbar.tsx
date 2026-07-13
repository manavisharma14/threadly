"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
      style={{
        background: "rgba(250,248,244,0.92)",
        backdropFilter: "blur(8px)",
        borderColor: "rgba(26,26,46,0.10)",
      }}
    >
      <Link
        href="/home"
        className="font-serif text-[1.5rem] font-bold tracking-tight"
        style={{ color: "#1a1a2e" }}
      >
        Thread<em className="italic" style={{ color: "#c4613a" }}>O</em>
      </Link>

      {status === "loading" ? (
        <div className="w-8 h-8 rounded-full animate-pulse" style={{ background: "#f5f0e8" }} />
      ) : session ? (
        <div className="flex items-center gap-6">
  <Link
    href="/home"
    className="text-sm transition-colors hover:text-terracotta"
    style={{ color: "rgba(26,26,46,0.5)" }}
  >
    Feed
  </Link>

  <Link
    href="/notifications"
    className="text-sm transition-colors hover:text-terracotta"
    style={{ color: "rgba(26,26,46,0.5)" }}
  >
    Notifications
  </Link>

  <Link href="/profile" className="flex items-center gap-2 group">
            {session.user?.image ? (
              <img
                src={session.user.image}
                className="w-8 h-8 rounded-full object-cover"
                style={{ border: "2px solid #c4613a55" }}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ background: "#f0d5c8", color: "#c4613a" }}
              >
                {session.user?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span
              className="text-sm font-medium hidden md:block"
              style={{ color: "#1a1a2e" }}
            >
              {session.user?.name}
            </span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/home" })}
            className="text-sm transition-colors"
            style={{ color: "rgba(26,26,46,0.4)" }}
            onMouseOver={e => (e.currentTarget.style.color = "#c4613a")}
            onMouseOut={e => (e.currentTarget.style.color = "rgba(26,26,46,0.4)")}
          >
            Sign out
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
          style={{ background: "#1a1a2e", color: "#faf8f4" }}
          onMouseOver={e => (e.currentTarget.style.background = "#c4613a")}
          onMouseOut={e => (e.currentTarget.style.background = "#1a1a2e")}
        >
          Sign in
        </button>
      )}
    </nav>
  );
}