import { useState, useRef } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import PlanBadge from '../components/PlanBadge.jsx'
import styles from './Dashboard.module.css'

const API_BASE = '/api'

/**
 * Returns color class for days-until-due urgency.
 * @param {number} days
 * @returns {"green"|"yellow"|"red"}
 */
function urgencyClass(days) {
  if (days > 7) return styles.urgencyGreen
  if (days >= 3) return styles.urgencyYellow
  return styles.urgencyRed
}

/**
 * Compute days between now and a target date string.
 * @param {string} dateStr  ISO date string e.g. "2025-04-15"
 * @returns {number}
 */
function daysUntil(dateStr) {
  if (!dateStr) return 0
  const now = new Date()
  const target = new Date(dateStr)
  const diff = target - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Format date string to localised display.
 * @param {string} dateStr
 */
function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

/** Loading spinner */
function Spinner() {
  return (
    <div className={styles.spinnerWrapper} aria-label="Loading">
      <div className={styles.spinner} />
      <p className={styles.spinnerText}>Checking subscription status...</p>
    </div>
  )
}

/** Error display */
function ErrorCard({ message }) {
  return (
    <GlowCard className={styles.errorCard}>
      <span className={styles.errorIcon}>✕</span>
      <div>
        <h3 className={styles.errorTitle}>Something went wrong</h3>
        <p className={styles.errorMsg}>{message}</p>
      </div>
    </GlowCard>
  )
}

/** Empty subscriptions state */
function EmptyState() {
  return (
    <GlowCard className={styles.emptyCard}>
      <span className={styles.emptyIcon}>🎵</span>
      <h3 className={styles.emptyTitle}>No active subscriptions found</h3>
      <p className={styles.emptyDesc}>
        It looks like this Telegram account doesn't have an active subscription yet.
      </p>
      <a
        href="https://t.me/sptfy_premium"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.emptyBtn}
      >
        Subscribe via Telegram
      </a>
    </GlowCard>
  )
}

/**
 * Group subscription card.
 * @param {object} props
 * @param {object} props.group  — group data from API
 */
function GroupCard({ group }) {
  const days = daysUntil(group.next_payment_date)
  const urgency = urgencyClass(days)

  return (
    <GlowCard className={styles.subCard}>
      <div className={styles.subCardHeader}>
        <div>
          <h3 className={styles.subCardTitle}>{group.group_name || 'Family Group'}</h3>
          {group.region && (
            <PlanBadge region={group.region.toUpperCase()} type="group" />
          )}
        </div>
        <span className={`${styles.statusBadge} ${styles.statusActive}`}>Active</span>
      </div>

      <div className={styles.subDetails}>
        {group.next_payment_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Next payment</span>
            <span className={styles.detailValue}>{formatDate(group.next_payment_date)}</span>
          </div>
        )}
        {group.next_payment_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Days remaining</span>
            <span className={`${styles.detailValue} ${urgency}`}>
              {days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : 'Due today / overdue'}
            </span>
          </div>
        )}
        {group.slots !== undefined && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Slots used</span>
            <span className={styles.detailValue}>{group.slots}</span>
          </div>
        )}
        {group.price && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Monthly price</span>
            <span className={styles.detailValue}>{group.price}</span>
          </div>
        )}
      </div>

      {days <= 3 && days >= 0 && (
        <div className={styles.reminderBanner}>
          ⚠ Payment is due soon. Please renew via Telegram bot.
        </div>
      )}
      {days < 0 && (
        <div className={`${styles.reminderBanner} ${styles.reminderOverdue}`}>
          ✕ Payment overdue. Contact @sptfy_premium immediately.
        </div>
      )}
    </GlowCard>
  )
}

/**
 * Individual / duo client card.
 * @param {object} props
 * @param {object} props.client  — individual_client data from API
 */
