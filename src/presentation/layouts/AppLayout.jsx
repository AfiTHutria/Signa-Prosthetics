import styles from './AppLayout.module.css'

export function AppLayout({ children }) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>Hackaton</span>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
