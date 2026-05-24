import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Menu, X } from 'lucide-react'

import { RoleAccessButtons } from '@/components/common/RoleAccessButtons'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardPathForRole } from '@/utils/authPaths'

import styles from '../HomePage.module.css'

const NAV_ITEMS = [
  { href: '#servicios', label: 'Servicios' },
  { href: '#protesis', label: 'Asistente de prótesis' },
  { href: '#proceso', label: 'Proceso' },
  { href: '#prototipo', label: 'Plataforma' },
]

/** Botones de acceso solo en tablet/desktop (no en teléfono). */
const DESKTOP_NAV_MQ = '(min-width: 900px)'

export function HomeNav() {
  const { isAuthenticated, role } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthButtons, setShowAuthButtons] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ)
    const update = () => setShowAuthButtons(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        <Link to="/" className={styles.brand} onClick={closeMenu}>
          <span className={styles.brandLogoWrap}>
            <img
              src="/logo-signa.png"
              alt="Signa"
              className={styles.brandLogo}
              width={72}
              height={22}
              decoding="async"
            />
          </span>
        </Link>

        <nav
          id="landing-nav"
          className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}
          aria-label="Principal"
        >
          {NAV_ITEMS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={styles.navLink}
              onClick={closeMenu}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className={styles.navActions}>
          {isAuthenticated && role ? (
            <Link
              to={getDashboardPathForRole(role)}
              className={styles.navDashboardLink}
              onClick={closeMenu}
            >
              <LayoutDashboard size={16} aria-hidden />
              <span className={styles.navDashboardShort}>Panel</span>
              <span className={styles.navDashboardFull}>Mi panel</span>
            </Link>
          ) : (
            showAuthButtons && (
              <RoleAccessButtons layout="row" className={styles.navRoleBtns} />
            )
          )}

          <button
            type="button"
            className={styles.navToggle}
            aria-expanded={menuOpen}
            aria-controls="landing-nav"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X size={22} aria-hidden />
            ) : (
              <Menu size={22} aria-hidden />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}