import { LogOut, GraduationCap } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  const initials = user?.nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('') ?? 'U'

  return (
    <header className="header">
      <div className="header-brand">
        <GraduationCap size={28} color="var(--color-secondary)" />
        <div className="header-brand-text">
          <span className="header-brand-name">UniPortal</span>
          <span className="header-brand-subtitle">Sistema Acadêmico Integrado</span>
        </div>
      </div>

      <div className="header-user">
        <div className="header-user-info">
          <span className="header-user-name">{user?.nome}</span>
          <span className="header-user-detail">RA: {user?.ra} · {user?.semestre}</span>
        </div>
        <div className="header-avatar">{initials}</div>
        <button className="header-logout" onClick={logout} title="Sair">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
