import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, LogIn } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const [ra, setRa]       = useState('2024001')
  const [senha, setSenha] = useState('12345')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(ra, senha)
    if (ok) navigate('/dashboard')
    else setError('Preencha o RA para continuar.')
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <GraduationCap size={44} color="var(--color-secondary)" />
          <h1 className="login-title">UniPortal</h1>
          <p className="login-subtitle">Sistema Integrado de Gestão Acadêmica</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">Registro Acadêmico (RA)</label>
            <input
              className="form-input"
              type="text"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              placeholder="Ex: 2024001"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="btn-primary btn-full" type="submit">
            <LogIn size={18} />
            Entrar
          </button>
        </form>

        <div className="login-sso-note">
          <span className="sso-dot" />
          <span>
            <strong>SSO ativo</strong> — suas credenciais funcionam em todos os módulos do portal
          </span>
        </div>
        <p className="login-hint">Demo: qualquer RA e senha são aceitos</p>
      </div>
    </div>
  )
}
