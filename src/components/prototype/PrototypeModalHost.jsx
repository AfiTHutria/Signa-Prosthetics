import { lazy, Suspense } from 'react'
import { usePrototypeAccessStore } from '@/store/prototypeAccessStore'
import { useAuthStore, selectIsAuthenticated } from '@/store/authStore'

const PrototypeAccessModal = lazy(() =>
  import('./PrototypeAccessModal').then((m) => ({ default: m.PrototypeAccessModal })),
)

export function PrototypeModalHost() {
  const isOpen = usePrototypeAccessStore((s) => s.isOpen)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  if (!isOpen || isAuthenticated) return null

  return (
    <Suspense fallback={null}>
      <PrototypeAccessModal />
    </Suspense>
  )
}
