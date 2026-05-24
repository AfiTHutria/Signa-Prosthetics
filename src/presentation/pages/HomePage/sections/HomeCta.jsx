import { Cpu, Layers, ShieldCheck } from 'lucide-react'
import { CreaPrototipoButton } from '@/components/common/CreaPrototipoButton'
import { RoleAccessButtons } from '@/components/common/RoleAccessButtons'
import { DemoDashboardAccess } from '@/components/common/DemoDashboardAccess'
import styles from '../HomePage.module.css'

const FEATURES = [

  { icon: Layers, text: 'Visualización 3D de tu muñón en tiempo real' },
  { icon: ShieldCheck, text: 'Seguimiento clínico con profesionales ' },
]

export function HomeCta() {
  return (
    <section id="prototipo" className={styles.ctaSection}>
      <div className={styles.ctaPanel}>
        <div className={styles.ctaGrid}>
          <div>
            <p className={styles.sectionKicker}>Plataforma Signa</p>
            <h2 className={styles.ctaTitle}>
              De la idea al  <span className={styles.ctaTitleAccent}>prediseño</span>
            </h2>
            <p className={styles.ctaDesc}>
              Crea, visualiza y da seguimiento a tu prótesis con dashboards separados: uno para
              usuarios y otro para profesionales.
            </p>
            <ul className={styles.ctaFeatures}>
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className={styles.ctaFeatureItem}>
                  <Icon className={styles.iconSm} size={16} aria-hidden />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.ctaActionCard}>

            <p className={styles.ctaActionLabel}>Acceso por perfil</p>
            <p className={styles.ctaActionHint}>
              Cada perfil tiene su login y panel independiente.
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}
