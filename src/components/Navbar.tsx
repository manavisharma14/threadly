import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthButtons } from "@/components/AuthButtons";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full bg-olive/20 text-floral shadow-md">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <div className="flex items-center gap-12">
          <Link href="/" className="hover:underline">Home</Link>
          <AuthButtons session={session} />
        </div>
      </div>
    </nav>
  );
}