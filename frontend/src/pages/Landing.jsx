import { Link } from 'react-router-dom'
import GlowCard from '../components/GlowCard.jsx'
import styles from './Landing.module.css'

/** Feature cards data */
const FEATURES = [
  {
    icon: '✦',
    title: 'Two Regions',
    desc: 'Support for Kazakhstan (₸) and Russia (₽) with local payment methods including Kaspi, card transfers, and SBP.',
  },
  {
    icon: '⚡',
    title: 'Flexible Plans',
    desc: 'Pay for 1 to 12 months upfront. Choose group plans or personal individual accounts.',
  },
  {
    icon: '🔔',
    title: 'Smart Reminders',
    desc: 'Automated daily reminders before your payment is due. Never lose access to Spotify.',
  },
  {
    icon: '🛡',
    title: 'Admin-Verified',
    desc: 'Every subscription request is manually reviewed and approved by our team.',
  },
]

/** How it works steps */
const STEPS = [
  {
    num: '01',
    title: 'Choose your plan',
    desc: 'Pick your region (Kazakhstan or Russia) and choose a plan type that fits your needs.',
  },
  {
    num: '02',
    title: 'Pay via your preferred method',
    desc: 'Kazakhstan: pay via Kaspi Bank. Russia: card transfer to VTB or SBP via phone number.',
  },
  {
    num: '03',
    title: 'Upload your receipt',
    desc: 'Send proof of payment directly to the Telegram bot. Our team reviews it promptly.',
  },
  {
    num: '04',
    title: 'Get instant access',
    desc: 'Once approved by an admin, you receive your Spotify Family slot immediately.',
  },
]

/**
 * Landing page — hero, features, and how-it-works sections.
 */
export default function Landing() {
  return (
    <div className={styles.page}>
      {/* Background gradient layer */}
      <div className={styles.bgGradient} aria-hidden="true" />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        {/* Animated glow orb */}
        <div className={styles.glowOrb} aria-hidden="true" />

        <div className={styles.heroContent}>
          <div className={styles.regionBadge}>
            <span>🇰🇿 Kazakhstan</span>
            <span className={styles.badgeDot}>·</span>
            <span>🇷🇺 Russia</span>
          </div>

          <h1 className={styles.heroTitle}>
            Premium Spotify<br />
            <span className={styles.heroAccent}>Family Plans</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Affordable shared subscriptions for Kazakhstan &amp; Russia.
            Managed via Telegram, verified by admins.
          </p>

          <div className={styles.heroCtas}>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
            >
              Get Started via Telegram
            </a>
            <Link to="/pricing" className={styles.secondaryBtn}>
              View Pricing
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={styles.trustRow}>
            <span className={styles.trustItem}>
              <span className={styles.trustDot} />
              Admin-verified
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustDot} />
              Instant setup
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustDot} />
              Local payments
            </span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Why choose us</span>
            <h2 className={styles.sectionTitle}>Everything you need</h2>
            <p className={styles.sectionSub}>
              A fully managed Spotify Family service built for the KZ and RU markets.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <GlowCard key={f.title} className={styles.featureCard}>
                <span className={styles.featureIcon}>{f.icon}</span>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.howItWorks}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Simple process</span>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionSub}>
              From choosing a plan to listening to your favourite music — four easy steps.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {STEPS.map((step, idx) => (
              <div key={step.num} className={styles.step}>
                {/* Connector line between steps */}
                {idx < STEPS.length - 1 && (
                  <div className={styles.stepConnector} aria-hidden="true" />
                )}
                <GlowCard className={styles.stepCard}>
                  <span className={styles.stepNum}>{step.num}</span>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </GlowCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.container}>
          <GlowCard highlighted className={styles.ctaCard}>
            <div className={styles.ctaGlow} aria-hidden="true" />
            <h2 className={styles.ctaTitle}>Ready to get started?</h2>
            <p className={styles.ctaDesc}>
              Join hundreds of subscribers already enjoying premium Spotify access.
            </p>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
            >
              Open Telegram Bot
            </a>
          </GlowCard>
        </div>
      </section>
    </div>
  )
}
