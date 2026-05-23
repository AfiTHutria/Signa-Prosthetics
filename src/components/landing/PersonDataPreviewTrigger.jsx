import { ClipboardList, ChevronRight } from 'lucide-react'
import styles from './PersonDataPreviewTrigger.module.css'

export function PersonDataPreviewTrigger({ onClick }) {
  return (
    <button type="button" className={styles.trigger} onClick={onClick}>
      <span className={styles.iconWrap}>
        <ClipboardList size={28} aria-hidden />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>Ver datos de evaluación</span>
        <span className={styles.desc}>
          Toca para ver todos los campos que pediremos para tu prótesis
        </span>
      </span>
      <ChevronRight className={styles.chevron} size={20} aria-hidden />
    </button>
  )
}
