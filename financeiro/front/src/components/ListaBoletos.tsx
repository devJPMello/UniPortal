import { useState } from 'react'
import type { Boleto } from '../data/mockData'

interface Props {
  boletos: Boleto[]
}

const STATUS_LABEL: Record<Boleto['status'], string> = {
  pago:     'Pago',
  pendente: 'Pendente',
  vencido:  'Vencido',
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ListaBoletos({ boletos }: Props) {
  const [toast, setToast] = useState<string | null>(null)

  function copiar(codigo: string) {
    navigator.clipboard.writeText(codigo).catch(() => undefined)
    setToast('✓ Código de barras copiado!')
    setTimeout(() => setToast(null), 2500)
  }

  function simularPagamento(mes: string) {
    setToast(`✓ Pagamento de ${mes} registrado!`)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <>
      {boletos.map((b) => (
        <div key={b.id} className="fn-boleto">
          <div className="fn-boleto-info">
            <div className="fn-boleto-mes">{b.mes}</div>
            <div className="fn-boleto-venc">Vencimento: {b.vencimento}</div>
            {(b.status === 'pendente' || b.status === 'vencido') && (
              <span className="fn-codigo">{b.codigo}</span>
            )}
          </div>

          <div className="fn-boleto-valor" style={{ color: b.status === 'vencido' ? '#E53E3E' : 'inherit' }}>
            {fmt(b.valor)}
          </div>

          <span className={`fn-badge badge-${b.status}`}>{STATUS_LABEL[b.status]}</span>

          <div className="fn-actions">
            {b.status === 'pago' && (
              <button className="fn-btn" onClick={() => setToast('✓ Comprovante aberto!')}>
                Comprovante
              </button>
            )}
            {(b.status === 'pendente' || b.status === 'vencido') && (
              <>
                <button className="fn-btn" onClick={() => copiar(b.codigo)}>
                  Copiar código
                </button>
                <button className="fn-btn fn-btn-pagar" onClick={() => simularPagamento(b.mes)}>
                  Pagar
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {toast && <div className="fn-toast show">{toast}</div>}
    </>
  )
}
