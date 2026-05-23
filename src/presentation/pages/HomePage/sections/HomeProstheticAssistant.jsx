import { useState } from 'react'
import { PersonDataPanel } from '@/components/landing/PersonDataPanel'
import { PersonDataPreviewTrigger } from '@/components/landing/PersonDataPreviewTrigger'
import { CreaPrototipoButton } from '@/components/common/CreaPrototipoButton'
import styles from '../HomePage.module.css'

const FEATURES = [
  'Escaneo guiado desde tu celular',
  'Recomendaciones según rutina y deporte',
  'Conexión con talleres ortopédicos aliados',
  'Acompañamiento emocional en cada decisión',
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
          <p className={styles.sectionDesc}>
            Responde unas preguntas sobre tu tipo de amputación, rutina y preferencias. Nuestra IA,
            validada por ortopedistas, te recomienda materiales, forma y funciones.
          </p>

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

          <CreaPrototipoButton variant="accent" className={styles.protoCta} />

          <PersonDataPreviewTrigger onClick={() => setPanelOpen(true)} />
        </div>
      </div>

      <PersonDataPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </section>
  )
}
