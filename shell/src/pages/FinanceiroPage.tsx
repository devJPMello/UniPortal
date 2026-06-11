import React, { Suspense, lazy, Component } from 'react'
import { AlertCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

const FinanceiroApp = lazy(() => import('mfe_financeiro/FinanceiroApp'))

interface EBState { error: Error | null }
class MfeErrorBoundary extends Component<{ name: string; children: React.ReactNode }, EBState> {
  state: EBState = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e } }
  render() {
    if (this.state.error)
      return (
        <div className="mfe-error">
          <AlertCircle size={32} color="var(--color-error)" />
          <h3>Módulo {this.props.name} indisponível</h3>
          <p>Certifique-se de que o serviço está rodando em <code>localhost:3004</code>.</p>
          <pre>{this.state.error.message}</pre>
        </div>
      )
    return this.props.children
  }
}

export default function FinanceiroPage() {
  const { token } = useAuth()
  return (
    <div className="mfe-container">
      <div className="mfe-badge">
        <span className="mfe-badge-dot mfe-badge-dot--blue" />
        Módulo Financeiro carregado via <strong>Module Federation</strong>
        &nbsp;·&nbsp; deploy independente, equipe própria
      </div>
      <MfeErrorBoundary name="Financeiro">
        <Suspense fallback={<MfeFallback name="Financeiro" />}>
          <FinanceiroApp token={token ?? undefined} />
        </Suspense>
      </MfeErrorBoundary>
    </div>
  )
}

function MfeFallback({ name }: { name: string }) {
  return (
    <div className="mfe-loading">
      <div className="spinner" />
      <p>Carregando módulo {name}...</p>
    </div>
  )
}
