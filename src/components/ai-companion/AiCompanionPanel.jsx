import { Loader2, Mic } from 'lucide-react'
import { useVoiceIntake } from '@/hooks/useVoiceIntake'
import styles from './AiCompanionPanel.module.css'

export function AiCompanionPanel() {
  const {
    status,
    error,
    isActive,
    isConnecting,
    agentStatus,
    audioBlocked,
    isConfigured,
    startIntake,
    endIntake,
    newSession,
    unlockAudio,
  } = useVoiceIntake()

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Signa</p>
        <h2 className={styles.title}>Entrevista de evaluación protésica</h2>
        <p className={styles.subtitle}>
          Conversación guiada en español para recopilar información clínica de forma natural.
        </p>
      </header>

      <div className={styles.card}>
        <p className={styles.status}>{status}</p>

        {error && <p className={styles.error}>{error}</p>}

        {!isConfigured && !isActive && (
          <p className={styles.hint}>
            Configura <code>VITE_INTAKE_API_URL</code> apuntando a signa-api y ejecuta{' '}
            <code>npm run dev:all</code> en el proyecto signa-api.
          </p>
        )}

        {!isActive ? (
          <div className={styles.idlePanel}>
            <p>
              Al iniciar, se activará tu micrófono y un asistente de voz te hará preguntas una a
              la vez.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={startIntake}
              disabled={isConnecting || !isConfigured}
            >
              {isConnecting ? (
                <>
                  <Loader2 size={16} className={styles.spin} /> Conectando…
                </>
              ) : (
                'Iniciar entrevista'
              )}
            </button>
            <button type="button" className={styles.btnSecondary} onClick={newSession}>
              Nueva sesión
            </button>
          </div>
        ) : (
          <div className={styles.activePanel}>
            <div className={styles.pulseRing}>
              <div className={styles.micIcon} aria-hidden="true">
                <Mic size={32} />
              </div>
            </div>
            <p className={styles.agentStatus}>{agentStatus}</p>
            {audioBlocked && (
              <button type="button" className={styles.btnSecondary} onClick={unlockAudio}>
                Activar audio
              </button>
            )}
            <button type="button" className={styles.btnDanger} onClick={endIntake}>
              Finalizar entrevista
            </button>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Esta herramienta no sustituye una evaluación clínica profesional.</p>
      </footer>
    </section>
  )
}
