import { useCallback, useEffect, useRef, useState } from 'react'
import { ConnectionState } from 'livekit-client'
import { LiveKitClient } from '@/infrastructure/livekit/livekitClient'
import { fetchIntakeToken } from '@/infrastructure/livekit/intakeTokenApi'
import { isIntakeConfigured } from '@/shared/constants/env'

const AGENT_JOIN_TIMEOUT_MS = 15000

/**
 * Hook de entrevista de voz (signa-api intake).
 * Sesión UUID, micrófono solo, timeout de agente 15s.
 */
export function useVoiceIntake() {
  const clientRef = useRef(null)
  const agentJoinTimeoutRef = useRef(null)
  const agentJoinedRef = useRef(false)

  const [sessionId, setSessionId] = useState(() => crypto.randomUUID())
  const [status, setStatus] = useState('Listo para iniciar')
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [agentStatus, setAgentStatus] = useState('')
  const [audioBlocked, setAudioBlocked] = useState(false)

  const clearAgentJoinTimeout = useCallback(() => {
    if (agentJoinTimeoutRef.current) {
      clearTimeout(agentJoinTimeoutRef.current)
      agentJoinTimeoutRef.current = null
    }
  }, [])

  const markAgentJoined = useCallback(
    (participantIdentity) => {
      agentJoinedRef.current = true
      clearAgentJoinTimeout()
      setAgentStatus(
        participantIdentity
          ? `El asistente está en la sala (${participantIdentity}). Puedes hablar.`
          : 'El asistente está en la sala. Puedes hablar.',
      )
    },
    [clearAgentJoinTimeout],
  )

  const startAgentJoinTimeout = useCallback(() => {
    clearAgentJoinTimeout()
    agentJoinedRef.current = false
    agentJoinTimeoutRef.current = setTimeout(() => {
      if (!agentJoinedRef.current && clientRef.current?.isConnected) {
        setError(
          'El asistente no se conectó. ¿Está corriendo npm run agent:dev o npm run dev:all en signa-api?',
        )
        setAgentStatus('Sin asistente en la sala.')
      }
    }, AGENT_JOIN_TIMEOUT_MS)
  }, [clearAgentJoinTimeout])

  const resetUi = useCallback(() => {
    agentJoinedRef.current = false
    setAudioBlocked(false)
    setIsActive(false)
    setAgentStatus('')
    setStatus('Listo para iniciar')
  }, [])

  const disconnect = useCallback(() => {
    clearAgentJoinTimeout()
    clientRef.current?.disconnect()
    clientRef.current = null
    resetUi()
  }, [clearAgentJoinTimeout, resetUi])

  const startIntake = useCallback(async () => {
    if (!isIntakeConfigured()) {
      setError('Configura VITE_INTAKE_API_URL apuntando a signa-api.')
      return
    }

    setError(null)
    setIsConnecting(true)
    setStatus('Conectando...')
    setAudioBlocked(false)

    try {
      const identity = `patient-${Math.random().toString(36).slice(2, 8)}`
      const { token, url } = await fetchIntakeToken(sessionId, identity)

      const client = new LiveKitClient()
      clientRef.current = client

      client.setHandlers({
        onConnectionStateChange: (state) => {
          if (state === ConnectionState.Connected) {
            setStatus('Conectado — esperando al asistente...')
            setIsActive(true)

            const agent = client.activeAgent
            if (agent) {
              markAgentJoined(agent.identity)
            } else {
              setAgentStatus('Esperando al asistente...')
              startAgentJoinTimeout()
            }

            if (!client.canPlaybackAudio) {
              setAudioBlocked(true)
            }
          } else if (state === ConnectionState.Disconnected) {
            clearAgentJoinTimeout()
            setStatus('Desconectado')
            resetUi()
          }
        },
        onAgentChange: (agent) => {
          if (agent) {
            markAgentJoined(agent.identity)
          } else if (clientRef.current?.isConnected) {
            agentJoinedRef.current = false
            setAgentStatus('Esperando al asistente...')
          }
        },
        onAudioPlaybackChange: (blocked) => {
          setAudioBlocked(blocked)
        },
        onDisconnected: () => {
          clearAgentJoinTimeout()
          setStatus('Desconectado')
          resetUi()
        },
      })

      client.createRoom()
      await client.connect(url, token)
      await client.enableMicrophoneOnly()

      if (!client.canPlaybackAudio) {
        setAudioBlocked(true)
      }

      setStatus('Entrevista en curso')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error de conexión')
      disconnect()
    } finally {
      setIsConnecting(false)
    }
  }, [
    sessionId,
    markAgentJoined,
    startAgentJoinTimeout,
    clearAgentJoinTimeout,
    resetUi,
    disconnect,
  ])

  const endIntake = useCallback(() => {
    disconnect()
  }, [disconnect])

  const newSession = useCallback(() => {
    disconnect()
    setSessionId(crypto.randomUUID())
    setError(null)
  }, [disconnect])

  const unlockAudio = useCallback(async () => {
    try {
      await clientRef.current?.startAudio()
      setAudioBlocked(false)
    } catch (err) {
      console.error('Failed to start audio playback:', err)
      setError('No se pudo activar el audio. Revisa permisos del navegador.')
    }
  }, [])

  useEffect(() => {
    return () => {
      clearAgentJoinTimeout()
      clientRef.current?.disconnect()
    }
  }, [clearAgentJoinTimeout])

  return {
    sessionId,
    status,
    error,
    isActive,
    isConnecting,
    agentStatus,
    audioBlocked,
    isConfigured: isIntakeConfigured(),
    startIntake,
    endIntake,
    newSession,
    unlockAudio,
  }
}
