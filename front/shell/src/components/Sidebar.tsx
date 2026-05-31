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
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item${isActive ? ' sidebar-item--active' : ''}`
            }
          >
            <Icon size={20} />
            <span className="sidebar-item-label">{label}</span>
            {badge && (
              <span className="sidebar-badge" style={{ background: badgeBg[badge] }}>
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-arch-note">
          <span className="arch-dot arch-dot--blue" /> Module Federation
        </p>
        <p className="sidebar-arch-note">
          <span className="arch-dot arch-dot--yellow" /> iframe Integration
        </p>
      </div>
    </aside>
  )
}
