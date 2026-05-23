import { useModalStore } from '@/store/modalStore'
import { modalRegistry } from '@/shared/config/modalRegistry'

export function ModalProvider() {
  const modals = useModalStore((state) => state.modals)

  return (
    <>
      {modals.map(({ id, type, props }) => {
        const ModalComponent = modalRegistry[type]

        if (!ModalComponent) {
          return null
        }

        return (
          <ModalComponent
            key={id}
            modalId={id}
            {...props}
          />
        )
      })}
    </>
  )
}
