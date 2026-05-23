import { Room } from 'livekit-client'
import { env } from '@/shared/constants/env'

export function createLiveKitRoom(options = {}) {
  return new Room({
    adaptiveStream: true,
    dynacast: true,
    ...options,
  })
}

export function getLiveKitUrl() {
  return env.livekitUrl
}
