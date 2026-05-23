import { Link, useNavigate } from 'react-router-dom'
import { ProfessionalLoginForm } from '@/components/forms/ProfessionalLoginForm'
import { ROUTES } from '@/routes/paths'
import styles from './AuthPage.module.css'

export function AuthProfessionalPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <ProfessionalLoginForm onBack={() => navigate(ROUTES.HOME)} />
        <Link to={ROUTES.HOME} className={styles.homeLink}>
          Volver al landing
        </Link>
      </div>
    </div>
  )
}
