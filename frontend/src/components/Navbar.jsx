import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { siteDetails } from '../content/siteDetails.js'
import styles from './Navbar.module.css'

const LANG_OPTIONS = [
  { code: 'ru', label: 'RU' },
  { code: 'kz', label: 'KZ' },
  { code: 'en', label: 'EN' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, setLang } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoGlyph}>✦</span>
          <span className={styles.logoText}>{siteDetails.brandName}</span>
        </Link>

        {/* Desktop nav links */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.pricing')}
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.faq')}
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            {t('nav.dashboard')}
          </NavLink>

          {/* Mobile-only CTA inside nav */}
          <a
            href={siteDetails.support.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaBtn} ${styles.ctaMobile}`}
            onClick={closeMenu}
          >
            {t('nav.openBot')}
          </a>
        </nav>

        {/* Language switcher */}
        <div className={styles.langSwitcher} aria-label="Language switcher">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              className={`${styles.langBtn} ${lang === opt.code ? styles.langBtnActive : ''}`}
              onClick={() => setLang(opt.code)}
              aria-pressed={lang === opt.code}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <a
          href={siteDetails.support.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          {t('nav.openBot')}
        </a>

        {/* Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile backdrop */}
      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </header>
  )
}
