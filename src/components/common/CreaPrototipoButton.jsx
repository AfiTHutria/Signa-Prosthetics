import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import styles from './CreaPrototipoButton.module.css'

export function CreaPrototipoButton({
  variant = 'primary',
  className = '',
  showIcon = true,
  children = 'Crea Tu Protesis',
}) {
  return (
    <Link
      to={ROUTES.AUTH_USER}
      className={`${styles.btn} ${styles[variant]} ${className}`.trim()}
    >
      {showIcon && <Sparkles className={styles.icon} size={18} aria-hidden />}
      {children}
    </Link>
  )
}
