import { lazy, Suspense } from 'react'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GuestRoute } from '@/routes/GuestRoute'
import { ROUTES, ROLE } from '@/routes/paths'
import { PageLoader } from '@/components/common/PageLoader'

const HomePage = lazy(() =>
  import('@/pages/HomePage').then((m) => ({ default: m.HomePage })),
)
const UserDashboard = lazy(() =>
  import('@/dashboard/user/UserDashboard').then((m) => ({ default: m.UserDashboard })),
)
const ProfessionalDashboard = lazy(() =>
  import('@/dashboard/professional/ProfessionalDashboard').then((m) => ({
    default: m.ProfessionalDashboard,
  })),
)
const AuthUserPage = lazy(() =>
  import('@/pages/AuthUserPage').then((m) => ({ default: m.AuthUserPage })),
)
const AuthProfessionalPage = lazy(() =>
  import('@/pages/AuthProfessionalPage').then((m) => ({ default: m.AuthProfessionalPage })),
)

function withSuspense(Component, label) {
  return (
    <Suspense fallback={<PageLoader label={label} />}>
      <Component />
    </Suspense>
  )
}

export const appRoutes = [
  {
    path: ROUTES.HOME,
    element: withSuspense(HomePage, 'Cargando inicio…'),
  },
  {
    path: ROUTES.AUTH_USER,
    element: <GuestRoute>{withSuspense(AuthUserPage, 'Cargando acceso…')}</GuestRoute>,
  },
  {
    path: ROUTES.AUTH_PROFESSIONAL,
    element: (
      <GuestRoute>{withSuspense(AuthProfessionalPage, 'Cargando acceso…')}</GuestRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD_USER,
    element: (
      <ProtectedRoute allowedRoles={[ROLE.USER]}>
        {withSuspense(UserDashboard, 'Cargando dashboard…')}
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DASHBOARD_PROFESSIONAL,
    element: (
      <ProtectedRoute allowedRoles={[ROLE.PROFESSIONAL]}>
        {withSuspense(ProfessionalDashboard, 'Cargando panel…')}
      </ProtectedRoute>
    ),
  },
]
