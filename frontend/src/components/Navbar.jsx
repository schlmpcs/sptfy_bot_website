import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

/**
 * Sticky top navigation bar with glassmorphism effect on scroll.
 * Includes responsive hamburger menu (CSS + minimal JS for toggle state).
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change / outside click
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoGlyph}>✦</span>
          <span className={styles.logoText}>Spotify Family</span>
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
            Home
          </NavLink>
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            Pricing
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            FAQ
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>

          {/* Mobile-only CTA inside nav */}
          <a
            href="https://t.me/sptfy_premium"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaBtn} ${styles.ctaMobile}`}
            onClick={closeMenu}
          >
            Open Bot
          </a>
        </nav>

        {/* Desktop CTA */}
        <a
          href="https://t.me/sptfy_premium"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          Open Bot
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
