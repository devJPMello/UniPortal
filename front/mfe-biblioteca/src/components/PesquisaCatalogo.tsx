import { useState } from 'react'
import type { LivroCatalogo } from '../data/mockData'

interface Props {
  catalogo: LivroCatalogo[]
}

export default function PesquisaCatalogo({ catalogo }: Props) {
  const [filtro, setFiltro] = useState('')
  const [toast,  setToast]  = useState<string | null>(null)

  function reservar(titulo: string) {
    setToast(`✓ "${titulo}" reservado!`)
    setTimeout(() => setToast(null), 2500)
  }

  const resultados = filtro
    ? catalogo.filter(
        (l) =>
          l.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
          l.autor.toLowerCase().includes(filtro.toLowerCase())
      )
    : catalogo

  return (
    <>
      <div className="bl-pesquisa-box">
        <input
          className="bl-input"
          placeholder="Buscar por título ou autor..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {resultados.length === 0 ? (
        <div className="bl-empty">Nenhum resultado encontrado.</div>
      ) : (
        resultados.map((l, i) => (
          <div key={i} className="bl-result-card">
            <div>
              <div className="bl-result-name">{l.titulo}</div>
              <div className="bl-result-sub">
                {l.autor} ·{' '}
                {l.disponivel ? (
                  <span style={{ color: '#38A169' }}>Disponível</span>
                ) : (
                  <span style={{ color: '#E53E3E' }}>Indisponível</span>
                )}
              </div>
            </div>
            {l.disponivel ? (
              <button className="bl-reservar-btn" onClick={() => reservar(l.titulo)}>
                Reservar
              </button>
            ) : (
              <button className="bl-reservar-btn" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                Indisponível
              </button>
            )}
          </div>
        ))
      )}

      {toast && <div className="bl-toast show">{toast}</div>}
    </>
  )
}
