import { Quote } from 'lucide-react'
import styles from '../HomePage.module.css'

const STATS = [
  { k: '98%', v: 'satisfacción con psicólogos' },
  { k: '+2.4k', v: 'personas acompañadas' },
  { k: '12', v: 'ciudades activas' },
  { k: '24/7', v: 'soporte emocional' },
]

export function HomeTestimonial() {
  return (
    <section id="testimonios" className={styles.testimonialWrap}>
      <div className={styles.testimonialCard}>
        <div className={styles.testimonialGrid}>
          <div>
            <Quote className={styles.quoteIcon} aria-hidden />
            <p className={styles.quoteText}>
              &ldquo;Necesitaba volver a caminar y trabajar de pie con estabilidad. Con el diseño
              transtibial y el seguimiento del equipo, recuperé confianza en mi día a día.&rdquo;
            </p>
            <div className={styles.quoteAuthor}>
              <div className={styles.quoteAvatar} aria-hidden />
              <div>
                <p className={styles.quoteName}>Carlos Mendoza López</p>
                <p className={styles.quoteRole}>Comercio · pierna izquierda</p>
              </div>
            </div>
          </div>
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.k} className={styles.statBox}>
                <p className={styles.statBoxValue}>{s.k}</p>
                <p className={styles.statBoxLabel}>{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
