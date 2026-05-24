import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AiCompanionPanel } from '@/components/ai-companion/AiCompanionPanel'
import { ROUTES } from '@/routes/paths'
import { useAuth } from '@/hooks/useAuth'
import styles from './UserDashboard.module.css'

const NAV = [
  { id: 'assistant', label: 'Asistente IA', icon: <Bot size={16} /> },
]

export function UserDashboard() {
  const { user } = useAuth()
  const [section, setSection] = useState('assistant')

  const navItems = NAV.map((item) => ({
    ...item,
    to: ROUTES.DASHBOARD_USER,
    end: true,
    onClick: () => setSection(item.id),
    isButton: true,
    active: section === item.id,
  }))

  return (
    <DashboardLayout
      variant="user"
      title="Mi prototipo"
      subtitle="Panel de usuario · seguimiento biomecánico"
      navItems={navItems}
    >
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        layout
      >
        <AiCompanionPanel />
      </motion.section>
    </DashboardLayout>
  )
}
