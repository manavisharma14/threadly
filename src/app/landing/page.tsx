"use client";
import { signIn } from "next-auth/react";
import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <div className={styles.root}>

      {/* NAV
      <nav className={styles.nav}>
        <div className={styles.logo}>Thread<em>O</em></div>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#belief">Our belief</a>
          <a
            href="#"
            className={styles.navCta}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => { e.preventDefault(); signIn(); }}>
            Sign in
          </a>
        </div>
      </nav> */}

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Early access — be one of the first
          </div>
          <h1>Where ideas<em>find their circle.</em></h1>
          <p>
            ThreadO is a thoughtful space for sharing ideas, building
            connections, and growing your network — one thread at a time.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => signIn()}>
              Get started — it&rsquo;s free →
            </button>
            <button className={styles.btnGhost} onClick={() => signIn()}>
              Sign in
            </button>
          </div>
          <div className={styles.heroStats}>
            <div>
              <div className={styles.statNum}>Free</div>
              <div className={styles.statLabel}>Always to join</div>
            </div>
            <div>
              <div className={styles.statNum}>No ads</div>
              <div className={styles.statLabel}>Ever. Period.</div>
            </div>
            <div>
              <div className={styles.statNum}>Open</div>
              <div className={styles.statLabel}>To everyone</div>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className={styles.heroVisual}>
          <div className={styles.floatingTag}>✦ your space to think</div>

          <div className={styles.mockPost} style={{ borderLeft: "3px solid #c4613a" }}>
            <div className={styles.mockUser}>
              <div
                className={styles.avatar}
                style={{ background: "linear-gradient(135deg,#f0d5c8,#c4613a22)", color: "#c4613a", fontWeight: 600 }}
              >
                You
              </div>
              <div>
                <div className={styles.mockName}>Your name here</div>
                <div className={styles.mockTime}>Share something on your mind</div>
              </div>
            </div>
            <div className={styles.mockText} style={{ color: "rgba(26,26,46,0.4)", fontStyle: "italic" }}>
              What are you thinking about today?
            </div>
            <div className={styles.mockActions}>
              <button
                className={styles.mockBtn}
                style={{ background: "#1a1a2e", color: "#faf8f4" }}
                onClick={() => signIn()}
              >
                Post thread →
              </button>
            </div>
          </div>

          {[
            { icon: "◎", text: "Follow people you actually care about" },
            { icon: "♡", text: "Like and reply to spark conversations" },
            { icon: "⌁", text: "Repost ideas worth spreading" },
            { icon: "◐", text: "Build your profile and grow your circle" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                background: "#ffffff", border: "1px solid rgba(26,26,46,0.08)",
                borderRadius: "12px", padding: "0.7rem 1rem",
                fontSize: "0.82rem", color: "#4a4a6a",
              }}
            >
              <span style={{ color: "#c4613a", fontSize: "1rem", flexShrink: 0 }}>{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionLabel}>Why ThreadO</div>
        <h2>Built for real conversations.</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.fi1}`}>◎</div>
            <div className={styles.featureTitle}>Your feed, your circle</div>
            <div className={styles.featureDesc}>See posts from people you follow, not an algorithm. ThreadO keeps your feed personal, relevant, and human.</div>
          </div>
          <div className={`${styles.featureCard} ${styles.featureCardDark}`}>
            <div className={`${styles.featureIcon} ${styles.fi2}`}>⟡</div>
            <div className={styles.featureTitle}>Genuine connections</div>
            <div className={styles.featureDesc}>Grow a network that actually matters. Discover people who share your passions and spark real dialogue.</div>
          </div>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.fi3}`}>⊹</div>
            <div className={styles.featureTitle}>Clean, focused writing</div>
            <div className={styles.featureDesc}>No noise. No distractions. Just a beautiful editor that lets your ideas take center stage.</div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="belief" className={styles.testimonials}>
        <div className={styles.sectionLabel} style={{ marginTop: "5rem" }}>Our belief</div>
        <h2>The internet needs more signal.</h2>
        <div className={styles.testimonialsRow}>
          <div className={styles.testimonial}>
            <div className={styles.tq}>&ldquo;Social media should feel like a conversation at a good dinner table — thoughtful, energizing, and worth your time.&rdquo;</div>
            <div className={styles.ta}>
              <div className={`${styles.avatar} ${styles.av1} ${styles.taAvatar}`}>T</div>
              The ThreadO team
            </div>
          </div>
          <div className={`${styles.testimonial} ${styles.testimonialDark}`}>
            <div className={styles.tq}>&ldquo;We&rsquo;re building ThreadO because we wanted a place to share ideas without the noise. We think you deserve that too.&rdquo;</div>
            <div className={`${styles.ta} ${styles.taDark}`}>
              <div className={`${styles.taAvatar} ${styles.taAvatarDark}`}>T</div>
              The ThreadO team
            </div>
          </div>
          <div className={styles.testimonial}>
            <div className={styles.tq}>&ldquo;No ads. No algorithm pushing outrage. Just people sharing things they actually care about — and finding others who do too.&rdquo;</div>
            <div className={styles.ta}>
              <div className={`${styles.avatar} ${styles.av3} ${styles.taAvatar}`}>T</div>
              The ThreadO team
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaStrip}>
        <div className={styles.ctaInner}>
          <h2>Be part of something <em>from day one.</em></h2>
          <button className={styles.btnCtaLight} onClick={() => signIn()}>
            Join ThreadO — it&rsquo;s free
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.logo}>Thread<em>O</em></div>
        <p>© 2025 ThreadO. Share thoughts. Build your circle.</p>
      </footer>
    </div>
  );
}