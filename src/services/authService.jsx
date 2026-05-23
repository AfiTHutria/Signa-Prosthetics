import { env } from '@/shared/constants/env'
import { axiosClient } from '@/infrastructure/api/axiosClient'
import { DEMO_ACCOUNTS } from '@/services/auth/credentials'
import { signJwt, verifyJwt } from '@/services/auth/jwt'
import { ROLE } from '@/routes/paths'

function loginWithDemo(email, password, role) {
  const account = DEMO_ACCOUNTS[role]
  if (!account || account.email !== email.trim() || account.password !== password) {
    throw new Error('Credenciales incorrectas para este rol.')
  }
  const token = signJwt({
    sub: account.id,
    email: account.email,
    name: account.name,
    role,
  })
  return {
    token,
    user: { id: account.id, email: account.email, name: account.name, role },
  }
}

export async function loginUser({ email, password }) {
  if (env.apiUrl) {
    try {
      const { data } = await axiosClient.post('/auth/user/login', { email, password })
      return data
    } catch {
      /* fallback demo */
    }
  }
  return loginWithDemo(email, password, ROLE.USER)
}

export async function loginProfessional({ email, password }) {
  if (env.apiUrl) {
    try {
      const { data } = await axiosClient.post('/auth/professional/login', { email, password })
      return data
    } catch {
      /* fallback demo */
    }
  }
  return loginWithDemo(email, password, ROLE.PROFESSIONAL)
}

export function validateToken(token) {
  const payload = verifyJwt(token)
  if (!payload) return null
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  }
}
