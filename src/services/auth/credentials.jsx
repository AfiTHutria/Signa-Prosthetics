import { ROLE } from '@/routes/paths'

export const DEMO_ACCOUNTS = {
  [ROLE.USER]: {
    email: 'usuario@signa.com',
    password: 'usuario123',
    name: 'Carlos Mendoza López',
    id: 'usr-carlos-001',
  },
  [ROLE.PROFESSIONAL]: {
    email: 'profesional@signa.com',
    password: 'profesional123',
    name: 'Dra. Lucía Méndez',
    id: 'pro-001',
  },
}
