import styles from '../HomePage.module.css'

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>R</span>
          <span className={styles.brandName}>Reandar</span>
        </div>
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Reandar. Hecho con cuidado para acompañar tu camino.
        </p>
      </div>
    </footer>
  )
}
