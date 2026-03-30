import { useState } from 'react'
import GlowCard from '../components/GlowCard.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import styles from './FAQ.module.css'

function AccordionItem({ question, answer, isOpen, onToggle }) {
  return (
    <GlowCard className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const { t } = useLanguage()

  const FAQ_ITEMS = [
    { q: t('faq.q1'),  a: t('faq.a1') },
    { q: t('faq.q2'),  a: t('faq.a2') },
    { q: t('faq.q3'),  a: t('faq.a3') },
    { q: t('faq.q4'),  a: t('faq.a4') },
    { q: t('faq.q5'),  a: t('faq.a5') },
    { q: t('faq.q6'),  a: t('faq.a6') },
    { q: t('faq.q7'),  a: t('faq.a7') },
    { q: t('faq.q8'),  a: t('faq.a8') },
    { q: t('faq.q9'),  a: t('faq.a9') },
    { q: t('faq.q10'), a: t('faq.a10') },
  ]

  const toggle = (idx) => setOpenIndex((prev) => (prev === idx ? null : idx))

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionTag}>{t('faq.tag')}</span>
          <h1 className={styles.title}>{t('faq.title')}</h1>
          <p className={styles.subtitle}>
            {t('faq.subtitle')}{' '}
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.supportLink}
            >
              {t('faq.subtitleLink')}
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
              <h2 className={styles.ctaTitle}>{t('faq.cta.title')}</h2>
              <p className={styles.ctaDesc}>{t('faq.cta.desc')}</p>
            </div>
            <a
              href="https://t.me/sptfy_premium"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              {t('faq.cta.btn')}
            </a>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}
