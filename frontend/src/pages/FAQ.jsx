import { useState } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import styles from './FAQ.module.css'

/** FAQ item data */
const FAQ_ITEMS = [
  {
    q: 'How do I subscribe?',
    a: 'Open our Telegram bot @sptfy_premium, press Start, and follow the guided buy flow. Select your region, choose a plan, make the payment, and upload your receipt.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'Kazakhstan: Kaspi Bank (direct payment link provided). Russia: card transfer to VTB, or SBP (Fast Payment System) via phone number.',
  },
  {
    q: 'How long does approval take?',
    a: 'Admin approval is typically done within a few hours. You have a 30-minute window to complete the payment after starting an order. Once approved, you receive your Spotify access immediately.',
  },
  {
    q: 'Can I pay for multiple months upfront?',
    a: 'Yes! Kazakhstan plans support 1–6 months. Russian plans support 1–12 months upfront at the same monthly rate.',
  },
  {
    q: 'What is the difference between Group and Individual plans?',
    a: 'Group plans add you to a shared Spotify Family plan (lowest cost). Individual plans give you a personal Spotify account. Duo plans cover two people on one account.',
  },
  {
    q: 'How do payment reminders work?',
    a: 'The bot sends automated daily reminders starting 3 days before your payment is due. If you\'re 1–3 days overdue you\'ll receive escalating reminders. Admins are alerted if you\'re 3+ days late.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, use the /status command in the bot and select "Cancel subscription". Your admin will be notified and access will be revoked.',
  },
  {
    q: 'What if my receipt is rejected?',
    a: 'If your receipt is rejected by the admin, you can resend updated credentials within the same request. Contact @sptfy_premium for support.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'All receipts are stored in a secure Telegram audit channel. No card numbers are stored — you pay directly via your bank app.',
  },
  {
    q: 'What regions are supported?',
    a: 'Currently Kazakhstan (₸ Tenge) and Russia (₽ Rubles). More regions may be added in the future.',
  },
]

/**
 * Individual accordion item.
 *
 * @param {object} props
 * @param {string}  props.question
 * @param {string}  props.answer
 * @param {boolean} props.isOpen
 * @param {Function} props.onToggle
 */
function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <GlowCard
      className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}
    >
      <button
        className={styles.question}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={styles.icon} aria-hidden="true">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        className={styles.answerWrapper}
        style={{ maxHeight: isOpen ? '400px' : '0' }}
        aria-hidden={!isOpen}
      >
        <p className={styles.answer}>{answer}</p>
      </div>
    </GlowCard>
  )
}

/**
 * FAQ page — glassmorphism accordion with 10 questions.
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx))

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionTag}>Got questions?</span>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Everything you need to know about our Spotify Family subscription service.
            Can't find an answer?{' '}
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              Contact us on Telegram.
            </a>
          </p>
        </div>

        {/* Accordion */}
        <div className={styles.accordion} role="list">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} role="listitem">
              <AccordionItem
                question={item.q}
                answer={item.a}
                isOpen={openIndex === idx}
                onToggle={() => toggle(idx)}
              />
            </div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <GlowCard highlighted className={styles.ctaCard}>
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaTitle}>Still have questions?</h2>
              <p className={styles.ctaDesc}>
                Our support team is available via Telegram. We typically respond within a few hours.
              </p>
            </div>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              Contact Support
            </a>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
