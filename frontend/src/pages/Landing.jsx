import { Link } from 'react-router-dom'
import GlowCard from '../components/GlowCard.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import styles from './Landing.module.css'

export default function Landing() {
  const { t } = useLanguage()

  const FEATURES = [
    { icon: '✦', title: t('landing.feature1.title'), desc: t('landing.feature1.desc') },
    { icon: '⚡', title: t('landing.feature2.title'), desc: t('landing.feature2.desc') },
    { icon: '🔔', title: t('landing.feature3.title'), desc: t('landing.feature3.desc') },
    { icon: '🛡', title: t('landing.feature4.title'), desc: t('landing.feature4.desc') },
  ]

  const STEPS = [
    { num: '01', title: t('landing.step1.title'), desc: t('landing.step1.desc') },
    { num: '02', title: t('landing.step2.title'), desc: t('landing.step2.desc') },
    { num: '03', title: t('landing.step3.title'), desc: t('landing.step3.desc') },
    { num: '04', title: t('landing.step4.title'), desc: t('landing.step4.desc') },
  ]

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
            <span>{t('landing.hero.badge')}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {t('landing.hero.title1')}<br />
            <span className={styles.heroAccent}>{t('landing.hero.title2')}</span>
          </h1>

          <p className={styles.heroSubtitle}>{t('landing.hero.subtitle')}</p>

          <div className={styles.heroCtas}>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
            >
              {t('landing.hero.cta')}
            </a>
            <Link to="/pricing" className={styles.secondaryBtn}>
              {t('landing.hero.ctaSecondary')}
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={styles.trustRow}>
            <span className={styles.trustItem}>
              <span className={styles.trustDot} />
              {t('landing.hero.trust1')}
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustDot} />
              {t('landing.hero.trust2')}
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustDot} />
              {t('landing.hero.trust3')}
            </span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>{t('landing.features.tag')}</span>
            <h2 className={styles.sectionTitle}>{t('landing.features.title')}</h2>
            <p className={styles.sectionSub}>{t('landing.features.subtitle')}</p>
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
            <span className={styles.sectionTag}>{t('landing.steps.tag')}</span>
            <h2 className={styles.sectionTitle}>{t('landing.steps.title')}</h2>
            <p className={styles.sectionSub}>{t('landing.steps.subtitle')}</p>
          </div>

          <div className={styles.stepsGrid}>
            {STEPS.map((step, idx) => (
              <div key={step.num} className={styles.step}>
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
            <h2 className={styles.ctaTitle}>{t('landing.cta.title')}</h2>
            <p className={styles.ctaDesc}>{t('landing.cta.desc')}</p>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
            >
              {t('landing.cta.btn')}
            </a>
          </GlowCard>
        </div>
      </section>
    </div>
  )
}
