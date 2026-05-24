import { useState } from 'react'
import { PersonDataPanel } from '@/components/landing/PersonDataPanel'

import styles from '../HomePage.module.css'

const FEATURES = [
  'Escaneo 3D',
  'Recomendaciones según rutina y Actividad',
  'Conexión con talleres ortopédicos aliados',
  'Acompañamiento  en cada decisión',
]

export function HomeProstheticAssistant() {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <section id="protesis" className={styles.prostheticSection}>
      <div className={styles.prostheticGrid}>
        <div className={styles.prostheticCopy}>
          <p className={styles.sectionKicker}>Asistente de prótesis</p>
          <h2 className={styles.sectionTitle}>
            Diseña una prótesis que se sienta{' '}
            <span className={styles.prostheticTitleAccent}>tuya.</span>
          </h2>


          <ul className={styles.featureList}>
            {FEATURES.map((text) => (
              <li key={text} className={styles.featureItem}>
                <span className={styles.featureBullet}>
                  <span className={styles.featureBulletDot} />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>




        </div>
      </div>

      <PersonDataPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </section>
  )
}
