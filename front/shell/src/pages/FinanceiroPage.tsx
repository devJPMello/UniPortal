import { useAuth } from '../auth/AuthContext'

const FINANCEIRO_URL = import.meta.env.VITE_FINANCEIRO_URL || 'http://localhost:3004'

export default function FinanceiroPage() {
  const { token } = useAuth()
  const src = `${FINANCEIRO_URL}?token=${encodeURIComponent(token ?? '')}`

  return (
    <div className="mfe-container">
      <div className="mfe-badge mfe-badge--iframe">
        <span className="mfe-badge-dot mfe-badge-dot--yellow" />
        Módulo Financeiro — carregado via <strong>iframe</strong>
        &nbsp;·&nbsp; sistema da mantenedora, isolamento total de CSS/JS
      </div>
      <iframe
        src={src}
        className="mfe-iframe"
        title="Módulo Financeiro"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  )
}
