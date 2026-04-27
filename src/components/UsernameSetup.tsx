"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UsernameSetup() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const err = await res.json().catch(() => ({}));
      setError(err.message ?? "That username isn't available.");
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#faf8f4" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ background: "#ffffff", border: "1px solid rgba(26,26,46,0.10)", boxShadow: "0 8px 40px rgba(26,26,46,0.08)" }}
      >
        {/* Logo */}
        <div className="font-serif text-2xl font-bold mb-2" style={{ color: "#1a1a2e" }}>
          Thread<em className="italic" style={{ color: "#c4613a" }}>O</em>
        </div>

        <h2 className="font-serif text-xl font-bold mt-4 mb-1" style={{ color: "#1a1a2e" }}>
          One last thing.
        </h2>
        <p className="text-sm mb-6" style={{ color: "rgba(26,26,46,0.5)" }}>
          Pick a username — this is how others will find you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-left">
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{ border: "1.5px solid #ede6d6", background: "#f5f0e8" }}
          >
            <span className="pl-4 text-sm" style={{ color: "rgba(26,26,46,0.35)" }}>@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="yourname"
              required
              className="flex-1 px-2 py-3 text-sm bg-transparent focus:outline-none"
              style={{ color: "#1a1a2e" }}
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#c4613a" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || username.length < 2}
            className="w-full py-2.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: loading || username.length < 2 ? "rgba(26,26,46,0.2)" : "#1a1a2e",
              color: "#faf8f4",
              cursor: loading || username.length < 2 ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Saving..." : "Let's go →"}
          </button>
        </form>
      </div>
    </div>
  );
}