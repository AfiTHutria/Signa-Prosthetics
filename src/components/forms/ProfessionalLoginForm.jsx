import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { ROLE } from '@/routes/paths'
import { DEMO_ACCOUNTS } from '@/services/auth/credentials'
import styles from './AuthForm.module.css'

export function ProfessionalLoginForm({ onBack }) {
  const { loginAsProfessional, isLoading, error, clearError } = useAuth()
  const { redirectAfterLogin } = useLoginRedirect()
  const demo = DEMO_ACCOUNTS[ROLE.PROFESSIONAL]
  const [email, setEmail] = useState(demo.email)
  const [password, setPassword] = useState(demo.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    try {
      await loginAsProfessional({ email, password })
      redirectAfterLogin(ROLE.PROFESSIONAL)
    } catch {
      /* error en store */
    }
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
    >
      <button type="button" className={styles.back} onClick={onBack}>
        ← Volver
      </button>
      <h3 className={styles.formTitle}>Acceso Profesional</h3>
      <p className={styles.formDesc}>Panel clínico para validar prototipos y casos.</p>

      <label className={styles.label}>
        Email institucional
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label className={styles.label}>
        Contraseña
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitPro} disabled={isLoading}>
        {isLoading ? 'Validando…' : 'Entrar al panel'}
      </button>

      <p className={styles.hint}>
        Demo: {demo.email} / {demo.password}
      </p>
    </motion.form>
  )
}
