import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useAiCompanion } from '@/hooks/useAiCompanion'
import styles from './AiCompanionPanel.module.css'

const STATUS_LABEL = {
  idle: 'Listo para conectar',
  connecting: 'Conectando a la sala…',
  connected: 'En sesión',
  reconnecting: 'Reconectando…',
  disconnected: 'Desconectado',
  error: 'Error de conexión',
}

const AGENT_STATE_LABEL = {
  idle: 'Disponible',
  initializing: 'Iniciando…',
  listening: 'Escuchando',
  thinking: 'Pensando…',
  speaking: 'Hablando',
}

/**
 * @param {object} props
 * @param {string} props.userId
 * @param {string} props.displayName
 * @param {Record<string, string>} [props.personContext]
 */
export function AiCompanionPanel({ userId, displayName, personContext = {} }) {
  const [draft, setDraft] = useState('')
  const chatEndRef = useRef(null)

  const {
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
    isConfigured,
  } = useAiCompanion({ userId, displayName, personContext })

  const isActive = connectionState === 'connected' || connectionState === 'reconnecting'
  const isBusy = connectionState === 'connecting'

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isActive || !draft.trim()) return
    sendMessage(draft)
    setDraft('')
  }

  const handleConnect = () => {
    if (isActive) return
    connect()
  }

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.avatar}>
            <Bot size={22} />
          </span>
          <div>
            <h2 className={styles.title}>Sofia · Acompañante IA</h2>
            <p className={styles.subtitle}>
              {mode === 'demo'
                ? 'Modo demostración (chat contextual sin LiveKit)'
                : `Sala LiveKit · ${roomName}`}
            </p>
          </div>
        </div>
        <div className={styles.badges}>
          <span
            className={`${styles.badge} ${isActive ? styles.badgeLive : styles.badgeIdle}`}
          >
            {isActive ? <Wifi size={12} /> : <WifiOff size={12} />}
            {STATUS_LABEL[connectionState] ?? connectionState}
          </span>
          {mode === 'livekit' && agentConnected && (
            <span className={`${styles.badge} ${styles.badgeAgent}`}>
              {AGENT_STATE_LABEL[agentState] ?? 'Sofia conectada'}
            </span>
          )}
          {mode === 'livekit' && !agentConnected && isActive && (
            <span className={`${styles.badge} ${styles.badgeIdle}`}>Esperando agente…</span>
          )}
        </div>
      </header>

      {!isConfigured && connectionState === 'idle' && (
        <p className={styles.hint}>
          Configura <code>VITE_LIVEKIT_URL</code> y el endpoint <code>/livekit/token</code> en tu
          backend para audio/video en tiempo real. Mientras tanto puedes usar el chat en modo demo.
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {audioBlocked && isActive && (
        <button type="button" className={styles.audioUnlock} onClick={unlockAudio}>
          Activar audio de Sofia
        </button>
      )}

      <div className={styles.body}>
        <div className={styles.mediaColumn}>
          <div className={styles.videoStack}>
            <div className={styles.videoTile}>
              {mode === 'livekit' && isActive ? (
                <video ref={localVideoRef} className={styles.video} autoPlay muted playsInline />
              ) : (
                <div className={styles.videoPlaceholder}>
                  {isCamOn ? 'Vista previa (demo)' : 'Cámara apagada'}
                </div>
              )}
            </div>
            <div className={styles.videoTile}>
              <p className={styles.videoLabel}>Sofia · IA</p>
              <div ref={agentVideoRef} className={styles.agentVideoHost}>
                {!agentConnected ? (
                  <div className={styles.videoPlaceholder}>
                    <Bot size={32} />
                    <span>Conectando con Sofia…</span>
                  </div>
                ) : (
                  <>
                    <div className={styles.agentAvatar} aria-hidden>
                      <Bot size={40} />
                    </div>
                    {agentState === 'speaking' && (
                      <div className={styles.speakingPulse} aria-hidden />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            {!isActive ? (
              <button
                type="button"
                className={styles.connectBtn}
                onClick={handleConnect}
                disabled={isBusy}
              >
                {isBusy ? (
                  <>
                    <Loader2 size={16} className={styles.spin} /> Conectando…
                  </>
                ) : (
                  'Iniciar sesión con Sofia'
                )}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className={`${styles.controlBtn} ${!isMicOn ? styles.controlOff : ''}`}
                  onClick={toggleMic}
                  aria-label={isMicOn ? 'Silenciar micrófono' : 'Activar micrófono'}
                >
                  {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  type="button"
                  className={`${styles.controlBtn} ${!isCamOn ? styles.controlOff : ''}`}
                  onClick={toggleCam}
                  aria-label={isCamOn ? 'Apagar cámara' : 'Encender cámara'}
                >
                  {isCamOn ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
                <button
                  type="button"
                  className={`${styles.controlBtn} ${styles.hangupBtn}`}
                  onClick={disconnect}
                  aria-label="Finalizar sesión"
                >
                  <PhoneOff size={18} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.chatColumn}>
          <ul className={styles.messages} aria-live="polite">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className={`${styles.message} ${msg.from === 'user'
                  ? styles.messageUser
                  : msg.from === 'system'
                    ? styles.messageSystem
                    : styles.messageAssistant
                  }`}
              >
                <p className={styles.messageText}>{msg.message}</p>
              </li>
            ))}
            {isTyping && !agentConnected && (
              <li className={`${styles.message} ${styles.messageAssistant}`}>
                <p className={styles.typing}>Sofia está escribiendo…</p>
              </li>
            )}
            <li ref={chatEndRef} />
          </ul>

          <form className={styles.composer} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder={
                isActive
                  ? agentConnected
                    ? 'Opcional: escribe un mensaje…'
                    : 'Pregunta sobre materiales, medidas, deporte…'
                  : 'Conecta para chatear'
              }
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={!isActive}
            />
            <button type="submit" className={styles.sendBtn} disabled={!isActive || !draft.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
