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

const META = [
  { k: 'Tipo', v: 'Transradial' },
  { k: 'Uso', v: 'Deportivo' },
  { k: 'Material', v: 'Fibra de C.' },
]

export function HomeProstheticAssistant() {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <section id="protesis" className={styles.prostheticSection}>
      <div className={styles.prostheticGrid}>
        <div>
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
        </div>

        <div className={styles.prostheticVisual}>
          <div className={styles.prostheticBlob} aria-hidden />
          <div className={styles.mockCard}>
            <div className={styles.mockHead}>
              <p className={styles.cardTitle}>Tu prótesis · Borrador 03</p>
              <span className={styles.badge}>IA activa</span>
            </div>

            <div className={styles.mockMetaGrid}>
              {META.map((c) => (
                <div key={c.k} className={styles.mockMetaCell}>
                  <p className={styles.mockMetaKey}>{c.k}</p>
                  <p className={styles.mockMetaVal}>{c.v}</p>
                </div>
              ))}
            </div>

            <div className={styles.mockPreview}>
              <PersonDataPreviewTrigger onClick={() => setPanelOpen(true)} />
            </div>

            <div className={styles.confidenceBar}>
              <span style={{ fontWeight: 500 }}>Confianza del modelo</span>
              <span className={styles.confidenceValue}>94%</span>
            </div>
          </div>
        </div>
      </div>

      <PersonDataPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </section>
  )
}
