import { ROUTES, ROLE } from '@/routes/paths'

export function getDashboardPathForRole(role) {
  if (role === ROLE.PROFESSIONAL) return ROUTES.DASHBOARD_PROFESSIONAL
  return ROUTES.DASHBOARD_USER
}
