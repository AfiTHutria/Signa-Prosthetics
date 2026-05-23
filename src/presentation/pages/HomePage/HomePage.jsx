import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/application/useCases/getCurrentUser'
import { SupabaseUserRepository } from '@/infrastructure/repositories/SupabaseUserRepository'
import { MODAL_TYPES } from '@/shared/constants/modals'
import { Button } from '@/presentation/components/ui/Button/Button'
import { SceneCanvas } from '@/presentation/components/three/SceneCanvas'
import { useModal } from '@/presentation/hooks/useModal'
import styles from './HomePage.module.css'

const userRepository = new SupabaseUserRepository()

export function HomePage() {
  const { openModal } = useModal()
  const [userLabel, setUserLabel] = useState('Sin sesión (configura Supabase en .env)')

  useEffect(() => {
    getCurrentUser(userRepository).then((user) => {
      if (user) {
        setUserLabel(user.name || user.email)
      }
    })
  }, [])

  const openConfirmModal = () => {
    openModal(MODAL_TYPES.CONFIRM, {
      title: 'Eliminar elemento',
      message: 'Esta acción no se puede deshacer.',
      onConfirm: () => console.log('Confirmado'),
    })
  }

  const openExampleModal = () => {
    openModal(MODAL_TYPES.EXAMPLE)
  }

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>React + Vite · Arquitectura limpia</p>
        <h1 className={styles.title}>Frontend listo para el hackathon</h1>
        <p className={styles.subtitle}>
          Usuario actual: <strong>{userLabel}</strong>
        </p>
      </div>

      <SceneCanvas />

      <div className={styles.actions}>
        <Button onClick={openExampleModal}>Abrir modal ejemplo</Button>
        <Button variant="ghost" onClick={openConfirmModal}>
          Abrir modal confirmación
        </Button>
      </div>

      <ul className={styles.stack}>
        <li>Modales centralizados con Zustand + registro</li>
        <li>Capas domain / application / infrastructure / presentation</li>
        <li>Axios, Supabase, LiveKit, Three.js y Framer Motion integrados</li>
      </ul>
    </section>
  )
}
