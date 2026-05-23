import { BaseModal } from '@/presentation/components/modals/BaseModal/BaseModal'
import styles from './ExampleModal.module.css'

export function ExampleModal({ modalId, title = 'Modal de ejemplo' }) {
  return (
    <BaseModal modalId={modalId} title={title} size="medium">
      <p className={styles.text}>
        Este modal está registrado en el sistema centralizado. Puedes abrir
        varios modales apilados desde cualquier parte de la app con{' '}
        <code>useModal()</code>.
      </p>
    </BaseModal>
  )
}
