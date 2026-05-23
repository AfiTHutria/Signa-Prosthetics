import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardPathForRole } from '@/utils/authPaths'
import { PageLoader } from '@/components/common/PageLoader'

export function GuestRoute({ children }) {
  const { isAuthenticated, role, isHydrated } = useAuth()

  if (!isHydrated) return <PageLoader label="Validando sesión…" />

  if (isAuthenticated && role) {
    return <Navigate to={getDashboardPathForRole(role)} replace />
  }

  return children
}
