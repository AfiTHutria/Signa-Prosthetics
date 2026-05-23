export const USER_PROTOTYPE = {
  id: 'proto-ax7-003',
  name: 'Prótesis AX-7 · Brazo transradial',
  status: 'En diseño biomecánico',
  progress: 68,
  phase: 'Validación estructural',
  updatedAt: '2026-05-20',
}

export const USER_TIMELINE = [
  { id: 1, title: 'Escaneo 3D recibido', date: '12 May', done: true },
  { id: 2, title: 'Modelo STL generado', date: '15 May', done: true },
  { id: 3, title: 'Ajuste biomecánico IA', date: '18 May', done: true },
  { id: 4, title: 'Revisión profesional', date: '22 May', active: true },
  { id: 5, title: 'Fabricación', date: 'Pendiente', done: false },
]

export const USER_COMMENTS = [
  {
    id: 1,
    author: 'Dra. Lucía Méndez',
    text: 'El muñón STL tiene buena resolución. Ajustaremos la copla 2 mm.',
    date: 'Hace 2 h',
  },
  {
    id: 2,
    author: 'IA Signa',
    text: 'Confianza del modelo: 94%. Material recomendado: fibra de carbono.',
    date: 'Ayer',
  },
]

export const USER_SESSIONS = [
  { id: 1, title: 'Revisión de prototipo', date: '24 May · 16:00', type: 'Videollamada' },
  { id: 2, title: 'Ajuste postural', date: '28 May · 10:30', type: 'Presencial' },
]

export const PROFESSIONAL_USERS = [
  {
    id: 'usr-001',
    name: 'Mariana Ortiz',
    prototype: 'AX-7 Brazo',
    status: 'En revisión',
    progress: 68,
  },
  {
    id: 'usr-002',
    name: 'Carlos Ruiz',
    prototype: 'AX-5 Pierna',
    status: 'Fabricación',
    progress: 91,
  },
  {
    id: 'usr-003',
    name: 'Ana Beltrán',
    prototype: 'AX-7 Brazo',
    status: 'Escaneo',
    progress: 24,
  },
]
