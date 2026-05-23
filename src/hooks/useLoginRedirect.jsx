import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrototypeAccessStore } from '@/store/prototypeAccessStore'
import { getDashboardPathForRole } from '@/utils/authPaths'

export function useLoginRedirect() {
  const navigate = useNavigate()

  const redirectAfterLogin = useCallback(
    (role) => {
      usePrototypeAccessStore.getState().close()
      navigate(getDashboardPathForRole(role), { replace: true })
    },
    [navigate],
  )

  return { redirectAfterLogin }
}
