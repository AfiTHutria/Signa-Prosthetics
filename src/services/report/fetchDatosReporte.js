import { env } from '@/shared/constants/env'
import { DEMO_REPORT_RAW } from '@/shared/constants/demoReportData'

const NGROK_HEADER = { 'ngrok-skip-browser-warning': 'true' }

/** Si la API falla, usar datos de Carlos Mendoza (demo). */
const USE_DEMO_FALLBACK = import.meta.env.VITE_REPORT_FALLBACK_DEMO !== 'false'

/**
 * Normaliza la respuesta de /datos_reporte (claves con espacios incluidas).
 * @param {unknown} raw
 */
export function normalizeDatosReporte(raw) {
  if (!raw || typeof raw !== 'object') return null

  const data = /** @type {Record<string, unknown>} */ (raw.data ?? raw)

  return {
    patientProfile: data.patient_profile ?? {},
    amputationProfile: data.amputation_profile ?? {},
    residualLimbStatus: data.residual_limb_status ?? {},
    functionalGoals: data.functional_goals ?? {},
    designPreferences: data.design_preferences ?? {},
    patientConcerns: data.patient_concerns ?? {},
    professionalFlags: data.professional_flags ?? {},
    modeloMiembro: String(data['modelo miembro'] ?? data.modelo_miembro ?? '').trim(),
    modeloProtesis: String(data['modelo protesis'] ?? data.modelo_protesis ?? '').trim(),
  }
}

/**
 * @returns {Promise<{ report: ReturnType<typeof normalizeDatosReporte>, fromDemo: boolean }>}
 */
export async function fetchDatosReporte(url = env.reportApiUrl) {
  if (!url) {
    if (USE_DEMO_FALLBACK) {
      const report = normalizeDatosReporte(DEMO_REPORT_RAW)
      if (report) return { report, fromDemo: true }
    }
    throw new Error('Configura VITE_REPORT_API_URL en tu archivo .env')
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...NGROK_HEADER,
      },
    })

    if (!response.ok) {
      throw new Error(`Error ${response.status}: no se pudo cargar el reporte`)
    }

    const json = await response.json()
    const normalized = normalizeDatosReporte(json)

    if (!normalized) {
      throw new Error('La API no devolvió un reporte válido')
    }

    return { report: normalized, fromDemo: false }
  } catch (err) {
    if (USE_DEMO_FALLBACK) {
      const report = normalizeDatosReporte(DEMO_REPORT_RAW)
      if (report) return { report, fromDemo: true }
    }
    throw err
  }
}
