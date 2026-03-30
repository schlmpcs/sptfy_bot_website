import { useState, useRef } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import PlanBadge from '../components/PlanBadge.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { siteDetails } from '../content/siteDetails.js'
import styles from './Dashboard.module.css'

const API_BASE = '/api'

function urgencyClass(days, s) {
  if (days > 7) return s.urgencyGreen
  if (days >= 3) return s.urgencyYellow
  return s.urgencyRed
}

function daysUntil(dateStr) {
  if (!dateStr) return 0
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function Spinner({ t }) {
  return (
    <div className={styles.spinnerWrapper} aria-label="Loading">
      <div className={styles.spinner} />
      <p className={styles.spinnerText}>{t('dashboard.loading')}</p>
    </div>
  )
}

function ErrorCard({ message, t }) {
  return (
    <GlowCard className={styles.errorCard}>
      <span className={styles.errorIcon}>✕</span>
      <div>
        <h3 className={styles.errorTitle}>{t('dashboard.error.title')}</h3>
        <p className={styles.errorMsg}>{message}</p>
      </div>
    </GlowCard>
  )
}

function EmptyState({ t }) {
  return (
    <GlowCard className={styles.emptyCard}>
      <span className={styles.emptyIcon}>🎵</span>
      <h3 className={styles.emptyTitle}>{t('dashboard.empty.title')}</h3>
      <p className={styles.emptyDesc}>{t('dashboard.empty.desc')}</p>
      <a
        href={siteDetails.support.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.emptyBtn}
      >
        {t('dashboard.empty.btn')}
      </a>
    </GlowCard>
  )
}

function GroupCard({ group, t }) {
  const days = daysUntil(group.next_payment_date)
  const urgency = urgencyClass(days, styles)

  return (
    <GlowCard className={styles.subCard}>
      <div className={styles.subCardHeader}>
        <div>
          <h3 className={styles.subCardTitle}>{group.group_name || t('dashboard.group.title')}</h3>
          {group.region && (
            <PlanBadge region={group.region.toUpperCase()} type="group" />
          )}
        </div>
        <span className={`${styles.statusBadge} ${styles.statusActive}`}>{t('dashboard.status.active')}</span>
      </div>

      <div className={styles.subDetails}>
        {group.next_payment_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.nextPayment')}</span>
            <span className={styles.detailValue}>{formatDate(group.next_payment_date)}</span>
          </div>
        )}
        {group.next_payment_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.daysLeft')}</span>
            <span className={`${styles.detailValue} ${urgency}`}>
              {days > 0
                ? t('dashboard.days').replace('{n}', days)
                : t('dashboard.dueToday')}
            </span>
          </div>
        )}
        {group.slots !== undefined && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.slots')}</span>
            <span className={styles.detailValue}>{group.slots}</span>
          </div>
        )}
        {group.price && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.price')}</span>
            <span className={styles.detailValue}>{group.price}</span>
          </div>
        )}
      </div>

      {days <= 3 && days >= 0 && (
        <div className={styles.reminderBanner}>{t('dashboard.reminder.soon')}</div>
      )}
      {days < 0 && (
        <div className={`${styles.reminderBanner} ${styles.reminderOverdue}`}>
          {t('dashboard.reminder.overdue')}
        </div>
      )}
    </GlowCard>
  )
}

function IndividualCard({ client, t }) {
  const days = daysUntil(client.next_due_date)
  const urgency = urgencyClass(days, styles)
  const planType = client.plan_type?.toLowerCase() === 'duo' ? 'duo' : 'individual'

  return (
    <GlowCard className={styles.subCard}>
      <div className={styles.subCardHeader}>
        <div>
          <h3 className={styles.subCardTitle}>
            {planType === 'duo' ? t('dashboard.duo.title') : t('dashboard.individual.title')}
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
          {client.status === 'active' ? t('dashboard.status.active') : t('dashboard.status.inactive')}
        </span>
      </div>

      <div className={styles.subDetails}>
        {client.price && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.price')}</span>
            <span className={styles.detailValue}>{client.price}</span>
          </div>
        )}
        {client.payment_day && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.paymentDay')}</span>
            <span className={styles.detailValue}>
              {t('dashboard.paymentDayOf').replace('{day}', client.payment_day)}
            </span>
          </div>
        )}
        {client.next_due_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.nextDue')}</span>
            <span className={styles.detailValue}>{formatDate(client.next_due_date)}</span>
          </div>
        )}
        {client.next_due_date && (
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>{t('dashboard.card.daysLeft')}</span>
            <span className={`${styles.detailValue} ${urgency}`}>
              {days > 0
                ? t('dashboard.days').replace('{n}', days)
                : t('dashboard.dueToday')}
            </span>
          </div>
        )}
      </div>

      {days <= 3 && days >= 0 && (
        <div className={styles.reminderBanner}>{t('dashboard.reminder.soon')}</div>
      )}
      {days < 0 && (
        <div className={`${styles.reminderBanner} ${styles.reminderOverdue}`}>
          {t('dashboard.reminder.overdue')}
        </div>
      )}
    </GlowCard>
  )
}

function UserCard({ user, t }) {
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    `User #${user.telegram_id}`

  return (
    <GlowCard highlighted className={styles.userCard}>
      <div className={styles.userAvatar}>{displayName.charAt(0).toUpperCase()}</div>
      <div className={styles.userInfo}>
        <h2 className={styles.userName}>{displayName}</h2>
        {user.username && <p className={styles.userHandle}>@{user.username}</p>}
        {user.telegram_id && <p className={styles.userId}>ID: {user.telegram_id}</p>}
      </div>
      <span className={styles.memberBadge}>{t('dashboard.badge.activeMember')}</span>
    </GlowCard>
  )
}

export default function Dashboard() {
  const [userId, setUserId] = useState('')
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef(null)
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = userId.trim()
    if (!trimmed) { inputRef.current?.focus(); return }

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
      setData(await res.json())
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
          <span className={styles.sectionTag}>{t('dashboard.tag')}</span>
          <h1 className={styles.title}>{t('dashboard.title')}</h1>
          <p className={styles.subtitle}>{t('dashboard.subtitle')}</p>
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
              placeholder={t('dashboard.inputPlaceholder')}
              className={styles.input}
              aria-label="Telegram User ID"
              disabled={status === 'loading'}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
            {status === 'loading' ? t('dashboard.checking') : t('dashboard.checkBtn')}
          </button>
        </form>

        <p className={styles.inputHint}>
          {t('dashboard.hint').split('{link}')[0]}
          <a
            href="https://t.me/userinfobot"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hintLink}
          >
            @userinfobot
          </a>
          {t('dashboard.hint').split('{link}')[1]}
        </p>

        {/* States */}
        <div className={styles.resultArea}>
          {status === 'loading' && <Spinner t={t} />}
          {status === 'error' && <ErrorCard message={errorMsg} t={t} />}
          {status === 'success' && data && (
            <>
              {data.user && <UserCard user={data.user} t={t} />}
              {hasSubscriptions ? (
                <div className={styles.subscriptionsSection}>
                  <h2 className={styles.subsTitle}>{t('dashboard.subs.title')}</h2>
                  <div className={styles.subsList}>
                    {data.groups?.map((group, idx) => (
                      <GroupCard key={group.id ?? idx} group={group} t={t} />
                    ))}
                    {data.individual_clients?.map((client, idx) => (
                      <IndividualCard key={client.id ?? idx} client={client} t={t} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState t={t} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
