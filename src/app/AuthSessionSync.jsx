import { useEffect } from 'react'
import { useAuthStore, selectIsAuthenticated } from '@/store/authStore'
import { usePrototypeAccessStore } from '@/store/prototypeAccessStore'

export function AuthSessionSync() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  useEffect(() => {
    if (isAuthenticated) usePrototypeAccessStore.getState().close()
  }, [isAuthenticated])

  return null
}
