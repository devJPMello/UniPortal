import { useAuth } from '../auth/AuthContext'

export default function BibliotecaPage() {
  const { token } = useAuth()
  const src = `http://localhost:3003?token=${encodeURIComponent(token ?? '')}`

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
