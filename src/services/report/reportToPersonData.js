import { DEMO_REPORT_RAW } from '@/shared/constants/demoReportData'
import { normalizeDatosReporte } from './fetchDatosReporte'

function capitalizeSide(side) {
  if (!side) return ''
  const s = String(side).toLowerCase()
  if (s === 'izquierdo') return 'Izquierda'
  if (s === 'derecho') return 'Derecha'
  return side.charAt(0).toUpperCase() + side.slice(1)
}

/**
 * Convierte el reporte API al formato del formulario de usuario (PersonDataForm).
 * @param {ReturnType<typeof normalizeDatosReporte>} report
 */
export function reportToPersonData(report) {
  if (!report) return {}

  const pp = report.patientProfile
  const ap = report.amputationProfile
  const rl = report.residualLimbStatus
  const fg = report.functionalGoals
  const dp = report.designPreferences
  const pc = report.patientConcerns

  const skinIssues = Array.isArray(rl.skin_issues) ? rl.skin_issues.join(', ') : ''
  const stumpParts = [
    rl.pain_present && `Dolor ${rl.pain_score_0_10}/10`,
    skinIssues && `Piel: ${skinIssues}`,
    rl.sensitivity_areas && `Sensibilidad: ${rl.sensitivity_areas}`,
    rl.volume_changes_reported && 'Cambios de volumen reportados',
  ].filter(Boolean)

  return {
    fullName: pp.full_name ?? '',
    document: 'CC 1.045.892.103',
    email: 'carlos.mendoza@ejemplo.com',
    phone: '+57 310 456 7890',
    age: pp.age != null ? String(pp.age) : '',
    city: 'Medellín',
    amputationType: ap.level_interpreted ?? ap.level_reported ?? '',
    side: capitalizeSide(ap.side),
    amputationDate: ap.time_since_amputation ? `Hace ${ap.time_since_amputation}` : '',
    cause: ap.cause_detail ?? ap.cause_category ?? '',
    stumpCondition: stumpParts.join('. ') || '',
    activityLevel: fg.activity_level ?? '',
    sports: (fg.priority_activities ?? []).join(', '),
    dailyUse: fg.daily_use_expected_hours
      ? `${fg.daily_use_expected_hours} h · ${fg.main_goal ?? ''}`
      : (fg.main_goal ?? ''),
    workEnvironment: (fg.environment ?? []).join(', '),
    prostheticType: 'Transtibial deportiva',
    material: 'Fibra de carbono · polímeros ligeros',
    functions: (dp.top_priorities ?? []).join(', '),
    aesthetic: dp.appearance_preference ?? '',
    doctor: 'Dra. Lucía Méndez',
    institution: 'Centro Reandar · Rehabilitación',
    allergies: 'Ninguna conocida',
    notes: [pc.main_concern, pc.expectations].filter(Boolean).join(' '),
    stumpLength: pp.height_cm ? String(Math.round(Number(pp.height_cm) * 0.12)) : '',
    stumpCircumference: pp.weight_kg ? String(Math.round(Number(pp.weight_kg) * 0.35)) : '',
    dominantSide: pp.dominant_side
      ? String(pp.dominant_side).charAt(0).toUpperCase() + String(pp.dominant_side).slice(1)
      : '',
  }
}

const CARLOS_REPORT = normalizeDatosReporte(DEMO_REPORT_RAW)

/** Valores del formulario de usuario para Carlos Mendoza López. */
export const CARLOS_PERSON_DATA = reportToPersonData(CARLOS_REPORT)
