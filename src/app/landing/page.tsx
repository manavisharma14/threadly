"use client";

import { signIn } from "next-auth/react";
import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <div className={styles.root}>


      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Now live — join the conversation
          </div>
          <h1>Where ideas<em>find their circle.</em></h1>
          <p>ThreadO is a thoughtful space for sharing ideas, building connections, and growing your network — one thread at a time.</p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => signIn()}>Start your thread →</button>
            <button className={styles.btnGhost} onClick={() => signIn()}>Explore feed</button>
          </div>
          <div className={styles.heroStats}>
            <div><div className={styles.statNum}>14k+</div><div className={styles.statLabel}>Active members</div></div>
            <div><div className={styles.statNum}>3.2k</div><div className={styles.statLabel}>Posts today</div></div>
            <div><div className={styles.statNum}>98%</div><div className={styles.statLabel}>Would recommend</div></div>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.floatingTag}>✦ trending now</div>
          <div className={styles.mockPost}>
            <div className={styles.mockUser}>
              <div className={`${styles.avatar} ${styles.av1}`}>JK</div>
              <div><div className={styles.mockName}>Jamie K.</div><div className={styles.mockTime}>2 min ago</div></div>
            </div>
            <div className={styles.mockText}>Just shipped my first open-source project. Months of late nights finally paid off. The community feedback has been incredible ✨</div>
            <div className={styles.mockActions}>
              <button className={styles.mockBtn}>♡ 48</button>
              <button className={styles.mockBtn}>↩ Reply</button>
              <button className={styles.mockBtn}>⌁ Share</button>
            </div>
          </div>
          <div className={`${styles.mockPost} ${styles.mockPostOffset}`}>
            <div className={styles.mockUser}>
              <div className={`${styles.avatar} ${styles.av2}`}>SR</div>
              <div><div className={styles.mockName}>Sofia R.</div><div className={styles.mockTime}>11 min ago</div></div>
            </div>
            <div className={styles.mockText}>Reminder that &ldquo;done&rdquo; is better than &ldquo;perfect.&rdquo; Ship the thing. Iterate later.</div>
            <div className={styles.mockActions}>
              <button className={styles.mockBtn}>♡ 112</button>
              <button className={styles.mockBtn}>↩ Reply</button>
              <button className={styles.mockBtn}>⌁ Share</button>
            </div>
          </div>
          <div className={styles.mockPost}>
            <div className={styles.mockUser}>
              <div className={`${styles.avatar} ${styles.av3}`}>MP</div>
              <div><div className={styles.mockName}>Marcus P.</div><div className={styles.mockTime}>25 min ago</div></div>
            </div>
            <div className={styles.mockText}>Hot take: the best communities are built around consistency, not size. Quality over quantity, always.</div>
            <div className={styles.mockActions}>
              <button className={styles.mockBtn}>♡ 76</button>
              <button className={styles.mockBtn}>↩ Reply</button>
              <button className={styles.mockBtn}>⌁ Share</button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
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

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.sectionLabel} style={{ marginTop: "5rem" }}>What people say</div>
        <h2>Threads worth reading.</h2>
        <div className={styles.testimonialsRow}>
          <div className={styles.testimonial}>
            <div className={styles.tq}>&ldquo;ThreadO feels like the early internet again — genuine, curious people sharing things they actually care about. I&rsquo;m on it every morning.&rdquo;</div>
            <div className={styles.ta}><div className={`${styles.avatar} ${styles.av1} ${styles.taAvatar}`}>AL</div>Anya L. &mdash; Product Designer</div>
          </div>
          <div className={`${styles.testimonial} ${styles.testimonialDark}`}>
            <div className={styles.tq}>&ldquo;I&rsquo;ve built more meaningful connections here in two months than on other platforms in two years.&rdquo;</div>
            <div className={`${styles.ta} ${styles.taDark}`}><div className={`${styles.taAvatar} ${styles.taAvatarDark}`}>CW</div>Chris W. &mdash; Software Engineer</div>
          </div>
          <div className={styles.testimonial}>
            <div className={styles.tq}>&ldquo;The writing experience is just... lovely. Distraction-free, beautiful, and my posts actually get read by people who care.&rdquo;</div>
            <div className={styles.ta}><div className={`${styles.avatar} ${styles.av3} ${styles.taAvatar}`}>NP</div>Nia P. &mdash; Writer</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaStrip}>
        <div className={styles.ctaInner}>
          <h2>Ready to find <em>your people?</em></h2>
          <button className={styles.btnCtaLight} onClick={() => signIn()}>Join ThreadO — it&rsquo;s free</button>
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