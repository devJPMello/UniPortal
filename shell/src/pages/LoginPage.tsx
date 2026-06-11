import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, LogIn, Loader } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

const RA_REGEX = /^\d{7}$/

export default function LoginPage() {
  const [ra, setRa]         = useState('')
  const [senha, setSenha]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!ra.trim()) {
      setError('Preencha o Registro Acadêmico (RA).')
      return
    }
    if (!RA_REGEX.test(ra.trim())) {
      setError('RA deve conter exatamente 7 dígitos numéricos.')
      return
    }
    if (!senha || senha.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres.')
      return
    }

    setLoading(true)
    const ok = await login(ra.trim(), senha)
    setLoading(false)

    if (ok) navigate('/dashboard')
    else setError('RA ou senha inválidos. Verifique suas credenciais.')
  }

  return (
    <div className="login-bg">
      <div className="login-card" role="main">
        <div className="login-logo">
          <GraduationCap size={44} color="var(--color-secondary)" aria-hidden="true" />
          <h1 className="login-title">UniPortal</h1>
          <p className="login-subtitle">Sistema Integrado de Gestão Acadêmica</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate aria-label="Formulário de login">
          <div className="form-group">
            <label htmlFor="ra" className="form-label">
              Registro Acadêmico (RA)
            </label>
            <input
              id="ra"
              className="form-input"
              type="text"
              inputMode="numeric"
              pattern="\d{7}"
              value={ra}
              onChange={(e) => setRa(e.target.value)}
              placeholder="Ex: 2024001"
              autoComplete="username"
              autoFocus
              disabled={loading}
              aria-required="true"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <input
              id="senha"
              className="form-input"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              disabled={loading}
              aria-required="true"
            />
          </div>

          {error && (
            <p id="login-error" className="form-error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <button
            className="btn-primary btn-full"
            type="submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? <Loader size={18} aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="login-sso-note" aria-label="Status do SSO">
          <span className="sso-dot" aria-hidden="true" />
          <span>
            <strong>SSO ativo</strong>. Suas credenciais funcionam em todos os módulos do portal
          </span>
        </div>
      </div>
    </div>
  )
}
