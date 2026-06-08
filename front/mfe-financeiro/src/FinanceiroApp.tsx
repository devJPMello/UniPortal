import ResumoFinanceiro from './components/ResumoFinanceiro'
import ListaBoletos from './components/ListaBoletos'
import { useFinanceiro } from './hooks/useFinanceiro'
import './styles.css'

interface Props {
  token?: string
}

export default function FinanceiroApp({ token }: Props) {
  const { boletos, resumo, loading, erro } = useFinanceiro(token)

  let nome = 'Visitante'
  let ra   = '—'
  try {
    if (token) {
      const decoded = JSON.parse(atob(token)) as { ra: string; nome: string }
      nome = decoded.nome
      ra   = decoded.ra
    }
  } catch { /* token inválido */ }

  return (
    <div className="fn-root">
      <div className="fn-header">
        <div className="fn-header-left">
          <div className="fn-title">💳 Portal Financeiro</div>
          <div className="fn-subtitle">Sistema da Mantenedora — integrado via iframe</div>
          <div className="fn-user">
            {nome} · RA: {ra}
            {loading && <span className="fn-loading-dot"> · Carregando...</span>}
          </div>
        </div>
        <ResumoFinanceiro resumo={resumo} />
      </div>

      {erro && (
        <div className="fn-erro">{erro}</div>
      )}

      <div className="fn-section-title">Mensalidades 2026</div>
      <ListaBoletos boletos={boletos} />
    </div>
  )
}
