import { BookOpen, Check } from 'lucide-react'
import type { HistoricoLivro } from '../data/mockData'

interface Props {
  historico: HistoricoLivro[]
}

function calcDias(emp: string, dev: string): number {
  const parse = (s: string) => {
    const [d, m, y] = s.split('/').map(Number)
    return new Date(y, m - 1, d)
  }
  return Math.round((parse(dev).getTime() - parse(emp).getTime()) / 86_400_000)
}

export default function HistoricoLivros({ historico }: Props) {
  if (!historico.length) {
    return (
      <div className="bl-empty">
        <BookOpen size={40} className="bl-empty-icon" />
        <p>Nenhum livro devolvido no histórico.</p>
      </div>
    )
  }

  return (
    <div className="bl-cards-list">
      {historico.map((l, i) => {
        const dias = calcDias(l.emprestado, l.devolvido)
        return (
          <div key={i} className="bl-card bl-card--devolvido">
            <div className="bl-card-spine bl-card-spine--devolvido" />
            <div className="bl-book-cover bl-book-cover--devolvido">
              <BookOpen size={32} className="bl-book-cover-icon" />
            </div>
            <div className="bl-book-info">
              <div className="bl-book-title">{l.titulo}</div>
              <div className="bl-book-author">{l.autor}</div>
              <div className="bl-book-dates">
                <span>Emprestado: {l.emprestado}</span>
                <span>Devolvido: <strong>{l.devolvido}</strong></span>
              </div>
            </div>
            <div className="bl-card-actions">
              <span className="bl-badge badge-devolvido"><Check size={10} /> Devolvido</span>
              <div className="bl-hist-dias">{dias} dias</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
