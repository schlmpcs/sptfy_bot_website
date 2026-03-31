import { useState } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useCart } from '../cart/CartContext.jsx'
import { siteDetails } from '../content/siteDetails.js'
import styles from './Pricing.module.css'

const TELEGRAM_URL = siteDetails.support.telegramUrl

const KZ_PLANS = [
  { months: 1, basePrice: 700, labelKey: 'pricing.plan.1month', badge: null },
  { months: 3, basePrice: 700, labelKey: 'pricing.plan.3months', badge: 'popular' },
  { months: 6, basePrice: 700, labelKey: 'pricing.plan.6months', badge: 'bestValue' },
]

const RU_GROUP_PLANS = [
  { months: 1, basePrice: 200, labelKey: 'pricing.plan.1month', badge: null },
  { months: 3, basePrice: 200, labelKey: 'pricing.plan.3months', badge: 'popular' },
  { months: 6, basePrice: 200, labelKey: 'pricing.plan.6months', badge: 'bestValue' },
  { months: 12, basePrice: 200, labelKey: 'pricing.plan.12months', badge: 'maxSavings' },
]

function PlanCard({ planId, label, price, currency, perMonth, features, badgeKey, highlighted = false, isInCart, onAdd, t }) {
  const badgeText = badgeKey ? t(`pricing.badge.${badgeKey}`) : null
  return (
    <GlowCard highlighted={highlighted} className={styles.planCard}>
      {badgeText && (
        <span className={`${styles.badge} ${highlighted ? styles.badgeHighlighted : ''}`}>
          {badgeText}
        </span>
      )}
      <div className={styles.planHeader}>
        <h3 className={styles.planLabel}>{label}</h3>
        <div className={styles.planPriceRow}>
          <span className={styles.planPrice}>{currency}{price}</span>
        </div>
        {perMonth !== null && (
          <p className={styles.planPerMonth}>
            {t('pricing.perMonth').replace('{currency}', currency).replace('{price}', perMonth)}
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

      <button
        onClick={onAdd}
        disabled={isInCart}
        className={`${styles.subscribeBtn} ${highlighted ? styles.subscribeBtnHighlighted : ''} ${isInCart ? styles.subscribeBtnInCart : ''}`}
      >
        {isInCart ? t('pricing.inCartBtn') : t('pricing.addToCartBtn')}
      </button>
    </GlowCard>
  )
}

function KZPlans({ t }) {
  const { plan, addToCart } = useCart()

  const features = [
    t('pricing.feature.kz1'),
    t('pricing.feature.kz2'),
    t('pricing.feature.kz3'),
    t('pricing.feature.kz4'),
    t('pricing.feature.kz5'),
  ]

  return (
    <div className={styles.plansGrid}>
      {KZ_PLANS.map((p) => {
        const total = p.basePrice * p.months
        const perMonth = p.months > 1 ? p.basePrice : null
        const planId = `kz_group_${p.months}m`
        const cartPlan = {
          id: planId,
          name: t(p.labelKey),
          region: 'KZ',
          plan_type: 'group',
          price: total,
          price_per_month: p.basePrice,
          currency: '₸',
          duration_months: p.months,
          features,
          highlighted: p.badge === 'popular',
        }
        return (
          <PlanCard
            key={p.months}
            planId={planId}
            label={t(p.labelKey)}
            price={total}
            currency="₸"
            perMonth={perMonth}
            features={features}
            badgeKey={p.badge}
            highlighted={p.badge === 'popular'}
            isInCart={plan?.id === planId}
            onAdd={() => addToCart(cartPlan)}
            t={t}
          />
        )
      })}
    </div>
  )
}

function RUPlans({ t }) {
  const [subTab, setSubTab] = useState('group')
  const { plan, addToCart } = useCart()

  const groupFeatures = [
    t('pricing.feature.rug1'),
    t('pricing.feature.rug2'),
    t('pricing.feature.rug3'),
    t('pricing.feature.rug4'),
    t('pricing.feature.rug5'),
  ]
  const indFeatures = [
    t('pricing.feature.ind1'),
    t('pricing.feature.ind2'),
    t('pricing.feature.ind3'),
    t('pricing.feature.ind4'),
    t('pricing.feature.ind5'),
  ]
  const duoFeatures = [
    t('pricing.feature.duo1'),
    t('pricing.feature.duo2'),
    t('pricing.feature.duo3'),
    t('pricing.feature.duo4'),
    t('pricing.feature.duo5'),
  ]

  return (
    <div>
      <div className={styles.subTabRow}>
        <button
          className={`${styles.subTab} ${subTab === 'group' ? styles.subTabActive : ''}`}
          onClick={() => setSubTab('group')}
        >
          {t('pricing.subtab.group')}
        </button>
        <button
          className={`${styles.subTab} ${subTab === 'individual' ? styles.subTabActive : ''}`}
          onClick={() => setSubTab('individual')}
        >
          {t('pricing.subtab.individual')}
        </button>
      </div>

      {subTab === 'group' && (
        <div className={styles.plansGrid}>
          {RU_GROUP_PLANS.map((p) => {
            const total = p.basePrice * p.months
            const perMonth = p.months > 1 ? p.basePrice : null
            const planId = `ru_group_${p.months}m`
            const cartPlan = {
              id: planId,
              name: t(p.labelKey),
              region: 'RU',
              plan_type: 'group',
              price: total,
              price_per_month: p.basePrice,
              currency: '₽',
              duration_months: p.months,
              features: groupFeatures,
              highlighted: p.badge === 'popular',
            }
            return (
              <PlanCard
                key={p.months}
                planId={planId}
                label={t(p.labelKey)}
                price={total}
                currency="₽"
                perMonth={perMonth}
                features={groupFeatures}
                badgeKey={p.badge}
                highlighted={p.badge === 'popular'}
                isInCart={plan?.id === planId}
                onAdd={() => addToCart(cartPlan)}
                t={t}
              />
            )
          })}
        </div>
      )}

      {subTab === 'individual' && (
        <div className={styles.plansGrid}>
          {(() => {
            const indId = 'ru_individual_1m'
            const duoId = 'ru_duo_1m'
            const indCartPlan = {
              id: indId,
              name: t('pricing.plan.individual'),
              region: 'RU',
              plan_type: 'individual',
              price: 250,
              price_per_month: 250,
              currency: '₽',
              duration_months: 1,
              features: indFeatures,
              highlighted: false,
            }
            const duoCartPlan = {
              id: duoId,
              name: t('pricing.plan.duo'),
              region: 'RU',
              plan_type: 'duo',
              price: 600,
              price_per_month: 300,
              currency: '₽',
              duration_months: 1,
              features: duoFeatures,
              highlighted: true,
            }
            return (
              <>
                <PlanCard
                  planId={indId}
                  label={t('pricing.plan.individual')}
                  price={250}
                  currency="₽"
                  perMonth={null}
                  features={indFeatures}
                  badgeKey="personal"
                  highlighted={false}
                  isInCart={plan?.id === indId}
                  onAdd={() => addToCart(indCartPlan)}
                  t={t}
                />
                <PlanCard
                  planId={duoId}
                  label={t('pricing.plan.duo')}
                  price={600}
                  currency="₽"
                  perMonth={300}
                  features={duoFeatures}
                  badgeKey="bestForTwo"
                  highlighted={true}
                  isInCart={plan?.id === duoId}
                  onAdd={() => addToCart(duoCartPlan)}
                  t={t}
                />
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}

export default function Pricing() {
  const [region, setRegion] = useState('KZ')
  const { t } = useLanguage()

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionTag}>{t('pricing.tag')}</span>
          <h1 className={styles.title}>{t('pricing.title')}</h1>
          <p className={styles.subtitle}>{t('pricing.subtitle')}</p>
        </div>

        {/* Region tab switcher */}
        <div className={styles.regionTabs} role="tablist" aria-label="Select region">
          <button
            role="tab"
            aria-selected={region === 'KZ'}
            className={`${styles.regionTab} ${region === 'KZ' ? styles.regionTabActive : ''}`}
            onClick={() => setRegion('KZ')}
          >
            {t('pricing.tab.kz')}
          </button>
          <button
            role="tab"
            aria-selected={region === 'RU'}
            className={`${styles.regionTab} ${region === 'RU' ? styles.regionTabActive : ''}`}
            onClick={() => setRegion('RU')}
          >
            {t('pricing.tab.ru')}
          </button>
        </div>

        {/* Plans */}
        <div className={styles.plansSection}>
          {region === 'KZ' ? <KZPlans t={t} /> : <RUPlans t={t} />}
        </div>

        {/* Footer note */}
        <GlowCard className={styles.noteCard}>
          <div className={styles.noteInner}>
            <span className={styles.noteIcon}>ℹ</span>
            <p className={styles.noteText}>
              {t('pricing.note')
                .split('{link}')[0]}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.noteLink}
              >
                {t('pricing.noteLink')}
              </a>
              {t('pricing.note')
                .split('{link}')[1]
                ?.split('{faqLink}')[0]}
              <a href="/faq" className={styles.noteLink}>
                {t('pricing.noteFaq')}
              </a>
              {t('pricing.note')
                .split('{faqLink}')[1]}
            </p>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
