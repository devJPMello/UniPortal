import { useAuth } from '../auth/AuthContext'

const BIBLIOTECA_URL = import.meta.env.VITE_BIBLIOTECA_URL || 'http://localhost:3003'

export default function BibliotecaPage() {
  const { token } = useAuth()
  const src = `${BIBLIOTECA_URL}?token=${encodeURIComponent(token ?? '')}`

  return (
    <div className="mfe-container">
      <div className="mfe-badge mfe-badge--iframe">
        <span className="mfe-badge-dot mfe-badge-dot--yellow" />
        Módulo Biblioteca — carregado via <strong>iframe</strong>
        &nbsp;·&nbsp; sistema de fornecedor externo, isolamento total de CSS/JS
      </div>
      <iframe
        src={src}
        className="mfe-iframe"
        title="Módulo Biblioteca"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  )
}
