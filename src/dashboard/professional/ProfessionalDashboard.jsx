import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ClipboardList,
  FileText,
  Users,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PatientReportPanel } from '@/components/professional/PatientReportPanel'
import { useDatosReporte } from '@/hooks/useDatosReporte'
import {
  buildCaseRowFromReport,
  getPatientDisplayName,
  getReportSummarySubtitle,
  getReportSummaryTitle,
} from '@/services/report/reportDisplay'
import { ROUTES } from '@/routes/paths'
import { PROFESSIONAL_USERS } from '@/prototype/mockData'
import styles from './ProfessionalDashboard.module.css'

const NAV = [
  { id: 'cases', label: 'Casos', icon: <Users size={16} /> },
  { id: 'reports', label: 'Informes', icon: <FileText size={16} /> },
  { id: 'sessions', label: 'Sesiones', icon: <Calendar size={16} /> },
]

export function ProfessionalDashboard() {
  const [section, setSection] = useState('cases')
  const [selectedId, setSelectedId] = useState('report-patient')
  const { report, status, error, fromDemo, reload } = useDatosReporte()

  const caseRows = useMemo(() => {
    if (report) return [buildCaseRowFromReport(report)]
    return PROFESSIONAL_USERS
  }, [report])

  useEffect(() => {
    if (report) setSelectedId('report-patient')
  }, [report])

  const selected =
    caseRows.find((u) => u.id === selectedId) ?? caseRows[0] ?? PROFESSIONAL_USERS[0]

  const navItems = NAV.map((item) => ({
    ...item,
    to: ROUTES.DASHBOARD_PROFESSIONAL,
    isButton: true,
    active: section === item.id,
    onClick: () => setSection(item.id),
  }))

  const reportTitle = report ? getReportSummaryTitle(report) : selected?.name ?? 'Reporte'
  const reportSubtitle = report
    ? getReportSummarySubtitle(report)
    : selected?.prototype ?? ''

  const patientName = report ? getPatientDisplayName(report) : selected?.name

  return (
    <DashboardLayout
      variant="professional"
      title="Panel profesional"
      subtitle="Administración clínica de prototipos inteligentes"
      navItems={navItems}
    >
      <div className={styles.stats}>
        {[
          { label: 'Usuarios activos', value: report ? '1' : '24', icon: <Users size={18} /> },
          { label: 'Prototipos en curso', value: '1', icon: <FileText size={18} /> },
          {
            label: 'Alertas clínicas',
            value: report?.professionalFlags?.requires_pain_review ? '2' : '5',
            icon: <CheckCircle2 size={18} />,
          },
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

      {section === 'reports' && (
        <motion.section className={styles.reportFullCard} layout>
          <header className={styles.reportHeader}>
            <div>
              <p className={styles.detailKicker}>Informe clínico · API</p>
              <h3 className={styles.reportFullTitle}>{reportTitle}</h3>
              {reportSubtitle && <p className={styles.reportFullSub}>{reportSubtitle}</p>}
            </div>
          </header>
          <PatientReportPanel
            report={report}
            status={status}
            error={error}
            fromDemo={fromDemo}
            onReload={reload}
          />
        </motion.section>
      )}

      {section === 'cases' && (
        <div className={styles.casesLayout}>
          <motion.section className={styles.tableCard} layout>
            <h3 className={styles.tableTitle}>
              <ClipboardList size={16} /> Casos y prototipos
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Prótesis</th>
                    <th>Estado</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                  {caseRows.map((row) => (
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
            <p className={styles.detailKicker}>Datos del reporte</p>
            <h3 className={styles.detailName}>{reportTitle}</h3>
            <p className={styles.detailProto}>{reportSubtitle || selected?.status}</p>

            {report && (
              <div className={styles.detailProgress}>
                <div
                  className={styles.rowProgressFill}
                  style={{ width: `${selected?.progress ?? 0}%` }}
                />
              </div>
            )}

            <div className={styles.reportScroll}>
              <PatientReportPanel
                report={report}
                status={status}
                error={error}
                fromDemo={fromDemo}
                onReload={reload}
              />
            </div>

            <div className={styles.detailActions}>
              <button type="button" className={styles.actionBtn}>
                Validar avance
              </button>
              <button
                type="button"
                className={styles.actionBtnGhost}
                onClick={() => setSection('reports')}
              >
                Ver informe completo
              </button>
            </div>

            <h4 className={styles.obsTitle}>Observaciones técnicas</h4>
            <textarea
              className={styles.textarea}
              placeholder={`Notas para ${patientName}…`}
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
              <strong>{patientName}</strong> — Revisión prototipo transtibial · 24 May 16:00
            </li>
            <li>
              <strong>Ana Beltrán</strong> — Entrega fabricación · 26 May 10:00
            </li>
          </ul>
        </motion.section>
      )}

    </DashboardLayout>
  )
}
