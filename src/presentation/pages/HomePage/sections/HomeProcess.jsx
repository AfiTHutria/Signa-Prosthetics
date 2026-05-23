import styles from '../HomePage.module.css'

const STEPS = [
  { n: '01', t: 'Cuéntanos tu historia', d: 'Una conversación inicial gratuita con nuestro equipo.' },
  { n: '02', t: 'Asignamos tu psicólogo', d: 'Especialista en rehabilitación, según tu perfil y horario.' },
  { n: '03', t: 'Diseñamos tu prótesis', d: 'El asistente IA prepara propuestas validadas por expertos.' },
  { n: '04', t: 'Acompañamiento continuo', d: 'Sesiones, recordatorios y seguimiento de bienestar.' },
]

export function HomeProcess() {
  return (
    <section id="proceso" className={styles.section}>
      <div>
        <p className={styles.sectionKicker}>Proceso</p>
        <h2 className={styles.sectionTitle}>Cuatro pasos hacia tu nueva normalidad.</h2>
      </div>
      <div className={styles.processGrid}>
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={i % 2 === 0 ? styles.processStep : `${styles.processStep} ${styles.processStepAlt}`}
          >
            <p className={styles.processNumber}>{s.n}</p>
            <h3 className={styles.processStepTitle}>{s.t}</h3>
            <p className={styles.processStepDesc}>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
