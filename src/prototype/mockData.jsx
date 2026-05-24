export const USER_PROTOTYPE = {
  id: 'proto-transtibial-001',
  name: 'Prótesis transtibial · Pierna izquierda',
  status: 'En diseño biomecánico',
  progress: 68,
  phase: 'Revisión clínica — confianza media',
  updatedAt: '2026-05-24',
}

export const USER_TIMELINE = [
  { id: 1, title: 'Escaneo del muñón recibido', date: '12 May', done: true },
  { id: 2, title: 'Modelo STL — miembro izquierdo', date: '15 May', done: true },
  { id: 3, title: 'Modelo STL — prótesis transtibial', date: '18 May', done: true },
  { id: 4, title: 'Revisión profesional (piel y dolor)', date: '24 May', active: true },
  { id: 5, title: 'Fabricación', date: 'Pendiente', done: false },
]

export const USER_COMMENTS = [
  {
    id: 1,
    author: 'Dra. Lucía Méndez',
    text: 'Revisar irritación ocasional y sudoración en zona distal. Ajustar copla para 8 h de uso diario.',
    date: 'Hace 2 h',
  },
  {
    id: 2,
    author: 'IA Signa',
    text: 'Transtibial probable · confianza media. Priorizar comodidad y resistencia para trabajo de pie.',
    date: 'Ayer',
  },
]

export const USER_SESSIONS = [
  { id: 1, title: 'Revisión prototipo transtibial', date: '24 May · 16:00', type: 'Videollamada' },
  { id: 2, title: 'Medición clínica presencial', date: '28 May · 10:30', type: 'Presencial' },
]

export const PROFESSIONAL_USERS = [
  {
    id: 'report-patient',
    name: 'Carlos Mendoza López',
    prototype: 'Transtibial izquierda',
    status: 'Revisión clínica',
    progress: 68,
  },
  {
    id: 'usr-002',
    name: 'Ana Beltrán',
    prototype: 'Transradial derecha',
    status: 'Escaneo',
    progress: 24,
  },
]
