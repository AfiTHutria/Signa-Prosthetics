import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Bot,
  Box,
  Calendar,
  ClipboardList,
  FileUp,
  MessageSquare,
  History,
  Layers3,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PersonDataForm } from '@/components/landing/PersonDataForm'
import { AiCompanionPanel } from '@/components/ai-companion/AiCompanionPanel'
import { ROUTES } from '@/routes/paths'
import { useAuth } from '@/hooks/useAuth'
import {
  USER_COMMENTS,
  USER_PROTOTYPE,
  USER_SESSIONS,
  USER_TIMELINE,
} from '@/prototype/mockData'
import { DEMO_PERSON_DATA } from '@/shared/constants/personDataFields'
import { useDatosReporte } from '@/hooks/useDatosReporte'
import { reportToPersonData } from '@/services/report/reportToPersonData'
import styles from './UserDashboard.module.css'

const NAV = [
  { id: 'overview', label: 'Resumen', icon: <Activity size={16} /> },
  { id: 'assistant', label: 'Asistente IA', icon: <Bot size={16} /> },
  { id: 'timeline', label: 'Timeline', icon: <History size={16} /> },
  { id: 'files', label: 'Archivos', icon: <FileUp size={16} /> },
]

export function UserDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('overview')
  const { report } = useDatosReporte()

  const personValues = {
    ...DEMO_PERSON_DATA,
    ...(report ? reportToPersonData(report) : {}),
    fullName: user?.name ?? DEMO_PERSON_DATA.fullName,
    email: user?.email?.includes('@') ? user.email : DEMO_PERSON_DATA.email,
  }

  const navItems = NAV.map((item) => ({
    ...item,
    to: ROUTES.DASHBOARD_USER,
    end: true,
    onClick: () => setSection(item.id),
    isButton: true,
    active: section === item.id,
  }))

  return (
    <DashboardLayout
      variant="user"
      title="Mi prototipo"
      subtitle="Panel de usuario · seguimiento biomecánico"
      navItems={navItems}
    >
      <motion.div
        className={styles.welcome}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className={styles.welcomeText}>
          <p className={styles.welcomeHi}>Hola, {user?.name?.split(' ')[0] ?? 'Usuario'}</p>
          <p className={styles.welcomeSub}>
            Tu prototipo <strong>{USER_PROTOTYPE.id}</strong> está en fase de{' '}
            {USER_PROTOTYPE.phase.toLowerCase()}.
          </p>
        </div>
        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <span className={styles.quickValue}>{USER_PROTOTYPE.progress}%</span>
            <span className={styles.quickLabel}>Progreso</span>
          </div>
          <div className={styles.quickStat}>
            <span className={styles.quickValue}>2</span>
            <span className={styles.quickLabel}>Sesiones</span>
          </div>
          <div className={styles.quickStat}>
            <span className={styles.quickValue}>3</span>
            <span className={styles.quickLabel}>Versiones</span>
          </div>
        </div>
      </motion.div>

      {(section === 'overview' || section === 'assistant') && section === 'assistant' && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          layout
        >
          <AiCompanionPanel
            userId={user?.id ?? 'demo-user'}
            displayName={user?.name ?? personValues.fullName}
            personContext={personValues}
          />
        </motion.section>
      )}

      {(section === 'overview' || section === 'data') && (
        <div className={styles.grid}>
          {section === 'overview' && (
            <motion.section
              className={styles.heroCard}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <p className={styles.kicker}>
                  <Layers3 size={14} /> Estado actual
                </p>
                <h2 className={styles.protoName}>{USER_PROTOTYPE.name}</h2>
                <p className={styles.status}>{USER_PROTOTYPE.status}</p>
                <div className={styles.progressWrap}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${USER_PROTOTYPE.progress}%` }}
                    />
                  </div>
                  <span className={styles.progressLabel}>{USER_PROTOTYPE.progress}%</span>
                </div>
                <p className={styles.phase}>Fase: {USER_PROTOTYPE.phase}</p>
              </div>
            </motion.section>
          )}


        </div>
      )}

      {(section === 'overview' || section === 'timeline') && (
        <div className={styles.grid}>
          <motion.section className={styles.card} layout>
            <h3 className={styles.cardTitle}>
              <History size={16} /> Timeline del prototipo
            </h3>
            <ul className={styles.timeline}>
              {USER_TIMELINE.map((step) => (
                <li
                  key={step.id}
                  className={`${styles.timelineItem} ${step.active ? styles.timelineActive : ''
                    } ${step.done ? styles.timelineDone : ''}`.trim()}
                >
                  <span className={styles.timelineDot} />
                  <div>
                    <p className={styles.timelineTitle}>{step.title}</p>
                    <p className={styles.timelineDate}>{step.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section className={styles.card} layout>
            <h3 className={styles.cardTitle}>
              <MessageSquare size={16} /> Comentarios del profesional
            </h3>
            <ul className={styles.comments}>
              {USER_COMMENTS.map((c) => (
                <li key={c.id} className={styles.comment}>
                  <p className={styles.commentAuthor}>{c.author}</p>
                  <p className={styles.commentText}>{c.text}</p>
                  <p className={styles.commentDate}>{c.date}</p>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section className={styles.card} layout>
            <h3 className={styles.cardTitle}>
              <Calendar size={16} /> Sesiones
            </h3>
            <ul className={styles.sessions}>
              {USER_SESSIONS.map((s) => (
                <li key={s.id} className={styles.session}>
                  <p className={styles.sessionTitle}>{s.title}</p>
                  <p className={styles.sessionMeta}>
                    {s.date} · {s.type}
                  </p>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>
      )}

      {(section === 'overview' || section === 'files') && (
        <div className={styles.grid}>
          <motion.section className={`${styles.card} ${styles.uploadCard}`} layout>
            <h3 className={styles.cardTitle}>
              <FileUp size={16} /> Subir archivos
            </h3>
            <div className={styles.dropzone}>
              <Box size={28} className={styles.dropIcon} />
              <p>Arrastra imágenes o informes clínicos</p>
              <button type="button" className={styles.uploadBtn}>
                Seleccionar archivos
              </button>
            </div>
          </motion.section>

          <motion.section className={styles.card} layout>
            <h3 className={styles.cardTitle}>Historial de versiones</h3>
            <ul className={styles.history}>
              <li>v3 · Ajuste de copla — 20 May 2026</li>
              <li>v2 · Optimización IA — 15 May 2026</li>
              <li>v1 · Escaneo inicial — 12 May 2026</li>
            </ul>
          </motion.section>
        </div>
      )}
    </DashboardLayout>
  )
}
