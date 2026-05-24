import { ArrowRight, Sparkles } from 'lucide-react'
import { CreaPrototipoButton } from '@/components/common/CreaPrototipoButton'
import { LandingProstheticArm } from '@/components/landing/LandingProstheticArm'
import styles from '../HomePage.module.css'

const PROSTHETIC_META = [
  { k: 'Tipo', v: 'Transtibial' },
  { k: 'Lado', v: 'Izquierdo' },
]

const AVATAR_COLORS = ['#a8d5ba', '#7ed6a3', '#f4d35e', '#86c79b']

export function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.heroBlobPrimary} aria-hidden />
      <div className={styles.heroBlobAccent} aria-hidden />

      <div className={styles.heroGrid}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <Sparkles className={styles.iconSm} aria-hidden />
            Acompañamiento humano + tecnología
          </span>

          <div className={styles.heroCopy}>
            <h1 id="hero-heading" className={styles.heroTitle}>
              Escanea. Diseña.,{' '}
              <span className={styles.heroTitleAccent}>Visualiza.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Una plataforma de acompañamiento en diseño de prótesis con sentido
              humano.
            </p>
          </div>

          <div className={styles.heroActions}>
            <CreaPrototipoButton variant="accent" />

          </div>


        </div>

        <aside className={styles.heroAside} aria-label="Vista previa de prótesis">
          <div className={`${styles.heroCardsRow} ${styles.heroCardsRowSolo}`}>
            <article
              className={`${styles.mockCard} ${styles.heroProstheticCard}`}
            >
              <header className={styles.mockHead}>
                <div>
                  <p className={styles.cardLabel}>Diseño personalizado</p>
                  <p className={styles.cardTitle}>Tu prótesis</p>
                </div>
                <span className={styles.badge}>IA activa</span>
              </header>

              <div className={styles.heroMetaStrip} role="list">
                {PROSTHETIC_META.map((c) => (
                  <div key={c.k} className={styles.heroMetaItem} role="listitem">
                    <span className={styles.heroMetaKey}>{c.k}</span>
                    <span className={styles.heroMetaVal}>{c.v}</span>
                  </div>
                ))}
              </div>

              <div className={styles.mockPreview}>
                <LandingProstheticArm hideHeader layout="hero" />
              </div>
            </article>
          </div>
        </aside>
      </div>
    </section>
  )
}
