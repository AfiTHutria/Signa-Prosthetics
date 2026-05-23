import { ArrowRight, CalendarHeart, Sparkles, HeartPulse } from 'lucide-react'
import { CreaPrototipoButton } from '@/components/common/CreaPrototipoButton'
import styles from '../HomePage.module.css'

const ITEMS = [
  {
    icon: CalendarHeart,
    title: 'Sesiones con psicólogos especializados',
    desc: 'Agenda 1 a 1 con profesionales en rehabilitación, duelo y aceptación corporal. Online o presencial.',
    tag: 'Agenda flexible',
    variant: 'light',
  },
  {
    icon: Sparkles,
    title: 'Asistente de diseño de prótesis',
    desc: 'Una guía inteligente que aprende de tu cuerpo, estilo de vida y metas para sugerir la prótesis ideal.',
    tag: 'IA + ortopedia',

  },
  {
    icon: HeartPulse,
    title: 'Seguimiento continuo',
    desc: 'Registro emocional, recordatorios y reportes que tu equipo clínico ve para ajustar el plan.',
    tag: '24/7',
    variant: 'light',
  },
]

export function HomeServices() {
  return (
    <section id="servicios" className={styles.section}>
      <div className={styles.sectionHeaderRow}>
        <div>
          <p className={styles.sectionKicker}>Servicios</p>
          <h2 className={styles.sectionTitle}>Cuidado integral, hecho a tu medida.</h2>
        </div>
        <p className={styles.sectionDesc}>
          Combinamos atención psicológica humana con herramientas digitales que entienden el proceso
          único de cada persona amputada.
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {ITEMS.map(({ icon: Icon, title, desc, tag, variant }) => {
          const isDark = variant === 'dark'
          return (
            <article
              key={title}
              className={isDark ? `${styles.serviceCard} ${styles.serviceCardDark}` : styles.serviceCard}
            >
              <div className={isDark ? styles.serviceIconDark : styles.serviceIcon}>
                <Icon className={styles.iconMd} aria-hidden />
              </div>
              <span className={isDark ? styles.serviceTagDark : styles.serviceTag}>{tag}</span>
              <h3 className={styles.serviceCardTitle}>{title}</h3>
              <p className={isDark ? styles.serviceCardDescDark : styles.serviceCardDesc}>{desc}</p>
              <CreaPrototipoButton
                variant="ghost"
                className={isDark ? styles.serviceLinkDark : styles.serviceLink}
              >
                Crea tu Prototipo <ArrowRight className={styles.iconSm} aria-hidden />
              </CreaPrototipoButton>
            </article>
          )
        })}
      </div>
    </section>
  )
}
