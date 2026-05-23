import {
  ArrowRight,
  Sparkles,
  HeartPulse,
  Activity,
  ShieldCheck,
} from 'lucide-react'
import { CreaPrototipoButton } from '@/components/common/CreaPrototipoButton'
import { LandingProstheticArm } from '@/components/landing/LandingProstheticArm'
import styles from '../HomePage.module.css'

const PROSTHETIC_META = [
  { k: 'Tipo', v: 'Transradial' },
  { k: 'Uso', v: 'Deportivo' },
  { k: 'Material', v: 'Fibra de C.' },
]

const AVATAR_COLORS = ['#a8d5ba', '#7ed6a3', '#f4d35e', '#86c79b']
const CHART_HEIGHTS = [40, 55, 48, 70, 62, 80, 88]
const CHART_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBlobPrimary} aria-hidden />
      <div className={styles.heroBlobAccent} aria-hidden />

      <div className={styles.heroGrid}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <Sparkles className={styles.iconSm} aria-hidden /> Acompañamiento humano + tecnología
          </span>
          <h1 className={styles.heroTitle}>
            Volver a ti, <span className={styles.heroTitleAccent}>paso a paso.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Una plataforma de seguimiento psicológico para personas con amputación, con asistente
            inteligente para el diseño personalizado de tu prótesis.
          </p>

          <div className={styles.heroActions}>
            <CreaPrototipoButton variant="accent" />
            <a href="#protesis" className={styles.btnAccent}>
              Ver asistente IA
              <ArrowRight className={styles.iconSm} aria-hidden />
            </a>
          </div>

          <div className={styles.heroSocial}>
            <div className={styles.avatarStack}>
              {AVATAR_COLORS.map((color, i) => (
                <div
                  key={color}
                  className={styles.avatarDot}
                  style={{ background: color }}
                  aria-hidden={i > 0}
                />
              ))}
            </div>
            <p>
              <strong>+2,400 personas</strong> en proceso de recuperación con nosotros
            </p>
          </div>
        </div>

        <div className={styles.heroAside}>
          <div className={styles.heroCardsRow}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardHead}>
                <div>
                  <p className={styles.cardLabel}>Próxima sesión</p>
                  <p className={styles.cardTitle}>Dra. Lucía Méndez</p>
                  <p className={styles.cardSubtitle}>Psicología de rehabilitación</p>
                </div>
                <span className={styles.badge}>Hoy · 16:30</span>
              </div>

              <div className={styles.chartBox}>
                <p className={styles.cardLabel}>Estado emocional · semana</p>
                <div className={styles.chartBars}>
                  {CHART_HEIGHTS.map((h, i) => (
                    <div key={i} className={styles.chartBar} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className={styles.chartDays}>
                  {CHART_DAYS.map((d, i) => (
                    <span key={`${d}-${i}`}>{d}</span>
                  ))}
                </div>
              </div>

              <div className={styles.statGrid}>
                <div className={styles.statCardAccent}>
                  <Activity className={styles.iconMd} aria-hidden />
                  <p className={styles.statValue}>12</p>
                  <p className={styles.statLabel}>sesiones completadas</p>
                </div>
                <div className={styles.statCardPrimary}>
                  <HeartPulse className={styles.iconMd} aria-hidden />
                  <p className={styles.statValue}>+38%</p>
                  <p className={styles.statLabel}>bienestar reportado</p>
                </div>
              </div>
            </div>

            <div className={`${styles.mockCard} ${styles.heroProstheticCard}`}>
              <div className={styles.mockHead}>
                <p className={styles.cardTitle}>Tu prótesis</p>
                <span className={styles.badge}>IA activa</span>
              </div>

              <div className={styles.mockMetaGrid}>
                {PROSTHETIC_META.map((c) => (
                  <div key={c.k} className={styles.mockMetaCell}>
                    <p className={styles.mockMetaKey}>{c.k}</p>
                    <p className={styles.mockMetaVal}>{c.v}</p>
                  </div>
                ))}
              </div>

              <div className={styles.mockPreview}>
                <LandingProstheticArm hideHeader />
              </div>
            </div>
          </div>

          <div className={styles.floatingChip}>
            <ShieldCheck className={styles.iconMd} aria-hidden />
            <div>
              <p className={styles.floatingChipTitle}>Confidencial</p>
              <p className={styles.floatingChipSub}>Datos cifrados de extremo a extremo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
