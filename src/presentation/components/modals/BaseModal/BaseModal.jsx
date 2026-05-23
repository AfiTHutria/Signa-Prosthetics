import { AnimatePresence, motion } from 'framer-motion'
import { useModalStore } from '@/store/modalStore'
import styles from './BaseModal.module.css'

export function BaseModal({
  modalId,
  title,
  children,
  onClose,
  size = 'medium',
}) {
  const closeModal = useModalStore((state) => state.closeModal)

  const handleClose = () => {
    onClose?.()
    closeModal(modalId)
  }

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          className={`${styles.modal} ${styles[size]}`}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          onClick={(event) => event.stopPropagation()}
        >
          {title && (
            <header className={styles.header}>
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </header>
          )}
          <div className={styles.body}>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
