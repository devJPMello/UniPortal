import { useState, useMemo } from 'react'
import {
  CheckCircle, Search, AlertTriangle, Check, X,
  Clock, BookOpen, XCircle, ShoppingCart,
} from 'lucide-react'
import { type DisciplinaDisponivel, type Aula } from '../data/mockData'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Props {
  disponiveis: DisciplinaDisponivel[]
  gradeAtual: Aula[]
  onConfirmar: (codigos: string[]) => Promise<{ sucesso: boolean; mensagem: string }>
}

const CONCLUIDAS = new Set([
  'CC101','CC102','CC103','CC104',
  'CC201','CC202','CC203','CC204',
  'CC301','CC302','CC303','CC304',
  'CC401','CC402','CC403','CC404','CC405',
])

const DIA_MAP: Record<string, number> = { Seg:1, Ter:2, Qua:3, Qui:4, Sex:5 }

function parseHorario(h: string) {
  const m = h.match(/^([\w/]+)\s+(\d+)h[–\-](\d+)h/)
  if (!m) return null
  return { dias: m[1].split('/').map(d => DIA_MAP[d]).filter(Boolean), inicio: +m[2], fim: +m[3] }
}

function temConflito(h1: string, h2: string) {
  const p1 = parseHorario(h1); const p2 = parseHorario(h2)
  if (!p1 || !p2) return false
  if (!p1.dias.some(d => p2.dias.includes(d))) return false
  return p1.inicio < p2.fim && p2.inicio < p1.fim
}

type Filtro = 'todas' | 'disponiveis' | 'prereq'

const FILTRO_LABEL: Record<Filtro, string> = {
  todas:      'Todas',
  disponiveis:'Com vagas',
  prereq:     'Pré-req. OK',
}

