import { useEffect } from 'react'
import { AppRouter } from '@/router'
import { ModalProvider } from '@/providers/ModalProvider'
import { PrototypeModalHost } from '@/components/prototype/PrototypeModalHost'
import { AuthSessionSync } from '@/app/AuthSessionSync'
import { ErrorBoundary } from '@/app/ErrorBoundary'
import { useAuthStore } from '@/store/authStore'

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  return (
    <ErrorBoundary>
      <AuthSessionSync />
      <AppRouter />
      <ModalProvider />
      <PrototypeModalHost />
    </ErrorBoundary>
  )
}
