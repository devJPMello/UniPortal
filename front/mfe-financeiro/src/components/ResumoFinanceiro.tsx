import type { ResumoFinanceiro as Resumo } from '../data/mockData'

interface Props {
  resumo: Resumo
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ResumoFinanceiro({ resumo }: Props) {
  return (
    <div className="fn-summary">
      <div className="fn-sum-card">
        <span className="fn-sum-val" style={{ color: '#38A169' }}>
          {resumo.mensalidadesPagas}
        </span>
        <span className="fn-sum-lbl">Pagas</span>
      </div>
      <div className="fn-sum-card">
        <span className="fn-sum-val" style={{ color: '#38A169' }}>
          {fmt(resumo.totalPago)}
        </span>
        <span className="fn-sum-lbl">Total pago</span>
      </div>
      <div className="fn-sum-card">
        <span className="fn-sum-val" style={{ color: '#D69E2E' }}>
          {resumo.boletosPendentes != null ? fmt(resumo.boletosPendentes) : '—'}
        </span>
        <span className="fn-sum-lbl">Pendente</span>
      </div>
      <div className="fn-sum-card">
        <span className="fn-sum-val" style={{ color: resumo.boletosVencidos > 0 ? '#E53E3E' : '#38A169' }}>
          {resumo.boletosVencidos}
        </span>
        <span className="fn-sum-lbl">Vencidos</span>
      </div>
    </div>
  )
}
