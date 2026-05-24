import { env } from '@/shared/constants/env'

function prosthesisApiUrl() {
  const base = env.apiUrl?.replace(/\/$/, '')
  if (base) return `${base}/protesis/generar`
  return '/api/protesis/generar'
}

/**
 * @param {File} file — escaneo .ply del muñón
 * @returns {Promise<{
 *   scan: { url: string, filename: string },
 *   prosthesis: { url: string, filename: string },
 *   ai_design: Record<string, unknown>,
 *   generation: { engine: string }
 * }>}
 */
export async function generateProsthesisFromScan(file) {
  const form = new FormData()
  form.append('archivo', file)

  const response = await fetch(prosthesisApiUrl(), {
    method: 'POST',
    body: form,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || `Error ${response.status} al generar la prótesis`)
  }
  return data
}
