"use client";
import { User } from "@/types";

interface ProfileProps {
  user: User | null;
}

export default function Profile({ user }: ProfileProps) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  return (
    <div className="w-full">
      {user ? (
        <div className="flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="relative mb-3">
            {user.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
                style={{
                  border: "3px solid #faf8f4",
                  boxShadow: "0 0 0 2px #c4613a, 0 4px 12px rgba(196,97,58,0.2)",
                }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-serif text-lg font-bold"
                style={{
                  background: "linear-gradient(135deg, #f0d5c8, #c4613a22)",
                  color: "#c4613a",
                  border: "3px solid #faf8f4",
                  boxShadow: "0 0 0 2px #c4613a, 0 4px 12px rgba(196,97,58,0.2)",
                }}
              >
                {initials}
              </div>
            )}
            {/* Online dot */}
            <span
              className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full"
              style={{
                background: "#4a7c59",
                border: "2px solid #faf8f4",
                boxShadow: "0 0 0 1px #4a7c5940",
              }}
            />
          </div>

          {/* Name & email */}
          <p className="text-[0.95rem] font-semibold text-ink leading-tight">{user.name}</p>
          <p
            className="text-[0.72rem] mt-0.5 px-3 py-0.5 rounded-full"
            style={{ color: "#c4613a", background: "#f0d5c8" }}
          >
            {user.email}
          </p>

          {/* Stats */}
          <div
            className="w-full mt-4 pt-4 grid grid-cols-3"
            style={{ borderTop: "1px solid rgba(26,26,46,0.08)" }}
          >
            {[
              { num: "0", label: "Posts" },
              { num: "0", label: "Following" },
              { num: "0", label: "Followers" },
            ].map(({ num, label }, i) => (
              <div
                key={label}
                className="text-center"
                style={{
                  borderRight: i < 2 ? "1px solid rgba(26,26,46,0.08)" : "none",
                }}
              >
                <div
                  className="font-serif font-bold leading-none"
                  style={{ fontSize: "1.15rem", color: "#1a1a2e" }}
                >
                  {num}
                </div>
                <div
                  className="uppercase tracking-wider mt-0.5"
                  style={{ fontSize: "0.6rem", color: "rgba(26,26,46,0.4)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="text-center py-6">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-xl"
            style={{ background: "#f5f0e8", color: "rgba(26,26,46,0.25)" }}
          >
            ◎
          </div>
          <p className="text-sm" style={{ color: "rgba(26,26,46,0.4)" }}>
            Not signed in
          </p>
        </div>
      )}
    </div>
  );
}