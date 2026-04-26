import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthButtons } from "@/components/AuthButtons";
import styles from "./Navbar.module.css";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className={styles.nav}>
      {/* Left */}
      <Link href="/" className={styles.brand}>
        
        <div className={styles.logo}>
          Thread<em>O</em>
        </div>
      </Link>

      {/* Right */}
      <div className={styles.navLinks}>
        <Link href="/home" className={styles.link}>
          Feed
        </Link>

        <AuthButtons session={session} />
      </div>
    </nav>
  );
}