import { useState } from 'react'
import { BookOpen, AlertTriangle, Check, RefreshCw, CornerDownLeft, X, Calendar } from 'lucide-react'
import type { Emprestimo } from '../data/mockData'
import type { EstadoEmprestimo } from '../BibliotecaApp'

interface Props {
  emprestimos: Emprestimo[]
  estados: Record<number, EstadoEmprestimo>
  devolvidos: number[]
  onEstadosChange: (e: Record<number, EstadoEmprestimo>) => void
  onDevolvidosChange: (d: number[]) => void
}

const MAX_RENOVACOES = 2

function addDias(dateStr: string, dias: number): string {
  const [d, m, y] = dateStr.split('/').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + dias)
  return date.toLocaleDateString('pt-BR')
}

export default function EmprestimosAtivos({
  emprestimos, estados, devolvidos, onEstadosChange, onDevolvidosChange,
}: Props) {
  const [saindo,        setSaindo]        = useState<Set<number>>(new Set())
  const [modalRenovar,  setModalRenovar]  = useState<Emprestimo | null>(null)
  const [modalDevolver, setModalDevolver] = useState<Emprestimo | null>(null)
  const [toast,         setToast]         = useState<string | null>(null)

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function estadoOf(e: Emprestimo): EstadoEmprestimo {
    return estados[e.id] ?? { dataAtual: e.devolucao, renovacoes: 0 }
  }

  function confirmarRenovacao(e: Emprestimo) {
    const est = estadoOf(e)
    if (est.renovacoes >= MAX_RENOVACOES) return
    const novaData = addDias(est.dataAtual, 14)
    onEstadosChange({ ...estados, [e.id]: { dataAtual: novaData, renovacoes: est.renovacoes + 1 } })
    setModalRenovar(null)
    mostrarToast(`"${e.titulo}" renovado até ${novaData}!`)
  }

  function confirmarDevolucao(e: Emprestimo) {
    setModalDevolver(null)
    setSaindo(prev => new Set([...prev, e.id]))
    setTimeout(() => {
      onDevolvidosChange([...devolvidos, e.id])
      setSaindo(prev => { const s = new Set(prev); s.delete(e.id); return s })
      mostrarToast(`"${e.titulo}" devolvido com sucesso!`)
    }, 400)
  }

  const visiveis = emprestimos.filter(e => !devolvidos.includes(e.id))
  const atrasados = visiveis.filter(e => e.status === 'atrasado')

  const renovarEst    = modalRenovar ? estadoOf(modalRenovar) : null
  const novaDataRenovar = modalRenovar ? addDias(renovarEst!.dataAtual, 14) : ''

  if (!visiveis.length) {
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
        {visiveis.map(e => {
          const est           = estadoOf(e)
          const foiRenovado   = est.renovacoes > 0
          const renovacoesMax = est.renovacoes >= MAX_RENOVACOES

          return (
            <div
              key={e.id}
              className={`bl-card bl-card--${e.status} ${saindo.has(e.id) ? 'bl-card--saindo' : ''}`}
            >
              <div className="bl-card-spine" />

              <div className={`bl-book-cover bl-book-cover--${e.status}`}>
                <BookOpen size={28} />
              </div>

              <div className="bl-book-info">
                <div className="bl-book-title">{e.titulo}</div>
                <div className="bl-book-author">{e.autor}</div>
                {e.isbn && <div className="bl-book-isbn">ISBN: {e.isbn}</div>}
                <div className="bl-book-dates">
                  <span>Emprestado: {e.emprestado}</span>
                  <span className={e.status === 'atrasado' ? 'bl-date--late' : foiRenovado ? 'bl-date--renewed' : ''}>
                    Devolução: <strong>{est.dataAtual}</strong>
                    {foiRenovado && (
                      <span className="bl-renovado-tag">{est.renovacoes}x renovado</span>
                    )}
                  </span>
                </div>
                {foiRenovado && (
                  <div className="bl-renovacoes-track">
                    {Array.from({ length: MAX_RENOVACOES }).map((_, i) => (
                      <div key={i} className={`bl-renovacao-pip ${i < est.renovacoes ? 'bl-renovacao-pip--used' : ''}`} />
                    ))}
                    <span className="bl-renovacoes-txt">
                      {renovacoesMax
                        ? 'Limite de renovações atingido'
                        : `${MAX_RENOVACOES - est.renovacoes} renovação(ões) restante(s)`}
                    </span>
                  </div>
                )}
              </div>

              <div className="bl-card-actions">
                <span className={`bl-badge badge-${e.status}`}>
                  {e.status === 'atrasado'
                    ? <><AlertTriangle size={10} /> Atrasado</>
                    : <><Check size={10} /> Ativo</>}
                </span>
                <button
                  className={`bl-renovar-btn ${renovacoesMax ? 'bl-renovar-btn--disabled' : ''}`}
                  onClick={() => !renovacoesMax && setModalRenovar(e)}
                  disabled={renovacoesMax}
                  title={renovacoesMax ? 'Limite de renovações atingido' : 'Renovar por mais 14 dias'}
                >
                  <RefreshCw size={13} />
                  {renovacoesMax ? 'Sem renovações' : 'Renovar +14 dias'}
                </button>
                <button className="bl-devolver-btn" onClick={() => setModalDevolver(e)}>
                  <CornerDownLeft size={13} />
                  Devolver
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Modal Renovar ── */}
      {modalRenovar && renovarEst && (
        <div className="bl-modal-overlay" onClick={() => setModalRenovar(null)}>
          <div className="bl-modal" onClick={e => e.stopPropagation()}>
            <div className="bl-modal-header">
              <span className="bl-modal-title"><RefreshCw size={16} /> Confirmar Renovação</span>
              <button className="bl-modal-close" onClick={() => setModalRenovar(null)}><X size={15} /></button>
            </div>
            <div className="bl-modal-body">
              <div className="bl-modal-livro">
                <BookOpen size={22} className="bl-modal-livro-icon" />
                <div>
                  <div className="bl-modal-livro-titulo">{modalRenovar.titulo}</div>
                  <div className="bl-modal-livro-autor">{modalRenovar.autor}</div>
                </div>
              </div>
              <div className="bl-modal-datas">
                <div className="bl-modal-data-item bl-modal-data-item--old">
                  <Calendar size={14} />
                  <div>
                    <span className="bl-modal-data-lbl">Devolução atual</span>
                    <span className="bl-modal-data-val">{renovarEst.dataAtual}</span>
                  </div>
                </div>
                <div className="bl-modal-seta">→</div>
                <div className="bl-modal-data-item bl-modal-data-item--new">
                  <Calendar size={14} />
                  <div>
                    <span className="bl-modal-data-lbl">Nova devolução</span>
                    <span className="bl-modal-data-val">{novaDataRenovar}</span>
                  </div>
                </div>
              </div>
              <div className="bl-modal-info">
                Renovação {renovarEst.renovacoes + 1} de {MAX_RENOVACOES} permitidas.
              </div>
            </div>
            <div className="bl-modal-footer">
              <button className="bl-modal-btn bl-modal-btn--sec" onClick={() => setModalRenovar(null)}>
                Cancelar
              </button>
              <button className="bl-modal-btn bl-modal-btn--primary" onClick={() => confirmarRenovacao(modalRenovar)}>
                <RefreshCw size={14} /> Confirmar renovação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Devolver ── */}
      {modalDevolver && (
        <div className="bl-modal-overlay" onClick={() => setModalDevolver(null)}>
          <div className="bl-modal" onClick={e => e.stopPropagation()}>
            <div className="bl-modal-header">
              <span className="bl-modal-title"><CornerDownLeft size={16} /> Confirmar Devolução</span>
              <button className="bl-modal-close" onClick={() => setModalDevolver(null)}><X size={15} /></button>
            </div>
            <div className="bl-modal-body">
              <div className="bl-modal-livro">
                <BookOpen size={22} className="bl-modal-livro-icon" />
                <div>
                  <div className="bl-modal-livro-titulo">{modalDevolver.titulo}</div>
                  <div className="bl-modal-livro-autor">{modalDevolver.autor}</div>
                </div>
              </div>
              <p className="bl-modal-aviso">
                Confirma a devolução deste livro? Ele será removido dos seus empréstimos ativos.
              </p>
              {modalDevolver.status === 'atrasado' && (
                <div className="bl-modal-alerta">
                  <AlertTriangle size={14} />
                  Este livro está em atraso. Verifique se há multas pendentes no balcão.
                </div>
              )}
            </div>
            <div className="bl-modal-footer">
              <button className="bl-modal-btn bl-modal-btn--sec" onClick={() => setModalDevolver(null)}>
                Cancelar
              </button>
              <button className="bl-modal-btn bl-modal-btn--danger" onClick={() => confirmarDevolucao(modalDevolver)}>
                <CornerDownLeft size={14} /> Confirmar devolução
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="bl-toast show">{toast}</div>}
    </>
  )
}
