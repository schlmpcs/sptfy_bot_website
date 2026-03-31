import { useState } from 'react'
import { useCart } from './CartContext.jsx'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
  const { plan, clearCart, isOpen, setIsOpen } = useCart()
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
        throw new Error(data.detail || `Server error ${res.status}`)
      }
      const data = await res.json()
      window.open(data.telegram_bot_url, '_blank', 'noopener,noreferrer')
      clearCart()
      setIsOpen(false)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      {/* Drawer panel */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Cart">
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Cart</h2>
          <button className={styles.closeBtn} onClick={close} aria-label="Close cart">✕</button>
        </div>

        {/* Content */}
        <div className={styles.body}>
          {plan ? (
            <>
              <div className={styles.planSummary}>
                <p className={styles.planName}>{plan.name}</p>
                <p className={styles.planPrice}>
                  <span className={styles.priceAmount}>{plan.currency}{plan.price}</span>
                  {plan.duration_months > 1 && (
                    <span className={styles.pricePerMonth}>
                      {' '}· {plan.currency}{plan.price_per_month}/mo
                    </span>
                  )}
                </p>
                <ul className={styles.featureList}>
                  {plan.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.check}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.actions}>
                <button
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Opening…' : 'Checkout'}
                </button>
                <button
                  className={styles.removeBtn}
                  onClick={() => { clearCart(); setError(null) }}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <p className={styles.emptyMsg}>Your cart is empty.</p>
          )}
        </div>
      </div>
    </>
  )
}