function IndividualCard({ client }) {
  const days = daysUntil(client.next_due_date)
  const urgency = urgencyClass(days)
  const planType = client.plan_type?.toLowerCase() === 'duo' ? 'duo' : 'individual'

  return (
    <GlowCard className={styles.subCard}>
      <div className={styles.subCardHeader}>
        <div>
          <h3 className={styles.subCardTitle}>
            {planType === 'duo' ? 'Duo Plan' : 'Individual Plan'}
          </h3>
          {client.region && (
            <PlanBadge region={client.region.toUpperCase()} type={planType} />
          )}
        </div>
        <span
          className={`${styles.statusBadge} ${
            client.status === 'active' ? styles.statusActive : styles.statusInactive
          }`}
        >
          {client.status ?? 'Active'}
        </span>
      </div>

      <div className={styles.subDetails}>
        {client.price && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Price</span>
            <span className={styles.detailValue}>{client.price}</span>
          </div>
        )}
        {client.payment_day && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Payment day</span>
            <span className={styles.detailValue}>Day {client.payment_day} of each month</span>
          </div>
        )}
        {client.next_due_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Next due</span>
            <span className={styles.detailValue}>{formatDate(client.next_due_date)}</span>
          </div>
        )}
        {client.next_due_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Days remaining</span>
            <span className={`${styles.detailValue} ${urgency}`}>
              {days > 0 ? `${days} day${days !== 1 ? 's' : ''}` : 'Due today / overdue'}
            </span>
          </div>
        )}
      </div>

      {days <= 3 && days >= 0 && (
        <div className={styles.reminderBanner}>
          ⚠ Payment is due soon. Please renew via Telegram bot.
        </div>
      )}
      {days < 0 && (
        <div className={`${styles.reminderBanner} ${styles.reminderOverdue}`}>
          ✕ Payment overdue. Contact @sptfy_premium immediately.
        </div>
      )}
    </GlowCard>
  )
}

/**
 * User profile card.
 * @param {object} props
 * @param {object} props.user  — user data from API
 */
function UserCard({ user }) {
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    `User #${user.telegram_id}`

  return (
    <GlowCard highlighted className={styles.userCard}>
      <div className={styles.userAvatar}>
        {displayName.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userInfo}>
        <h2 className={styles.userName}>{displayName}</h2>
        {user.username && (
          <p className={styles.userHandle}>@{user.username}</p>
        )}
        {user.telegram_id && (
          <p className={styles.userId}>ID: {user.telegram_id}</p>
        )}
      </div>
      <span className={styles.memberBadge}>Active Member</span>
    </GlowCard>
  )
}

/**
 * Dashboard page — subscription lookup by Telegram user ID.
 */
export default function Dashboard() {
  const [userId, setUserId] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [data, setData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)

  /**
   * Fetch user data from the FastAPI backend.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = userId.trim()
    if (!trimmed) {
      inputRef.current?.focus()
      return
    }

    setStatus('loading')
    setData(null)
    setErrorMsg('')

    try {
      const res = await fetch(`${API_BASE}/user/${encodeURIComponent(trimmed)}`)

      if (res.status === 404) {
        setStatus('success')
        setData({ user: null, groups: [], individual_clients: [] })
        return
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail ?? `Server responded with ${res.status}`)
      }

      const json = await res.json()
      setData(json)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect to the server. Please try again.')
      setStatus('error')
    }
  }

  const hasSubscriptions =
    data &&
    ((data.groups && data.groups.length > 0) ||
      (data.individual_clients && data.individual_clients.length > 0))

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionTag}>Member portal</span>
          <h1 className={styles.title}>Check Your Subscription</h1>
          <p className={styles.subtitle}>
            Enter your Telegram User ID to view your current subscription status,
            upcoming payments, and plan details.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your Telegram User ID (e.g. 123456789)"
              className={styles.input}
              aria-label="Telegram User ID"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        <p className={styles.inputHint}>
          Find your Telegram ID by messaging{' '}
          <a
            href="https://t.me/userinfobot"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hintLink}
          >
            @userinfobot
          </a>{' '}
          on Telegram.
        </p>

        {/* States */}
        <div className={styles.resultArea}>
          {status === 'loading' && <Spinner />}

          {status === 'error' && <ErrorCard message={errorMsg} />}

          {status === 'success' && data && (
            <>
              {/* User card */}
              {data.user && <UserCard user={data.user} />}

              {/* Subscriptions */}
              {hasSubscriptions ? (
                <div className={styles.subscriptionsSection}>
                  <h2 className={styles.subsTitle}>Your Subscriptions</h2>

                  <div className={styles.subsList}>
                    {data.groups?.map((group, idx) => (
                      <GroupCard key={group.id ?? idx} group={group} />
                    ))}
                    {data.individual_clients?.map((client, idx) => (
                      <IndividualCard key={client.id ?? idx} client={client} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
