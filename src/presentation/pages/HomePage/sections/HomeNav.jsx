import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'

import { RoleAccessButtons } from '@/components/common/RoleAccessButtons'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardPathForRole } from '@/utils/authPaths'

import styles from '../HomePage.module.css'

const NAV_ITEMS = [
  {
    href: '#servicios',
    label: 'Servicios',
  },
  {
    href: '#protesis',
    label: 'Asistente de prótesis',
  },
  {
    href: '#proceso',
    label: 'Proceso',
  },
  {
    href: '#prototipo',
    label: 'Plataforma',
  },
]

export function HomeNav() {
  const { isAuthenticated, role } =
    useAuth()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const closeMenu = () =>
    setMenuOpen(false)

  return (
    <header className={styles.nav}>
      <div className={styles.navInner}>
        {/* LOGO */}
        <Link
          to="/"
          className={styles.brand}
          onClick={closeMenu}
        >
          <span className={styles.brandMark}>
            R
          </span>

          <span className={styles.brandName}>
            Reandar
          </span>
        </Link>

        {/* LINKS */}
        <nav
          id="landing-nav"
          className={`${styles.navLinks} ${menuOpen
            ? styles.navLinksOpen
            : ''
            }`}
          aria-label="Principal"
        >
          {NAV_ITEMS.map(
            ({ href, label }) => (
              <a
                key={href}
                href={href}
                className={styles.navLink}
                onClick={closeMenu}
              >
                {label}
              </a>
            )
          )}


        </nav>

        {/* ACTIONS */}
        <div className={styles.navActions}>
          {isAuthenticated && role ? (
            <Link
              to={getDashboardPathForRole(
                role
              )}
              className={
                styles.navDashboardLink
              }
              onClick={closeMenu}
            >
              <LayoutDashboard
                size={16}
                aria-hidden
              />

              <span>Mi panel</span>
            </Link>
          ) : (
            <div
              className={
                styles.inlineButtons
              }
            >
              <RoleAccessButtons
                layout="row"
                className={
                  styles.navRoleBtns
                }
              />
            </div>
          )}

          {/* TOGGLE */}
          <button
            type="button"
            className={styles.navToggle}
            aria-expanded={menuOpen}
            aria-controls="landing-nav"
            aria-label={
              menuOpen
                ? 'Cerrar menú'
                : 'Abrir menú'
            }
            onClick={() =>
              setMenuOpen((v) => !v)
            }
          >
            {menuOpen ? (
              <X
                size={22}
                aria-hidden
              />
            ) : (
              <Menu
                size={22}
                aria-hidden
              />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}