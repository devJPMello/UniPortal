import type { HistoricoLivro } from '../data/mockData'

interface Props {
  historico: HistoricoLivro[]
}

export default function HistoricoLivros({ historico }: Props) {
  if (!historico.length) {
    return <div className="bl-empty">Nenhum livro devolvido no histórico.</div>
  }

  return (
    <>
      {historico.map((l, i) => (
        <div key={i} className="bl-card">
          <div className="bl-book-icon" style={{ background: '#F7F9FC' }}>
            {l.icon}
          </div>
          <div className="bl-book-info">
            <div className="bl-book-title">{l.titulo}</div>
            <div className="bl-book-author">{l.autor}</div>
            <div className="bl-book-dates">
              Emprestado: {l.emprestado} · Devolvido: {l.devolvido}
            </div>
          </div>
          <span className="bl-badge badge-devolvido">Devolvido</span>
        </div>
      ))}
    </>
  )
}
