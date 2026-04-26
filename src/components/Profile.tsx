"use client";
import { User } from "@/types";

interface ProfileProps {
  user: User | null;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className="w-full">
      {user ? (
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.image || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
              style={{ border: "2.5px solid #c4613a" }}
            />
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-sand"
              style={{ background: "#4a7c59" }}
            />
          </div>

          {/* Name */}
          <div>
            <p className="text-[0.95rem] font-semibold text-ink leading-tight">{user.name}</p>
            <p className="text-[0.75rem] text-ink/40 mt-0.5">{user.email}</p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-ink/10 pt-3">
            <div className="flex justify-around">
              {[
                { num: "0", label: "Posts" },
                { num: "0", label: "Following" },
                { num: "0", label: "Followers" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="font-serif text-[1.1rem] font-bold text-ink">{num}</div>
                  <div className="text-[0.65rem] text-ink/40 tracking-wide uppercase">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-sand mx-auto mb-3 flex items-center justify-center text-ink/30 text-xl">
            ◎
          </div>
          <p className="text-sm text-ink/40">Not signed in</p>
        </div>
      )}
    </div>
  );
}