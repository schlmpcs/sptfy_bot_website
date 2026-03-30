import { Link } from 'react-router-dom'
import GlowCard from '../components/GlowCard.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { getLegalDocument } from '../content/legalDocuments.js'
import { getBusinessDetails, getLegalLinks, siteDetails } from '../content/siteDetails.js'
import styles from './LegalPage.module.css'

export default function LegalPage({ documentKey }) {
  const { lang } = useLanguage()
  const document = getLegalDocument(documentKey, lang)
  const links = getLegalLinks(lang)
  const businessDetails = getBusinessDetails(lang)
  const footerTitle = siteDetails.legal.footerTitle[lang] ?? siteDetails.legal.footerTitle.ru

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{document.eyebrow}</span>
          <h1 className={styles.title}>{document.title}</h1>
          <p className={styles.lead}>{document.lead}</p>
          <div className={styles.meta}>
            <span>{document.updatedAt}</span>
            <span className={styles.metaDot} />
            <span>{siteDetails.support.telegramHandle}</span>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.content}>
            {document.sections.map((section) => (
              <GlowCard key={section.title} className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>{section.title}</h2>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}

                {section.items?.length ? (
                  <ul className={styles.list}>
                    {section.items.map((item) => (
                      <li key={item} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </GlowCard>
            ))}
          </div>

          <aside className={styles.sidebar}>
            <GlowCard className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>{footerTitle}</h2>
              <div className={styles.sidebarLines}>
                {businessDetails.map((line) => (
                  <p key={line} className={styles.sidebarLine}>
                    {line}
                  </p>
                ))}
              </div>
            </GlowCard>

            <GlowCard className={styles.sidebarCard}>
              <h2 className={styles.sidebarTitle}>
                {
                  {
                    ru: 'Юридические ссылки',
                    kz: 'Заңи сілтемелер',
                    en: 'Legal links',
                  }[lang] ?? 'Юридические ссылки'
                }
              </h2>
              <div className={styles.sidebarNav}>
                {links.map((link) => (
                  <Link key={link.to} to={link.to} className={styles.sidebarLink}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </GlowCard>
          </aside>
        </div>
      </div>
    </div>
  )
}
