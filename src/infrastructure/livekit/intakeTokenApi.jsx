import { env } from '@/shared/constants/env'

/**
 * Obtiene JWT y URL de LiveKit desde signa-api.
 * Endpoint: GET ${VITE_INTAKE_API_URL}/api/livekit/token?room=&identity=
 */
export async function fetchIntakeToken(room, identity) {
  if (!env.intakeApiUrl) {
    throw new Error(
      'Configura VITE_INTAKE_API_URL apuntando a signa-api (ver docs/CONFIGURACION-API.md).',
    )
  }

  const base = env.intakeApiUrl.replace(/\/$/, '')
  const url = `${base}/api/livekit/token?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}`

  const response = await fetch(url)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? 'No se pudo obtener el token de LiveKit')
  }

  const data = await response.json()

  if (!data?.token || !data?.url) {
    throw new Error('El servidor no devolvió token o URL de LiveKit.')
  }

  return { token: data.token, url: data.url }
}
