import { useCallback, useEffect, useRef, useState } from 'react'
import { ConnectionState } from 'livekit-client'
import { LiveKitClient } from '@/infrastructure/livekit/livekitClient'
import { isAgentParticipant } from '@/infrastructure/livekit/agentUtils'
import { fetchLiveKitToken } from '@/infrastructure/livekit/livekitTokenApi'
import { env, isLiveKitConfigured } from '@/shared/constants/env'
import { LIVEKIT_ROOM_PREFIX } from '@/shared/constants/livekit'
import {
  createChatMessage,
  parseCompanionMessage,
} from '@/services/aiCompanion/companionMessages'
import {
  generateCompanionReply,
  getWelcomeMessage,
} from '@/services/aiCompanion/companionBrain'

/**
 * Hook del acompañante IA: conexión LiveKit, medios, chat y fallback local.
 *
 * @param {object} options
 * @param {string} options.userId
 * @param {string} options.displayName
 * @param {Record<string, string>} [options.personContext]
 */
export function useAiCompanion({ userId, displayName, personContext = {} }) {
  const clientRef = useRef(null)
  const localVideoRef = useRef(null)
  const agentVideoRef = useRef(null)
  const useLocalBrainRef = useRef(true)
  const agentWasConnectedRef = useRef(false)

  const [connectionState, setConnectionState] = useState('idle')
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCamOn, setIsCamOn] = useState(true)
  const [agentConnected, setAgentConnected] = useState(false)
  const [agentState, setAgentState] = useState(null)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState(isLiveKitConfigured() ? 'livekit' : 'demo')

  const roomName = `${LIVEKIT_ROOM_PREFIX}-${userId ?? 'guest'}`
  const identity = displayName?.replace(/\s+/g, '-').toLowerCase() || `user-${userId ?? 'guest'}`

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, { ...msg, id: `${msg.timestamp}-${prev.length}` }])
  }, [])

  const sendAssistantReply = useCallback(
    async (text, { viaDataChannel = false } = {}) => {
      const payload = createChatMessage(text, 'assistant')
      appendMessage(payload)

      if (viaDataChannel && clientRef.current?.isConnected) {
        await clientRef.current.publishCompanionData(payload)
      }
    },
    [appendMessage],
  )

  const runLocalBrain = useCallback(
    async (userText) => {
      if (!useLocalBrainRef.current) return
      setIsTyping(true)
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))
      const reply = generateCompanionReply(userText, personContext)
      setIsTyping(false)
      await sendAssistantReply(reply, {
        viaDataChannel: mode === 'livekit' && clientRef.current?.isConnected,
      })
    },
    [personContext, sendAssistantReply, mode],
  )

  const handleTranscription = useCallback(
    (segment) => {
      if (!segment?.text?.trim()) return
      useLocalBrainRef.current = false

      setMessages((prev) => {
        const segId = segment.id ?? segment.text
        const existingIdx = prev.findIndex((m) => m.transcriptionId === segId)

        if (existingIdx >= 0) {
          const next = [...prev]
          next[existingIdx] = {
            ...next[existingIdx],
            message: segment.text,
            pending: !segment.final,
          }
          return next
        }

        return [
          ...prev,
          {
            id: `tr-${segId}-${Date.now()}`,
            type: 'chat',
            message: segment.text,
            from: 'assistant',
            timestamp: Date.now(),
            transcriptionId: segId,
            pending: !segment.final,
          },
        ]
      })
    },
    [],
  )

  const handleIncomingData = useCallback(
    (raw, participant) => {
      const parsed = parseCompanionMessage(raw)
      if (!parsed || parsed.from === 'user') return

      const fromAgent =
        isAgentParticipant(participant) || parsed.from === 'assistant'

      if (fromAgent) {
        useLocalBrainRef.current = false
        appendMessage(parsed)
      }
    },
    [appendMessage],
  )

  const connect = useCallback(async () => {
    setError(null)
    setConnectionState('connecting')

    if (!isLiveKitConfigured()) {
      setMode('demo')
      setConnectionState('connected')
      appendMessage(createChatMessage(getWelcomeMessage(personContext), 'assistant'))
      return
    }

    setMode('livekit')
    useLocalBrainRef.current = true

    try {
      const client = new LiveKitClient()
      clientRef.current = client

      client.setHandlers({
        onConnectionStateChange: (state) => {
          if (state === ConnectionState.Connected) setConnectionState('connected')
          else if (state === ConnectionState.Connecting) setConnectionState('connecting')
          else if (state === ConnectionState.Reconnecting) setConnectionState('reconnecting')
          else if (state === ConnectionState.Disconnected) setConnectionState('disconnected')
        },
        onAgentChange: (agent) => {
          const isNow = Boolean(agent)
          setAgentConnected(isNow)
          if (agent) {
            useLocalBrainRef.current = false
            if (!agentWasConnectedRef.current) {
              appendMessage(
                createChatMessage(
                  'Sofia está en la sala. Habla por el micrófono o escribe en el chat.',
                  'system',
                ),
              )
            }
          }
          agentWasConnectedRef.current = isNow
        },
        onAgentStateChange: setAgentState,
        onTranscription: handleTranscription,
        onDataMessage: handleIncomingData,
        onAudioPlaybackChange: setAudioBlocked,
        onRemoteVideoTrack: (_track, el) => {
          if (agentVideoRef.current && el?.parentElement !== agentVideoRef.current) {
            agentVideoRef.current.innerHTML = ''
            agentVideoRef.current.appendChild(el)
          }
        },
        onDisconnected: () => {
          setConnectionState('disconnected')
          setAgentConnected(false)
        },
      })

      client.createRoom()

      const { token, url } = await fetchLiveKitToken(roomName, identity)
      const serverUrl = url || env.livekitUrl

      await client.connect(serverUrl, token)
      await client.startAudio()
      await client.enableMedia()

      if (localVideoRef.current) {
        client.attachLocalVideo(localVideoRef.current)
      }

      if (!client.canPlaybackAudio) {
        setAudioBlocked(true)
      }

      setConnectionState('connected')

      if (client.activeAgent) {
        useLocalBrainRef.current = false
        setAgentConnected(true)
        agentWasConnectedRef.current = true
      } else {
        appendMessage(
          createChatMessage('Conectado. Esperando a Sofia…', 'system'),
        )
      }
    } catch (err) {
      setConnectionState('error')
      setError(err?.message ?? 'Error al conectar con LiveKit')
      clientRef.current?.disconnect()
      clientRef.current = null
    }
  }, [roomName, identity, personContext, appendMessage, handleIncomingData, handleTranscription])

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect()
    clientRef.current = null
    setConnectionState('disconnected')
    setAgentConnected(false)
    setAgentState(null)
    agentWasConnectedRef.current = false
    useLocalBrainRef.current = true
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim()
      if (!trimmed) return

      const userMsg = createChatMessage(trimmed, 'user')
      appendMessage(userMsg)

      if (mode === 'livekit' && clientRef.current?.isConnected) {
        if (agentConnected) {
          await clientRef.current.sendTextToRoom(trimmed)
        } else {
          await clientRef.current.publishCompanionData(userMsg)
        }
      }

      if (useLocalBrainRef.current) {
        await runLocalBrain(trimmed)
      }
    },
    [appendMessage, mode, runLocalBrain, agentConnected],
  )

  const unlockAudio = useCallback(async () => {
    try {
      await clientRef.current?.startAudio()
      setAudioBlocked(false)
    } catch {
      setError('No se pudo activar el audio. Haz clic de nuevo o revisa permisos del navegador.')
    }
  }, [])

  const toggleMic = useCallback(async () => {
    if (mode === 'demo') {
      setIsMicOn((v) => !v)
      return
    }
    const next = !isMicOn
    await clientRef.current?.setMicrophoneEnabled(next)
    setIsMicOn(next)
  }, [isMicOn, mode])

  const toggleCam = useCallback(async () => {
    if (mode === 'demo') {
      setIsCamOn((v) => !v)
      return
    }
    const next = !isCamOn
    await clientRef.current?.setCameraEnabled(next)
    setIsCamOn(next)
    if (next && localVideoRef.current) {
      clientRef.current?.attachLocalVideo(localVideoRef.current)
    }
  }, [isCamOn, mode])

  useEffect(() => {
    return () => {
      clientRef.current?.disconnect()
    }
  }, [])

  return {
    connect,
    disconnect,
    sendMessage,
    toggleMic,
    toggleCam,
    connectionState,
    error,
    messages,
    isMicOn,
    isCamOn,
    agentConnected,
    agentState,
    audioBlocked,
    unlockAudio,
    isTyping,
    mode,
    roomName,
    localVideoRef,
    agentVideoRef,
    isConfigured: isLiveKitConfigured(),
  }
}
