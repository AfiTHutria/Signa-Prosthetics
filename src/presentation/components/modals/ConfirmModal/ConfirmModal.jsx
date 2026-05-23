import { BaseModal } from '@/presentation/components/modals/BaseModal/BaseModal'
import { Button } from '@/presentation/components/ui/Button/Button'
import { useModalStore } from '@/store/modalStore'
import styles from './ConfirmModal.module.css'

export function ConfirmModal({
  modalId,
  title = 'Confirmar',
  message = '¿Estás seguro?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  const closeModal = useModalStore((state) => state.closeModal)

  const handleConfirm = () => {
    onConfirm?.()
    closeModal(modalId)
  }

  const handleCancel = () => {
    onCancel?.()
    closeModal(modalId)
  }

  return (
    <BaseModal modalId={modalId} title={title} size="small">
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </BaseModal>
  )
}
