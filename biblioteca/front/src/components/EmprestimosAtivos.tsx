import { useState } from 'react'
import { BookOpen, AlertTriangle, Check, RefreshCw } from 'lucide-react'
import type { Emprestimo } from '../data/mockData'

interface Props {
  emprestimos: Emprestimo[]
}

function addDias(dateStr: string, dias: number): string {
  const [d, m, y] = dateStr.split('/').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + dias)
  return date.toLocaleDateString('pt-BR')
}

export default function EmprestimosAtivos({ emprestimos }: Props) {
  const [renovados, setRenovados] = useState<Record<number, string>>({})
  const [toast, setToast]         = useState<string | null>(null)

  const atrasados = emprestimos.filter(e => e.status === 'atrasado')

  function renovar(e: Emprestimo) {
    const base     = renovados[e.id] ?? e.devolucao
    const novaData = addDias(base, 14)
    setRenovados(prev => ({ ...prev, [e.id]: novaData }))
    setToast(`"${e.titulo}" renovado até ${novaData}!`)
    setTimeout(() => setToast(null), 2800)
  }

  if (!emprestimos.length) {
    return (
      <div className="bl-empty">
        <BookOpen size={40} className="bl-empty-icon" />
        <p>Nenhum empréstimo ativo no momento.</p>
      </div>
    )
  }

  return (
    <>
      {atrasados.length > 0 && (
        <div className="bl-alert-banner">
          <AlertTriangle size={18} className="bl-alert-icon" />
          <span>
            <strong>{atrasados.length} livro(s) em atraso.</strong>{' '}
            Realize a devolução ou renovação para evitar bloqueio.
          </span>
        </div>
      )}

      <div className="bl-cards-list">
        {emprestimos.map(e => {
          const dataAtual  = renovados[e.id] ?? e.devolucao
          const foiRenovado = !!renovados[e.id]
          return (
            <div key={e.id} className={`bl-card bl-card--${e.status}`}>
              <div className="bl-card-spine" />
              <div className={`bl-book-cover bl-book-cover--${e.status}`}>
                <BookOpen size={32} className="bl-book-cover-icon" />
              </div>
              <div className="bl-book-info">
                <div className="bl-book-title">{e.titulo}</div>
                <div className="bl-book-author">{e.autor}</div>
                {e.isbn && <div className="bl-book-isbn">ISBN: {e.isbn}</div>}
                <div className="bl-book-dates">
                  <span>Emprestado: {e.emprestado}</span>
                  <span className={e.status === 'atrasado' ? 'bl-date--late' : foiRenovado ? 'bl-date--renewed' : ''}>
                    Devolução: <strong>{dataAtual}</strong>
                    {foiRenovado && <span className="bl-renovado-tag">renovado</span>}
                  </span>
                </div>
              </div>
              <div className="bl-card-actions">
                <span className={`bl-badge badge-${e.status}`}>
                  {e.status === 'atrasado'
                    ? <><AlertTriangle size={10} /> Atrasado</>
                    : <><Check size={10} /> Ativo</>
                  }
                </span>
                <button
                  className={`bl-renovar-btn ${foiRenovado ? 'bl-renovar-btn--ok' : ''}`}
                  onClick={() => renovar(e)}
                >
                  <RefreshCw size={13} /> {foiRenovado ? 'Renovar novamente' : 'Renovar +14 dias'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {toast && <div className="bl-toast show">{toast}</div>}
    </>
  )
}
