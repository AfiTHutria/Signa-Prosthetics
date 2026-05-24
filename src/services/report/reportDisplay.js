/**
 * Nombre para mostrar en UI (prioriza full_name del API).
 * @param {ReturnType<import('./fetchDatosReporte').normalizeDatosReporte>} report
 */
export function getPatientDisplayName(report) {
  const name = report?.patientProfile?.full_name
  if (name && String(name).trim()) return String(name).trim()
  return 'Paciente'
}

/**
 * @param {ReturnType<import('./fetchDatosReporte').normalizeDatosReporte>} report
 */
export function getReportSummaryTitle(report) {
  if (!report) return 'Reporte clínico'
  const name = getPatientDisplayName(report)
  const ap = report.amputationProfile
  const pp = report.patientProfile
  const meta = [
    ap.level_interpreted,
    ap.side && `lado ${ap.side}`,
    pp.age && `${pp.age} años`,
  ]
    .filter(Boolean)
    .join(' · ')
  return meta ? `${name} — ${meta}` : name
}

/**
 * @param {ReturnType<import('./fetchDatosReporte').normalizeDatosReporte>} report
 */
export function getReportSummarySubtitle(report) {
  if (!report) return ''
  const ap = report.amputationProfile
  const pp = report.patientProfile
  const parts = [
    pp.occupation_or_daily_role,
    ap.cause_detail,
    ap.time_since_amputation && `amputación hace ${ap.time_since_amputation}`,
  ].filter(Boolean)
  return parts.join(' · ')
}

/**
 * Fila de tabla de casos a partir del reporte API.
 * @param {ReturnType<import('./fetchDatosReporte').normalizeDatosReporte>} report
 */
export function buildCaseRowFromReport(report) {
  const ap = report.amputationProfile
  const pf = report.professionalFlags
  return {
    id: 'report-patient',
    name: getPatientDisplayName(report),
    prototype: ap.level_interpreted ?? ap.level_reported ?? 'Prótesis',
    status:
      pf.requires_skin_review || pf.requires_pain_review
        ? 'Revisión clínica'
        : `Confianza ${pf.information_confidence ?? '—'}`,
    progress: 68,
  }
}
