import { Link } from 'react-router-dom'
import { Stethoscope, User } from 'lucide-react'
import { ROUTES } from '@/routes/paths'
import styles from './RoleAccessButtons.module.css'

export function RoleAccessButtons({ layout = 'row', className = '' }) {
  return (
    <div className={`${styles.wrap} ${styles[layout]} ${className}`.trim()}>
      <Link to={ROUTES.AUTH_USER} className={styles.btnUser}>
        <User size={16} aria-hidden />
        Acceso Usuario
      </Link>
      <Link to={ROUTES.AUTH_PROFESSIONAL} className={styles.btnPro}>
        <Stethoscope size={16} aria-hidden />
        Acceso Profesional
      </Link>
    </div>
  )
}
