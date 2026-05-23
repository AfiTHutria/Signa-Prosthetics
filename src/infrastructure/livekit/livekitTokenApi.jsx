import { axiosClient } from '@/infrastructure/api/axiosClient'
import { env } from '@/shared/constants/env'

/**
 * Obtiene JWT y URL de LiveKit desde el backend.
 * Endpoint esperado: GET /livekit/token?room=&identity=
 */
export async function fetchLiveKitToken(roomName, identity) {
  if (!env.apiUrl) {
    throw new Error(
      'Configura VITE_API_URL y el servidor de tokens LiveKit (ver server/README.md).',
    )
  }

  const { data } = await axiosClient.get('/livekit/token', {
    params: { room: roomName, identity },
  })

  if (!data?.token || !data?.url) {
    throw new Error('El servidor no devolvió token o URL de LiveKit.')
  }

  return { token: data.token, url: data.url }
}
