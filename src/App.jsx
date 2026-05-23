import { AppLayout } from '@/presentation/layouts/AppLayout'
import { HomePage } from '@/presentation/pages/HomePage/HomePage'
import { ModalProvider } from '@/presentation/providers/ModalProvider'

function App() {
  return (
    <>
      <AppLayout>
        <HomePage />
      </AppLayout>
      <ModalProvider />
    </>
  )
}

export default App
