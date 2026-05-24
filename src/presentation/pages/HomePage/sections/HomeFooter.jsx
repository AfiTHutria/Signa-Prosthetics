import { Link } from 'react-router-dom'
import styles from '../HomePage.module.css'

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandLogoWrap}>
            <img
              src="/logo-signa.png"
              alt="Signa"
              className={styles.brandLogo}
              width={50}
              height={50}
              decoding="async"
            />
          </span>
        </Link>
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} Signa. Hecho con cuidado para acompañar tu camino.
        </p>
      </div>
    </footer>
  )
}