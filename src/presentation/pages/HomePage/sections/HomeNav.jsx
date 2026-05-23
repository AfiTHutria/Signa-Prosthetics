import { Link } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'

import { CreaPrototipoButton } from '@/components/common/CreaPrototipoButton'


import { useAuth } from '@/hooks/useAuth'
import { getDashboardPathForRole } from '@/utils/authPaths'

import styles from '../HomePage.module.css'

export function HomeNav() {
  const { isAuthenticated, role } = useAuth()

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>

        {/* LOGO */}
        <Link to="/" className={styles.brand}>
          <span className={styles.brandMark}>R</span>
          <span className={styles.brandName}>Reandar</span>
        </Link>

        {/* LINKS */}
        <nav className={styles.navLinks}>
          <a href="#servicios" className={styles.navLink}>
            Servicios
          </a>

          <a href="#protesis" className={styles.navLink}>
            Asistente de prótesis
          </a>

          <a href="#proceso" className={styles.navLink}>
            Proceso
          </a>

          <a href="#prototipo" className={styles.navLink}>
            Plataforma
          </a>
        </nav>

        {/* ACTIONS */}
        <div className={styles.navActions}>
          {isAuthenticated && role ? (
            <Link
              to={getDashboardPathForRole(role)}
              className={styles.navDashboardLink}
            >
              <LayoutDashboard size={16} aria-hidden />
              <span>Mi panel</span>
            </Link>
          ) : (
            <>
              <CreaPrototipoButton variant="nav" />

            </>
          )}
        </div>
      </div>
    </header>
  )
}