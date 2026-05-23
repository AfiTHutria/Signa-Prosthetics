import { useAuthStore, selectIsAuthenticated } from '@/store/authStore'

export function useAuth() {
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const error = useAuthStore((s) => s.error)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const loginAsUser = useAuthStore((s) => s.loginAsUser)
  const loginAsProfessional = useAuthStore((s) => s.loginAsProfessional)
  const logout = useAuthStore((s) => s.logout)
  const clearError = useAuthStore((s) => s.clearError)

  return {
    token,
    user,
    role,
    isHydrated,
    isLoading,
    error,
    isAuthenticated,
    loginAsUser,
    loginAsProfessional,
    logout,
    clearError,
  }
}
