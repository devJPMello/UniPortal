import { CreditCard } from 'lucide-react'
import ResumoFinanceiro from './components/ResumoFinanceiro'
import ListaBoletos from './components/ListaBoletos'
import { useFinanceiro } from './hooks/useFinanceiro'
import './styles.css'

interface Props {
  token?: string
}

function decodeJwt(token: string) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(b64)) as { ra: string; nome: string }
  } catch { return null }
}

export default function FinanceiroApp({ token }: Props) {
  const { boletos, resumo, loading, erro } = useFinanceiro(token)

  const decoded = token ? decodeJwt(token) : null
  const nome = decoded?.nome ?? 'Visitante'
  const ra   = decoded?.ra   ?? '—'

  const totalMensalidades = boletos.length
  const pagas = boletos.filter(b => b.status === 'pago').length

  return (
    <div className="fn-root">
      <div className="fn-header">
        <div className="fn-header-left">
          <div className="fn-title">
            <CreditCard size={20} className="fn-title-icon" />
            Portal Financeiro
          </div>
          <div className="fn-subtitle">Sistema da Mantenedora — integrado via iframe</div>
          <div className="fn-user">
            <span className="fn-user-name">{nome}</span>
            <span className="fn-user-sep">·</span>
            RA: {ra}
            {loading && <span className="fn-loading-dot"> · Carregando…</span>}
          </div>
        </div>
        <ResumoFinanceiro resumo={resumo} pagas={pagas} total={totalMensalidades} />
      </div>

      {erro && <div className="fn-erro" role="alert">{erro}</div>}

      <div className="fn-section-header">
        <h2 className="fn-section-title">Mensalidades 2026</h2>
        <span className="fn-section-sub">{pagas} de {totalMensalidades} pagas</span>
      </div>

      <ListaBoletos boletos={boletos} />
    </div>
  )
}
