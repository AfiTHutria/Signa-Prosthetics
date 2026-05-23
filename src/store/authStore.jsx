import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginProfessional, loginUser, validateToken } from '@/services/authService'
import { ROLE } from '@/routes/paths'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      isHydrated: false,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      bootstrap: () => {
        const { token } = get()
        if (!token) {
          set({ isHydrated: true })
          return
        }
        const user = validateToken(token)
        if (!user) {
          set({ token: null, user: null, role: null, isHydrated: true })
          return
        }
        set({ user, role: user.role, isHydrated: true })
      },

      loginAsUser: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const { token, user } = await loginUser(credentials)
          set({
            token,
            user,
            role: ROLE.USER,
            isLoading: false,
            isHydrated: true,
            error: null,
          })
          return user
        } catch (error) {
          set({
            isLoading: false,
            error: error?.message ?? 'No se pudo iniciar sesión',
          })
          throw error
        }
      },

      loginAsProfessional: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const { token, user } = await loginProfessional(credentials)
          set({
            token,
            user,
            role: ROLE.PROFESSIONAL,
            isLoading: false,
            isHydrated: true,
            error: null,
          })
          return user
        } catch (error) {
          set({
            isLoading: false,
            error: error?.message ?? 'No se pudo iniciar sesión',
          })
          throw error
        }
      },

      logout: () =>
        set({
          token: null,
          user: null,
          role: null,
          error: null,
          isLoading: false,
        }),
    }),
    {
      name: 'signa-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.bootstrap()
        else useAuthStore.setState({ isHydrated: true })
      },
    },
  ),
)

export const selectIsAuthenticated = (state) => Boolean(state.token && state.user)
