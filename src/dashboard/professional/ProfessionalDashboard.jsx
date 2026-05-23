import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  FileText,
  Users,
  Calendar,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/routes/paths'
import { PROFESSIONAL_USERS } from '@/prototype/mockData'
import styles from './ProfessionalDashboard.module.css'

const NAV = [
  { id: 'cases', label: 'Casos', icon: <Users size={16} /> },
  { id: 'reports', label: 'Informes', icon: <FileText size={16} /> },
  { id: 'sessions', label: 'Sesiones', icon: <Calendar size={16} /> },
  { id: 'files', label: 'Archivos', icon: <FolderOpen size={16} /> },
]

export function ProfessionalDashboard() {
  const [section, setSection] = useState('cases')
  const [selectedId, setSelectedId] = useState(PROFESSIONAL_USERS[0]?.id)

  const selected = PROFESSIONAL_USERS.find((u) => u.id === selectedId) ?? PROFESSIONAL_USERS[0]

  const navItems = NAV.map((item) => ({
    ...item,
    to: ROUTES.DASHBOARD_PROFESSIONAL,
    isButton: true,
    active: section === item.id,
    onClick: () => setSection(item.id),
  }))

  return (
    <DashboardLayout
      variant="professional"
      title="Panel profesional"
      subtitle="Administración clínica de prototipos inteligentes"
      navItems={navItems}
    >
      <div className={styles.stats}>
        {[
          { label: 'Usuarios activos', value: '24', icon: <Users size={18} /> },
          { label: 'Prototipos en curso', value: '12', icon: <FileText size={18} /> },
          { label: 'Validaciones hoy', value: '5', icon: <CheckCircle2 size={18} /> },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.statCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className={styles.statIcon}>{stat.icon}</span>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {(section === 'cases' || section === 'reports') && (
        <div className={styles.casesLayout}>
          <motion.section className={styles.tableCard} layout>
            <h3 className={styles.tableTitle}>
              <ClipboardList size={16} /> Casos y prototipos
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Prototipo</th>
                    <th>Estado</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {PROFESSIONAL_USERS.map((row) => (
                    <tr
                      key={row.id}
                      className={row.id === selectedId ? styles.rowSelected : ''}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <td>
                        <span className={styles.userCell}>
                          <span className={styles.avatar}>{row.name.charAt(0)}</span>
                          {row.name}
                        </span>
                      </td>
                      <td>{row.prototype}</td>
                      <td>
                        <span className={styles.badge}>{row.status}</span>
                      </td>
                      <td>
                        <div className={styles.rowProgress}>
                          <div
                            className={styles.rowProgressFill}
                            style={{ width: `${row.progress}%` }}
                          />
                        </div>
                        <span className={styles.rowProgressText}>{row.progress}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          <motion.aside className={styles.detailCard} layout>
            <p className={styles.detailKicker}>Caso seleccionado</p>
            <h3 className={styles.detailName}>{selected.name}</h3>
            <p className={styles.detailProto}>{selected.prototype}</p>
            <div className={styles.detailProgress}>
              <div
                className={styles.rowProgressFill}
                style={{ width: `${selected.progress}%` }}
              />
            </div>
            <p className={styles.detailStatus}>Estado: {selected.status}</p>
            <div className={styles.detailActions}>
              <button type="button" className={styles.actionBtn}>
                Validar avance
              </button>
              <button type="button" className={styles.actionBtnGhost}>
                Ver informe
              </button>
            </div>
            <h4 className={styles.obsTitle}>Observaciones técnicas</h4>
            <textarea
              className={styles.textarea}
              placeholder={`Notas para ${selected.name}…`}
              rows={4}
            />
            <button type="button" className={styles.saveBtn}>
              Guardar observación
            </button>
          </motion.aside>
        </div>
      )}

      {section === 'sessions' && (
        <motion.section className={styles.card} layout>
          <h3 className={styles.cardTitle}>
            <Calendar size={16} /> Sesiones programadas
          </h3>
          <ul className={styles.sessionList}>
            <li>
              <strong>Mariana Ortiz</strong> — Revisión prototipo · 24 May 16:00
            </li>
            <li>
              <strong>Carlos Ruiz</strong> — Entrega fabricación · 26 May 10:00
            </li>
            <li>
              <strong>Ana Beltrán</strong> — Escaneo inicial · 28 May 09:30
            </li>
          </ul>
        </motion.section>
      )}

      {section === 'files' && (
        <motion.section className={styles.card} layout>
          <h3 className={styles.cardTitle}>
            <FolderOpen size={16} /> Archivos clínicos
          </h3>
          <ul className={styles.fileList}>
            <li>mariana_scan.stl · 22 MB</li>
            <li>informe_biomecanico.pdf · 1.2 MB</li>
            <li>ajuste_copla_v3.glb · 8 MB</li>
          </ul>
          <button type="button" className={styles.uploadBtn}>
            Subir archivo clínico
          </button>
        </motion.section>
      )}
    </DashboardLayout>
  )
}
