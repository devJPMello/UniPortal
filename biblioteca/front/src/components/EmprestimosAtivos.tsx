import { useState } from 'react'
import type { Emprestimo } from '../data/mockData'

interface Props {
  emprestimos: Emprestimo[]
}

export default function EmprestimosAtivos({ emprestimos }: Props) {
  const [toast, setToast] = useState<string | null>(null)

  function renovar(titulo: string) {
    setToast(`✓ "${titulo}" renovado por mais 14 dias!`)
    setTimeout(() => setToast(null), 2500)
  }

  if (!emprestimos.length) {
    return <div className="bl-empty">Nenhum empréstimo ativo.</div>
  }

  return (
    <>
      {emprestimos.map((e) => (
        <div key={e.id} className="bl-card">
          <div
            className="bl-book-icon"
            style={{ background: e.status === 'atrasado' ? '#FFF5F5' : '#F0FFF4' }}
          >
            {e.icon}
          </div>
          <div className="bl-book-info">
            <div className="bl-book-title">{e.titulo}</div>
            <div className="bl-book-author">{e.autor}</div>
            {e.isbn && <div className="bl-book-isbn">ISBN: {e.isbn}</div>}
            <div className="bl-book-dates">
              Emprestado: {e.emprestado} · Devolução: <strong>{e.devolucao}</strong>
            </div>
            <button className="bl-renovar-btn" onClick={() => renovar(e.titulo)}>
              Renovar
            </button>
          </div>
          <span className={`bl-badge badge-${e.status}`}>
            {e.status === 'atrasado' ? 'Atrasado' : 'Ativo'}
          </span>
        </div>
      ))}

      {toast && <div className="bl-toast show">{toast}</div>}
    </>
  )
}
