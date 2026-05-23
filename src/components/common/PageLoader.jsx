import styles from './PageLoader.module.css'

export function PageLoader({ label = 'Cargando…' }) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.spinner} />
      <p>{label}</p>
    </div>
  )
}
