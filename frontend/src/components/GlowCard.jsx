/**
 * GlowCard — reusable glassmorphism card component.
 *
 * @param {object}  props
 * @param {React.ReactNode} props.children     - Card content
 * @param {string}  [props.className]          - Additional CSS class names
 * @param {boolean} [props.highlighted=false]  - When true, adds extra green glow
 */
import styles from './GlowCard.module.css'

export default function GlowCard({ children, className = '', highlighted = false }) {
  const classes = [
    styles.card,
    highlighted ? styles.highlighted : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
