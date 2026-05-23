import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import styles from './DashboardLayout.module.css'

export function DashboardLayout({ title, subtitle, navItems, children, variant = 'user' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isPro = variant === 'professional'

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  return (
    <div className={`${styles.shell} ${isPro ? styles.shellPro : styles.shellUser}`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <Sparkles size={16} />
          </span>
          <div>
            <p className={styles.brandName}>Signa</p>
            <p className={styles.brandTag}>Prosthetics IA</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) =>
            item.isButton ? (
              <button
                key={item.id ?? item.label}
                type="button"
                className={`${styles.navLink} ${item.active ? styles.navLinkActive : ''}`.trim()}
                onClick={item.onClick}
              >
                {item.icon}
                {item.label}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                }
                end={item.end}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className={styles.userBox}>
          <p className={styles.userName}>{user?.name}</p>
          <span className={isPro ? styles.roleBadgePro : styles.roleBadgeUser}>
            {isPro ? 'Profesional' : 'Usuario'}
          </span>
          <p className={styles.userEmail}>{user?.email}</p>
          <button type="button" className={styles.logout} onClick={handleLogout}>
            <LogOut size={14} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </motion.header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
