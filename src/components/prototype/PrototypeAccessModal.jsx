import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Cpu, Stethoscope, User, X } from 'lucide-react'
import { usePrototypeAccessStore } from '@/store/prototypeAccessStore'
import { ROUTES } from '@/routes/paths'
import styles from './PrototypeAccessModal.module.css'

export function PrototypeAccessModal() {
  const navigate = useNavigate()
  const { isOpen, close } = usePrototypeAccessStore()

  const goToUser = () => {
    close()
    navigate(ROUTES.AUTH_USER)
  }

  const goToProfessional = () => {
    close()
    navigate(ROUTES.AUTH_PROFESSIONAL)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="prototype-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={close} aria-label="Cerrar">
              <X size={18} />
            </button>

            <div className={styles.header}>
              <span className={styles.badge}>
                <Cpu size={14} /> Signa IA · Biomecánica
              </span>
              <h2 id="prototype-modal-title" className={styles.title}>
                Crea tu Prototipo
              </h2>
              <p className={styles.subtitle}>
                Elige tu perfil. Cada acceso tiene su propio inicio de sesión y dashboard.
              </p>
            </div>

            <motion.div
              className={styles.options}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <button type="button" className={styles.optionCard} onClick={goToUser}>
                <span className={styles.optionIcon}>
                  <User size={22} />
                </span>
                <span className={styles.optionTitle}>Usuario</span>
                <span className={styles.optionDesc}>
                  Tu prototipo 3D, progreso y sesiones → dashboard de usuario.
                </span>
              </button>

              <button
                type="button"
                className={`${styles.optionCard} ${styles.optionCardPro}`}
                onClick={goToProfessional}
              >
                <span className={styles.optionIcon}>
                  <Stethoscope size={22} />
                </span>
                <span className={styles.optionTitle}>Profesional</span>
                <span className={styles.optionDesc}>
                  Casos clínicos y validación → panel profesional.
                </span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
