import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLanguage()

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
            <p className={styles.tagline}>{t('footer.tagline')}</p>
          </div>

          {/* Navigation */}
          <nav className={styles.nav} aria-label="Footer navigation">
            <span className={styles.navLabel}>{t('footer.navLabel')}</span>
            <Link to="/" className={styles.navLink}>{t('nav.home')}</Link>
            <Link to="/pricing" className={styles.navLink}>{t('nav.pricing')}</Link>
            <Link to="/faq" className={styles.navLink}>{t('nav.faq')}</Link>
            <Link to="/dashboard" className={styles.navLink}>{t('nav.dashboard')}</Link>
          </nav>

          {/* Support */}
          <div className={styles.support}>
            <span className={styles.navLabel}>{t('footer.supportLabel')}</span>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              {t('footer.supportLink')}
            </a>
            <p className={styles.supportNote}>{t('footer.supportNote')}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {t('footer.copyright').replace('{year}', year)}
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
