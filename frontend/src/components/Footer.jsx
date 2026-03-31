import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import {
  getBusinessDetails,
  getLegalLinks,
  siteDetails,
} from '../content/siteDetails.js'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const { lang, t } = useLanguage()
  const legalLinks = getLegalLinks(lang)
  const businessDetails = getBusinessDetails(lang)
  const footerTitle = siteDetails.legal.footerTitle[lang] ?? siteDetails.legal.footerTitle.ru
  const supportNote = siteDetails.support.workingHours[lang] ?? siteDetails.support.workingHours.ru

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoGlyph}>✦</span>
              <span className={styles.logoText}>{siteDetails.brandName}</span>
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
              href={siteDetails.support.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              {siteDetails.support.telegramHandle}
            </a>
            {siteDetails.support.phone ? (
              <a href={`tel:${siteDetails.support.phone}`} className={styles.supportLink}>
                {siteDetails.support.phone}
              </a>
            ) : null}
            {siteDetails.support.email ? (
              <a href={`mailto:${siteDetails.support.email}`} className={styles.supportLink}>
                {siteDetails.support.email}
              </a>
            ) : null}
            <p className={styles.supportNote}>{supportNote}</p>
          </div>
        </div>

        <div className={styles.legalBar}>
          <nav className={styles.legalLinks} aria-label="Legal navigation">
            {legalLinks.map((link) => (
              <Link key={link.to} to={link.to} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.businessBlock}>
            <span className={styles.businessTitle}>{footerTitle}</span>
            {businessDetails.map((line) => (
              <p key={line} className={styles.businessLine}>
                {line}
              </p>
            ))}
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
