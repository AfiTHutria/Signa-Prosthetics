import { Sparkles } from 'lucide-react'
import { usePrototypeAccessStore } from '@/store/prototypeAccessStore'
import styles from './CreaPrototipoButton.module.css'

export function CreaPrototipoButton({
  variant = 'primary',
  className = '',
  showIcon = true,
  children = 'Crea tu Prototipo',
}) {
  const open = usePrototypeAccessStore((s) => s.open)

  return (
    <button
      type="button"
      className={`${styles.btn} ${styles[variant]} ${className}`.trim()}
      onClick={open}
    >
      {showIcon && <Sparkles className={styles.icon} size={18} aria-hidden />}
      {children}
    </button>
  )
}
