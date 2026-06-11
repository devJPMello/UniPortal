import { Check, DollarSign, Clock, AlertTriangle } from 'lucide-react'
import type { ResumoFinanceiro as Resumo } from '../data/mockData'

interface Props {
  resumo: Resumo
  pagas: number
  total: number
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ResumoFinanceiro({ resumo, pagas, total }: Props) {
  const pct = total > 0 ? Math.round((pagas / total) * 100) : 0

  return (
    <div className="fn-resumo-wrap">
      <div className="fn-summary">
        <div className="fn-sum-card fn-sum-card--success">
          <span className="fn-sum-icon"><Check size={18} /></span>
          <span className="fn-sum-val">{resumo.mensalidadesPagas}</span>
          <span className="fn-sum-lbl">Pagas</span>
        </div>
        <div className="fn-sum-card fn-sum-card--info">
          <span className="fn-sum-icon"><DollarSign size={18} /></span>
          <span className="fn-sum-val fn-sum-val--sm">{fmt(resumo.totalPago)}</span>
          <span className="fn-sum-lbl">Total pago</span>
        </div>
        <div className="fn-sum-card fn-sum-card--warning">
          <span className="fn-sum-icon"><Clock size={18} /></span>
          <span className="fn-sum-val fn-sum-val--sm">
            {resumo.boletosPendentes != null ? fmt(resumo.boletosPendentes) : 'N/A'}
          </span>
          <span className="fn-sum-lbl">Pendente</span>
        </div>
        <div className={`fn-sum-card ${resumo.boletosVencidos > 0 ? 'fn-sum-card--error' : 'fn-sum-card--success'}`}>
          <span className="fn-sum-icon">
            {resumo.boletosVencidos > 0 ? <AlertTriangle size={18} /> : <Check size={18} />}
          </span>
          <span className="fn-sum-val">{resumo.boletosVencidos}</span>
          <span className="fn-sum-lbl">Vencidos</span>
        </div>
      </div>

      <div className="fn-progress-wrap">
        <div className="fn-progress-labels">
          <span>Progresso do ano</span>
          <span>{pct}%</span>
        </div>
        <div className="fn-progress-track">
          <div className="fn-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="fn-progress-hint">{pagas} de {total} mensalidades pagas</div>
      </div>
    </div>
  )
}
