import { NavLink } from 'react-router-dom'
import { LayoutDashboard, GraduationCap, Calendar, BookOpen, CreditCard } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  badge?: string
}

const navItems: NavItem[] = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/academico',  icon: GraduationCap,   label: 'Acadêmico',  badge: 'MFE'    },
  { to: '/matricula',  icon: Calendar,        label: 'Matrícula',  badge: 'MFE'    },
  { to: '/biblioteca', icon: BookOpen,        label: 'Biblioteca', badge: 'iframe' },
  { to: '/financeiro', icon: CreditCard,      label: 'Financeiro', badge: 'iframe' },
]

const badgeBg: Record<string, string> = {
  MFE:    '#2E5DA8',
  iframe: '#D69E2E',
}

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Navegação principal">
      <nav className="sidebar-nav" role="navigation" aria-label="Menu do portal">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' sidebar-item--active' : ''}`
            }
            aria-label={badge ? `${label} (integração ${badge})` : label}
          >
            <Icon size={20} aria-hidden="true" />
            <span className="sidebar-item-label">{label}</span>
            {badge && (
              <span
                className="sidebar-badge"
                style={{ background: badgeBg[badge] }}
                aria-label={`Tipo: ${badge}`}
              >
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" aria-label="Legenda de integrações">
        <p className="sidebar-arch-note">
          <span className="arch-dot arch-dot--blue" aria-hidden="true" /> Module Federation
        </p>
        <p className="sidebar-arch-note">
          <span className="arch-dot arch-dot--yellow" aria-hidden="true" /> iframe Integration
        </p>
      </div>
    </aside>
  )
}
