import { Link, useNavigate } from 'react-router-dom'
import { UserLoginForm } from '@/components/forms/UserLoginForm'
import { ROUTES } from '@/routes/paths'
import styles from './AuthPage.module.css'

export function AuthUserPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <UserLoginForm onBack={() => navigate(ROUTES.HOME)} />
        <Link to={ROUTES.HOME} className={styles.homeLink}>
          Volver al landing
        </Link>
      </div>
    </div>
  )
}
