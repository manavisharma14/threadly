import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { signIn, signOut } from "next-auth/react"; // still works inside <form action>

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full flex justify-between p-6 bg-olive/20 text-floral shadow-md">
      <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      <div className="flex items-center gap-12">
        <Link href="/">Home</Link>

        {session ? (
          <div className="flex gap-4 items-center">
            <img
              src={session.user?.image || ""}
              alt="profile"
              className="w-8 h-8 rounded-full"
            />

            <Popover>
              <PopoverTrigger>
                <span>{session.user?.name}</span>
              </PopoverTrigger>
              <PopoverContent className="w-42 p-4 flex flex-col gap-2 border border-white/40 bg-olive/10">
                <Link href="/profile">Profile</Link>
                {/* ✅ Sign out handled as a server action */}
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <button type="submit">Sign Out</button>
                </form>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          // ✅ Sign in handled as a server action
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <button type="submit">Sign In</button>
          </form>
        )}
      </div>
    </nav>
  );
}