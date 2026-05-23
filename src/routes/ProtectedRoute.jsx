import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/routes/paths'
import { getDashboardPathForRole } from '@/utils/authPaths'
import styles from './ProtectedRoute.module.css'

export function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, role, isHydrated } = useAuth()
  const location = useLocation()

  if (!isHydrated) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
        Validando sesión…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPathForRole(role)} replace />
  }

  return children
}
