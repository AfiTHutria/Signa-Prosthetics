import { useEffect } from 'react'
import { X } from 'lucide-react'
import { MeshModelViewer } from '@/presentation/components/three/MeshModelViewer'
import styles from './ClinicalModelViewerModal.module.css'

export function ClinicalModelViewerModal({ open, title, source, fileName, onClose }) {
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open || !source) return null

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clinical-model-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>Visor 3D · STL / PLY</p>
            <h2 id="clinical-model-title" className={styles.title}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar visor"
          >
            <X size={20} aria-hidden />
          </button>
        </header>

        <div className={styles.body}>
          <MeshModelViewer
            key={
              source instanceof File
                ? `file-${source.name}-${source.size}-${source.lastModified}`
                : `url-${fileName}-${String(source).slice(0, 80)}`
            }
            source={source}
            fileName={fileName}
          />
        </div>
      </div>
    </div>
  )
}
