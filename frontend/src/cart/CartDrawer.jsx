import { useState } from 'react'
import { useCart } from './CartContext.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { plan, clearCart, isOpen, setIsOpen } = useCart()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function close() {
    setIsOpen(false)
    setError(null)
  }

  async function handleCheckout() {
    if (!plan) return
    setLoading(true)
    setError(null)
    const newTab = window.open('', '_blank', 'noopener,noreferrer')
    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          region: plan.region,
          plan_type: plan.plan_type,
          months: plan.duration_months,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        newTab?.close()
        throw new Error(data.detail || `Server error ${res.status}`)
      }
      const data = await res.json()
      if (newTab) {
        newTab.location.href = data.telegram_bot_url
      } else {
        window.open(data.telegram_bot_url, '_blank', 'noopener,noreferrer')
      }
      clearCart()
      setIsOpen(false)
    } catch (err) {
      newTab?.close()
      setError(err.message || t('cart.error'))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      <div
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
        onKeyDown={(e) => e.key === 'Escape' && close()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{t('cart.title')}</h2>
          <button className={styles.closeBtn} onClick={close} aria-label={t('cart.close')} autoFocus>✕</button>
        </div>

        <div className={styles.body}>
          {plan ? (
            <>
              <div className={styles.planSummary}>
                <p className={styles.planName}>{plan.name}</p>
                <p className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.currency}{plan.price}</span>
                  {plan.duration_months > 1 && (
                    <span className={styles.pricePerMonth}>
                      {' '}{t('cart.perMonth').replace('{currency}', plan.currency).replace('{price}', plan.price_per_month)}
                    </span>
                  )}
                </p>
                <ul className={styles.featureList}>
                  {(plan.features ?? []).map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.check}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>

              {error && <p className={styles.errorMsg} role="alert">{error}</p>}

              <div className={styles.actions}>
                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? t('cart.checkoutLoading') : t('cart.checkout')}
                </button>
                <button
                  className={styles.removeBtn}
                  onClick={() => { clearCart(); close() }}
                  disabled={loading}
                >
                  {t('cart.remove')}
                </button>
              </div>
            </>
          ) : (
            <p className={styles.emptyMsg}>{t('cart.empty')}</p>
          )}
        </div>
      </div>
    </>
  )
}
