import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthButtons } from "@/components/AuthButtons";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="w-full flex justify-between p-6 bg-olive/20 text-floral shadow-md">
      <img src="/logo.png" alt="Logo" className="w-10 h-10" />
      <div className="flex items-center gap-12">
        <Link href="/">Home</Link>
        <AuthButtons session={session} />
      </div>
    </nav>
  );
}