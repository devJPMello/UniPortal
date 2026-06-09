import { useState } from 'react'
import { Search, X, Check, Bell } from 'lucide-react'
import type { LivroCatalogo } from '../data/mockData'

interface Props {
  catalogo: LivroCatalogo[]
}

export default function PesquisaCatalogo({ catalogo }: Props) {
  const [filtro,     setFiltro]     = useState('')
  const [toast,      setToast]      = useState<string | null>(null)
  const [reservados, setReservados] = useState<Set<string>>(new Set())

  function reservar(titulo: string, disponivel: boolean) {
    setReservados(prev => new Set([...prev, titulo]))
    const msg = disponivel
      ? `"${titulo}" reservado com sucesso!`
      : `Você será notificado quando "${titulo}" estiver disponível.`
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const resultados = filtro
    ? catalogo.filter(
        l =>
          l.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
          l.autor.toLowerCase().includes(filtro.toLowerCase())
      )
    : catalogo

  const disponiveisCount = catalogo.filter(l => l.disponivel).length

  return (
    <>
      <div className="bl-pesquisa-header">
        <div className="bl-pesquisa-box">
          <Search size={16} className="bl-pesquisa-icon" />
          <input
            className="bl-input"
            placeholder="Buscar por título ou autor..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
          />
          {filtro && (
            <button className="bl-pesquisa-clear" onClick={() => setFiltro('')} aria-label="Limpar busca">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="bl-catalogo-stats">
          <span className="bl-catalogo-stat bl-catalogo-stat--ok">
            <span className="bl-stat-dot bl-stat-dot--ok" />{disponiveisCount} disponíveis
          </span>
          <span className="bl-catalogo-stat bl-catalogo-stat--off">
            <span className="bl-stat-dot bl-stat-dot--off" />{catalogo.length - disponiveisCount} indisponíveis
          </span>
        </div>
      </div>

      {resultados.length === 0 ? (
        <div className="bl-empty">
          <Search size={40} className="bl-empty-icon" />
          <p>Nenhum resultado para "<strong>{filtro}</strong>"</p>
          <button className="bl-limpar-btn" onClick={() => setFiltro('')}>Limpar busca</button>
        </div>
      ) : (
        <div className="bl-catalogo-list">
          {resultados.map((l, i) => {
            const foiReservado = reservados.has(l.titulo)
            return (
              <div key={i} className="bl-result-card">
                <div className="bl-result-accent" style={{ background: l.disponivel ? '#38A169' : '#CBD5E0' }} />
                <div className="bl-result-body">
                  <div className="bl-result-name">{l.titulo}</div>
                  <div className="bl-result-sub">{l.autor}</div>
                </div>
                <div className="bl-result-right">
                  <span className={`bl-disp-badge ${l.disponivel ? 'bl-disp-badge--ok' : 'bl-disp-badge--off'}`}>
                    {l.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                  {l.disponivel ? (
                    <button
                      className={`bl-reservar-btn ${foiReservado ? 'bl-reservar-btn--done' : ''}`}
                      onClick={() => !foiReservado && reservar(l.titulo, true)}
                      disabled={foiReservado}
                    >
                      {foiReservado ? <><Check size={13} /> Reservado</> : 'Reservar'}
                    </button>
                  ) : (
                    <button
                      className={`bl-reservar-btn bl-reservar-btn--notify ${foiReservado ? 'bl-reservar-btn--done' : ''}`}
                      onClick={() => !foiReservado && reservar(l.titulo, false)}
                      disabled={foiReservado}
                    >
                      {foiReservado ? <><Check size={13} /> Aguardando</> : <><Bell size={13} /> Notificar</>}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {toast && <div className="bl-toast show">{toast}</div>}
    </>
  )
}
