import { useModalStore } from '@/store/modalStore'

export function useModal() {
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const closeAllModals = useModalStore((state) => state.closeAllModals)

  return { openModal, closeModal, closeAllModals }
}
