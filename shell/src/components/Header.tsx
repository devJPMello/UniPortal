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
    <header className="header" role="banner">
      <div className="header-brand" aria-label="UniPortal">
        <GraduationCap size={28} color="var(--color-secondary)" aria-hidden="true" />
        <div className="header-brand-text">
          <span className="header-brand-name">UniPortal</span>
          <span className="header-brand-subtitle">Sistema Acadêmico Integrado</span>
        </div>
      </div>

      <div className="header-user" aria-label="Informações do usuário">
        <div className="header-user-info">
          <span className="header-user-name">{user?.nome}</span>
          <span className="header-user-detail">RA: {user?.ra} · {user?.semestre}</span>
        </div>
        <div
          className="header-avatar"
          role="img"
          aria-label={`Avatar de ${user?.nome}`}
        >
          {initials}
        </div>
        <button
          className="header-logout"
          onClick={logout}
          aria-label="Sair do sistema"
          title="Sair"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
