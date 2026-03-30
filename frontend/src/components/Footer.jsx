import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

/**
 * Site-wide footer with logo, nav links, support contact, and copyright.
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoGlyph}>✦</span>
              <span className={styles.logoText}>Spotify Family</span>
            </Link>
            <p className={styles.tagline}>
              Premium Spotify subscriptions for KZ &amp; RU
            </p>
          </div>

          {/* Navigation */}
          <nav className={styles.nav} aria-label="Footer navigation">
            <span className={styles.navLabel}>Navigation</span>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/pricing" className={styles.navLink}>Pricing</Link>
            <Link to="/faq" className={styles.navLink}>FAQ</Link>
            <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>
          </nav>

          {/* Support */}
          <div className={styles.support}>
            <span className={styles.navLabel}>Support</span>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              Contact Support @sptfy_premium
            </a>
            <p className={styles.supportNote}>
              We typically respond within a few hours via Telegram.
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {year} Spotify Family Service. Not affiliated with Spotify AB.
          </p>
          <div className={styles.regions}>
            <span>🇰🇿 Kazakhstan</span>
            <span className={styles.dot}>·</span>
            <span>🇷🇺 Russia</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
