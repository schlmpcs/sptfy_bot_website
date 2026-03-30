/**
 * PlanBadge — small pill badge indicating subscription region and type.
 *
 * @param {object} props
 * @param {"KZ"|"RU"} props.region         - Subscription region
 * @param {"group"|"individual"|"duo"} props.type - Plan type
 */
import styles from './PlanBadge.module.css'

const LABELS = {
  KZ: { group: '🇰🇿 KZ Family', individual: '🇰🇿 KZ Personal', duo: '🇰🇿 KZ Duo' },
  RU: { group: '🇷🇺 RU Group', individual: '🇷🇺 RU Personal', duo: '🇷🇺 RU Duo' },
}

export default function PlanBadge({ region, type }) {
  const label = LABELS[region]?.[type] ?? `${region} ${type}`
  const colorClass = styles[`${region.toLowerCase()}_${type}`] ?? styles.default

  return (
    <span className={`${styles.badge} ${colorClass}`}>
      {label}
    </span>
  )
}
