import { useState } from 'react'
import { Stethoscope, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLoginRedirect } from '@/hooks/useLoginRedirect'
import { ROLE } from '@/routes/paths'
import { DEMO_ACCOUNTS } from '@/services/auth/credentials'
import styles from './DemoDashboardAccess.module.css'

export function DemoDashboardAccess() {
  const { loginAsUser, loginAsProfessional } = useAuth()
  const { redirectAfterLogin } = useLoginRedirect()
  const [loading, setLoading] = useState(null)

  const enterAs = async (role) => {
    setLoading(role)
    try {
      if (role === ROLE.USER) {
        const demo = DEMO_ACCOUNTS[ROLE.USER]
        await loginAsUser({ email: demo.email, password: demo.password })
        redirectAfterLogin(ROLE.USER)
      } else {
        const demo = DEMO_ACCOUNTS[ROLE.PROFESSIONAL]
        await loginAsProfessional({ email: demo.email, password: demo.password })
        redirectAfterLogin(ROLE.PROFESSIONAL)
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Ver interfaces del sistema</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnUser}
          disabled={Boolean(loading)}
          onClick={() => enterAs(ROLE.USER)}
        >
          <User size={16} aria-hidden />
          {loading === ROLE.USER ? 'Entrando…' : 'Dashboard Usuario'}
        </button>
        <button
          type="button"
          className={styles.btnPro}
          disabled={Boolean(loading)}
          onClick={() => enterAs(ROLE.PROFESSIONAL)}
        >
          <Stethoscope size={16} aria-hidden />
          {loading === ROLE.PROFESSIONAL ? 'Entrando…' : 'Dashboard Profesional'}
        </button>
      </div>
    </div>
  )
}
