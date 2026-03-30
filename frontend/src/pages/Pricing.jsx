import { useState } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import styles from './Pricing.module.css'

const TELEGRAM_URL = 'https://t.me/sptfy_premium'

/* ── Features ── */
const KZ_FEATURES = [
  'Spotify Family slot',
  'Pay via Kaspi Bank',
  'Admin-verified setup',
  'Payment reminders',
  'Cancel anytime',
]

const RU_GROUP_FEATURES = [
  'Spotify Family slot',
  'Pay via Card or SBP',
  'Admin-verified setup',
  'Payment reminders',
  'Cancel anytime',
]

const RU_INDIVIDUAL_FEATURES = [
  'Personal Spotify account',
  'No sharing',
  'Monthly auto-reminders',
  'Flexible payment day',
  'Card or SBP payment',
]

const RU_DUO_FEATURES = [
  'Two-person account',
  'Share with one person',
  'Monthly auto-reminders',
  'Flexible payment day',
  'Card or SBP payment',
]

/* ── Plan definitions ── */
const KZ_PLANS = [
  { months: 1, basePrice: 700, label: '1 Month', badge: null },
  { months: 3, basePrice: 700, label: '3 Months', badge: 'Popular' },
  { months: 6, basePrice: 700, label: '6 Months', badge: 'Best Value' },
]

const RU_GROUP_PLANS = [
  { months: 1, basePrice: 200, label: '1 Month', badge: null },
  { months: 3, basePrice: 200, label: '3 Months', badge: 'Popular' },
  { months: 6, basePrice: 200, label: '6 Months', badge: 'Best Value' },
  { months: 12, basePrice: 200, label: '12 Months', badge: 'Max Savings' },
]

/**
 * A single plan card.
 * @param {object} props
 */
function PlanCard({
  label,
  price,
  currency,
  perMonth,
  features,
  badge,
  highlighted = false,
}) {
  return (
    <GlowCard highlighted={highlighted} className={styles.planCard}>
      {badge && (
        <span
          className={`${styles.badge} ${highlighted ? styles.badgeHighlighted : ''}`}
        >
          {badge}
        </span>
      )}
      <div className={styles.planHeader}>
        <h3 className={styles.planLabel}>{label}</h3>
        <div className={styles.planPriceRow}>
          <span className={styles.planPrice}>
            {currency}{price}
          </span>
        </div>
        {perMonth !== null && (
          <p className={styles.planPerMonth}>
            {currency}{perMonth} / month
          </p>
        )}
      </div>

      <ul className={styles.featureList}>
        {features.map((f) => (
          <li key={f} className={styles.featureItem}>
            <span className={styles.featureCheck}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.subscribeBtn} ${highlighted ? styles.subscribeBtnHighlighted : ''}`}
      >
        Subscribe via Telegram
      </a>
    </GlowCard>
  )
}

/** Kazakhstan plans tab */
function KZPlans() {
  return (
    <div className={styles.plansGrid}>
      {KZ_PLANS.map((plan) => {
        const total = plan.basePrice * plan.months
        const perMonth = plan.months > 1 ? plan.basePrice : null
        return (
          <PlanCard
            key={plan.months}
            label={plan.label}
            price={total}
            currency="₸"
            perMonth={perMonth}
            features={KZ_FEATURES}
            badge={plan.badge}
            highlighted={plan.badge === 'Popular'}
          />
        )
      })}
    </div>
  )
}

/** Russia plans tab — with sub-tabs for Group / Individual & Duo */
function RUPlans() {
  const [subTab, setSubTab] = useState('group')

  return (
    <div>
      <div className={styles.subTabRow}>
        <button
          className={`${styles.subTab} ${subTab === 'group' ? styles.subTabActive : ''}`}
          onClick={() => setSubTab('group')}
        >
          Group
        </button>
        <button
          className={`${styles.subTab} ${subTab === 'individual' ? styles.subTabActive : ''}`}
          onClick={() => setSubTab('individual')}
        >
          Individual / Duo
        </button>
      </div>

      {subTab === 'group' && (
        <div className={styles.plansGrid}>
          {RU_GROUP_PLANS.map((plan) => {
            const total = plan.basePrice * plan.months
            const perMonth = plan.months > 1 ? plan.basePrice : null
            return (
              <PlanCard
                key={plan.months}
                label={plan.label}
                price={total}
                currency="₽"
                perMonth={perMonth}
                features={RU_GROUP_FEATURES}
                badge={plan.badge}
                highlighted={plan.badge === 'Popular'}
              />
            )
          })}
        </div>
      )}

      {subTab === 'individual' && (
        <div className={styles.plansGrid}>
          <PlanCard
            label="Individual"
            price={250}
            currency="₽"
            perMonth={null}
            features={RU_INDIVIDUAL_FEATURES}
            badge="Personal"
            highlighted={false}
          />
          <PlanCard
            label="Duo"
            price={600}
            currency="₽"
            perMonth={300}
            features={RU_DUO_FEATURES}
            badge="Best for Two"
            highlighted={true}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Pricing page — region tab switcher with plan cards.
 */
export default function Pricing() {
  const [region, setRegion] = useState('KZ')

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionTag}>Transparent pricing</span>
          <h1 className={styles.title}>Simple, affordable plans</h1>
          <p className={styles.subtitle}>
            Choose your region and the plan that works best for you.
            All plans include admin-verified setup and automated reminders.
          </p>
        </div>

        {/* Region tab switcher */}
        <div className={styles.regionTabs} role="tablist" aria-label="Select region">
          <button
            role="tab"
            aria-selected={region === 'KZ'}
            className={`${styles.regionTab} ${region === 'KZ' ? styles.regionTabActive : ''}`}
            onClick={() => setRegion('KZ')}
          >
            🇰🇿 Kazakhstan
          </button>
          <button
            role="tab"
            aria-selected={region === 'RU'}
            className={`${styles.regionTab} ${region === 'RU' ? styles.regionTabActive : ''}`}
            onClick={() => setRegion('RU')}
          >
            🇷🇺 Russia
          </button>
        </div>

        {/* Plans */}
        <div className={styles.plansSection}>
          {region === 'KZ' ? <KZPlans /> : <RUPlans />}
        </div>

        {/* Footer note */}
        <GlowCard className={styles.noteCard}>
          <div className={styles.noteInner}>
            <span className={styles.noteIcon}>ℹ</span>
            <p className={styles.noteText}>
              All subscriptions are managed via our Telegram bot{' '}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.noteLink}
              >
                @sptfy_premium
              </a>
              . Payment is made directly to your bank — we never store card details.
              Have questions? Check the{' '}
              <a href="/faq" className={styles.noteLink}>FAQ page</a>.
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
