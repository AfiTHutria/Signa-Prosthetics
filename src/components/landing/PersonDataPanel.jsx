import { AnimatePresence, motion } from 'framer-motion'
import { ClipboardList, X } from 'lucide-react'
import { PERSON_DATA_SECTIONS } from '@/shared/constants/personDataFields'
import styles from './PersonDataPanel.module.css'

export function PersonDataPanel({
  open,
  onClose,
  values = {},
  readOnly = false,
  title = 'Datos para tu evaluación',
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="person-data-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.header}>
              <div className={styles.headerIcon}>
                <ClipboardList size={22} aria-hidden />
              </div>
              <div className={styles.headerText}>
                <p className={styles.kicker}>Formulario de evaluación</p>
                <h2 id="person-data-title" className={styles.title}>
                  {title}
                </h2>
                <p className={styles.subtitle}>
                  Estos son los datos que solicitaremos para diseñar tu prótesis personalizada.
                </p>
              </div>
              <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
                <X size={20} />
              </button>
            </header>

            <div className={styles.body}>
              {PERSON_DATA_SECTIONS.map((section) => (
                <section key={section.id} className={styles.section}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>
                  <div className={styles.fieldGrid}>
                    {section.fields.map((field) => (
                      <label key={field.id} className={styles.field}>
                        <span className={styles.label}>{field.label}</span>
                        {field.type === 'textarea' ? (
                          <textarea
                            className={styles.input}
                            placeholder={field.placeholder}
                            defaultValue={values[field.id] ?? ''}
                            readOnly={readOnly}
                            rows={3}
                          />
                        ) : (
                          <input
                            className={styles.input}
                            type={field.type}
                            placeholder={field.placeholder}
                            defaultValue={values[field.id] ?? ''}
                            readOnly={readOnly}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <footer className={styles.footer}>
              <p className={styles.footerNote}>
                Completa estos datos con tu profesional o desde tu dashboard de usuario.
              </p>
              <button type="button" className={styles.footerBtn} onClick={onClose}>
                Entendido
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