export default function ProcessoMatricula({ disponiveis, gradeAtual, onConfirmar }: Props) {
  const [carrinho,    setCarrinho]    = useLocalStorage<string[]>('mt:carrinho', [])
  const [confirmadas, setConfirmadas] = useLocalStorage<string[]>('mt:confirmadas', [])
  const [confirmando, setConfirmando] = useState(false)
  const [toast,       setToast]       = useState<string | null>(null)
  const [filtro,      setFiltro]      = useState<Filtro>('todas')
  const [busca,       setBusca]       = useState('')

  const matriculadas = [...new Set(gradeAtual.map(a => a.disciplina))]

  function mostrarToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function toggle(codigo: string) {
    setCarrinho(prev =>
      prev.includes(codigo) ? prev.filter(c => c !== codigo) : [...prev, codigo]
    )
  }

  function removerDoCarrinho(codigo: string) {
    setCarrinho(prev => prev.filter(c => c !== codigo))
  }

  async function confirmar() {
    if (carrinho.length === 0) return
    setConfirmando(true)
    const result = await onConfirmar(carrinho)
    setConfirmando(false)
    if (result.sucesso) {
      const novas = carrinho.filter(c => !confirmadas.includes(c))
      setConfirmadas(prev => [...prev, ...novas])
      setCarrinho([])
      mostrarToast(`Pré-matrícula confirmada! ${novas.length} disciplina(s) selecionada(s).`)
    }
  }

  const vagasLivres = (d: DisciplinaDisponivel) => d.vagas - d.vagasOcupadas
  const prereqOk    = (d: DisciplinaDisponivel) => !d.prereq || CONCLUIDAS.has(d.prereq)

  const conflitos = useMemo(() => {
    const pares: string[] = []
    for (let i = 0; i < carrinho.length; i++) {
      for (let j = i + 1; j < carrinho.length; j++) {
        const d1 = disponiveis.find(d => d.codigo === carrinho[i])
        const d2 = disponiveis.find(d => d.codigo === carrinho[j])
        if (d1 && d2 && temConflito(d1.horarios, d2.horarios)) {
          pares.push(`${d1.codigo} ↔ ${d2.codigo}`)
        }
      }
    }
    return pares
  }, [carrinho, disponiveis])

  const chTotal = carrinho.reduce((sum, cod) => {
    const d = disponiveis.find(x => x.codigo === cod)
    return sum + (d?.ch ?? 0)
  }, 0)

  const disciplinasFiltradas = disponiveis.filter(d => {
    if (confirmadas.includes(d.codigo)) return false
    const matchBusca = !busca || d.nome.toLowerCase().includes(busca.toLowerCase()) || d.codigo.toLowerCase().includes(busca.toLowerCase())
    if (!matchBusca) return false
    if (filtro === 'disponiveis') return vagasLivres(d) > 0
    if (filtro === 'prereq') return prereqOk(d)
    return true
  })

  return (
    <>
      <div className="mt-section mt-matricula-layout">

        {/* ── Coluna principal: cards ── */}
        <div className="mt-cards-col">
          <div className="mt-mat-header">
            <div>
              <h2 className="mt-section-title">Processo de Matrícula — 2026.2</h2>
              <p className="mt-section-sub">
                Matriculado(a) em <strong>{matriculadas.length}</strong> disciplinas no semestre atual.
                Selecione as do próximo.
              </p>
            </div>

            <div className="mt-filtros">
              <div className="mt-busca-wrap">
                <Search size={16} className="mt-busca-icon" />
                <input
                  className="mt-busca"
                  placeholder="Buscar disciplina..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />
              </div>
              <div className="mt-filtro-tabs">
                {(Object.keys(FILTRO_LABEL) as Filtro[]).map(f => (
                  <button
                    key={f}
                    className={`mt-filtro-tab ${filtro === f ? 'mt-filtro-tab--active' : ''}`}
                    onClick={() => setFiltro(f)}
                  >
                    {FILTRO_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {disciplinasFiltradas.length === 0 ? (
            <div className="mt-empty">
              <Search size={40} className="mt-empty-icon" />
              <p>
                {confirmadas.length > 0 && busca === '' && filtro === 'todas'
                  ? 'Todas as disciplinas disponíveis já foram confirmadas.'
                  : 'Nenhuma disciplina encontrada'}
              </p>
              {(busca !== '' || filtro !== 'todas') && (
                <button className="mt-btn mt-btn-sec" onClick={() => { setBusca(''); setFiltro('todas') }}>
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="mt-disc-cards">
              {disciplinasFiltradas.map(d => {
                const livres   = vagasLivres(d)
                const selected = carrinho.includes(d.codigo)
                const semVaga  = livres === 0
                const okPrereq = prereqOk(d)
                const conflito = selected && conflitos.some(c => c.includes(d.codigo))

                return (
                  <div
                    key={d.codigo}
                    className={`mt-disc-card ${selected ? 'mt-disc-card--selected' : ''} ${conflito ? 'mt-disc-card--conflito' : ''} ${semVaga && !selected ? 'mt-disc-card--esgotada' : ''}`}
                  >
                    <div className="mt-disc-card-accent" style={{
                      background: selected ? '#1B3A6B' : semVaga ? '#E2E8F0' : '#EBF2FF'
                    }} />

                    <div className="mt-disc-card-body">
                      <div className="mt-disc-card-top">
                        <div>
                          <div className="mt-disc-card-nome">{d.nome}</div>
                          <div className="mt-disc-card-codigo">{d.codigo} · {d.professor}</div>
                        </div>
                        <div className="mt-disc-card-badges">
                          {conflito && (
                            <span className="mt-badge mt-badge--error" title="Conflito de horário">
                              <AlertTriangle size={10} /> Conflito
                            </span>
                          )}
                          <span className={`mt-badge mt-badge--prereq ${okPrereq ? 'mt-badge--ok' : 'mt-badge--fail'}`}>
                            {okPrereq ? <Check size={10} /> : <X size={10} />} {d.prereq}
                          </span>
                        </div>
                      </div>

                      <div className="mt-disc-card-info">
                        <span className="mt-disc-info-item"><Clock size={12} /> {d.horarios}</span>
                        <span className="mt-disc-info-item"><BookOpen size={12} /> {d.ch}h</span>
                        <span className={`mt-vagas ${semVaga ? 'mt-vagas-esgotadas' : livres <= 5 ? 'mt-vagas-poucas' : 'mt-vagas-ok'}`}>
                          {semVaga
                            ? <><XCircle size={12} /> Esgotado</>
                            : <><CheckCircle size={12} /> {livres}/{d.vagas} vagas</>
                          }
                        </span>
                      </div>
                    </div>

                    <button
                      className={`mt-disc-select-btn ${selected ? 'mt-disc-select-btn--selecionada' : ''}`}
                      disabled={semVaga && !selected}
                      onClick={() => toggle(d.codigo)}
                      aria-pressed={selected}
                    >
                      {selected ? <><Check size={12} /> Selecionada</> : semVaga ? 'Esgotada' : '+ Selecionar'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Carrinho lateral ── */}
        <aside className="mt-cart">
          <div className="mt-cart-header">
            <span className="mt-cart-title"><ShoppingCart size={16} /> Carrinho</span>
            <span className="mt-cart-count">{carrinho.length} disciplina(s)</span>
          </div>

          {carrinho.length === 0 ? (
            <div className="mt-cart-empty">
              <span>Nenhuma disciplina selecionada</span>
              <span className="mt-cart-empty-hint">Clique em "+ Selecionar" nos cards</span>
            </div>
          ) : (
            <div className="mt-cart-items">
              {carrinho.map(cod => {
                const d = disponiveis.find(x => x.codigo === cod)
                if (!d) return null
                const conflito = conflitos.some(c => c.includes(cod))
                return (
                  <div key={cod} className={`mt-cart-item ${conflito ? 'mt-cart-item--conflito' : ''}`}>
                    <div className="mt-cart-item-info">
                      <div className="mt-cart-item-nome">{d.nome}</div>
                      <div className="mt-cart-item-meta">{d.horarios} · {d.ch}h</div>
                      {conflito && (
                        <div className="mt-cart-item-aviso">
                          <AlertTriangle size={12} /> Conflito de horário
                        </div>
                      )}
                    </div>
                    <button className="mt-cart-remove" onClick={() => removerDoCarrinho(cod)} aria-label={`Remover ${d.nome}`}>
                      <X size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {carrinho.length > 0 && (
            <div className="mt-cart-footer">
              <div className="mt-cart-total">
                <span>Carga horária total</span>
                <strong>{chTotal}h</strong>
              </div>

              {conflitos.length > 0 && (
                <div className="mt-cart-conflitos-aviso">
                  <AlertTriangle size={14} /> {conflitos.length} conflito(s) de horário detectado(s)
                </div>
              )}

              <button
                className="mt-btn mt-btn-primary mt-btn-full"
                disabled={carrinho.length === 0 || confirmando}
                onClick={confirmar}
              >
                {confirmando ? 'Enviando…' : 'Confirmar Pré-matrícula'}
              </button>

              {conflitos.length > 0 && (
                <p className="mt-cart-conflito-hint">Você pode confirmar mesmo com conflitos, mas revise os horários.</p>
              )}
            </div>
          )}

          {/* ── Disciplinas já confirmadas ── */}
          {confirmadas.length > 0 && (
            <div className="mt-cart-confirmadas">
              <div className="mt-confirmadas-header">
                <span><CheckCircle size={13} /> {confirmadas.length} confirmada(s)</span>
                <button className="mt-confirmadas-limpar" onClick={() => setConfirmadas([])}>Limpar</button>
              </div>
              {confirmadas.map(cod => {
                const d = disponiveis.find(x => x.codigo === cod)
                if (!d) return null
                return (
                  <div key={cod} className="mt-confirmada-item">
                    <span className="mt-confirm-codigo">{d.codigo}</span>
                    <span className="mt-confirmada-nome">{d.nome}</span>
                  </div>
                )
              })}
            </div>
          )}
        </aside>
      </div>

      {toast && <div className="mt-toast">{toast}</div>}
    </>
  )
}
