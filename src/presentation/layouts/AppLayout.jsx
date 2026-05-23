import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>Hackaton</span>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
