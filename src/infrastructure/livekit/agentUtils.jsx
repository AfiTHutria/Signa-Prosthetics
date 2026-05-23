import { LIVEKIT_AGENT_IDENTITY } from '@/shared/constants/livekit'

/** Participante que actúa como agente IA en la sala */
export function isAgentParticipant(participant) {
  if (!participant) return false
  if (participant.isAgent) return true
  const id = (participant.identity ?? '').toLowerCase()
  return (
    id === LIVEKIT_AGENT_IDENTITY ||
    id.includes('agent') ||
    id.includes('assistant') ||
    id.includes('sofia')
  )
}
