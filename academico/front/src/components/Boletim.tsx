import { useMemo } from 'react'
import { type Disciplina } from '../data/mockData'

interface Props {
  disciplinas: Disciplina[]
  periodo: string
}

function mediaNum(d: Disciplina): number | null {
  if (d.av1 !== null && d.av2 !== null) return (d.av1 + d.av2) / 2
  if (d.av1 !== null) return d.av1
  return null
}

function notaClass(n: number | null) {
  if (n === null) return ''
  return n < 6 ? 'ac-nota-low' : n >= 8.5 ? 'ac-nota-high' : ''
}

const situacaoStyle: Record<string, { color: string; bg: string }> = {
  'Em Curso':  { color: '#3182CE', bg: '#EBF8FF' },
  'Aprovado':  { color: '#38A169', bg: '#F0FFF4' },
  'Reprovado': { color: '#E53E3E', bg: '#FFF5F5' },
}

export default function Boletim({ disciplinas, periodo }: Props) {
  const ira = useMemo(() => {
    const comNota = disciplinas.filter(d => d.av1 !== null)
    if (!comNota.length) return null
    const sumProd = comNota.reduce((s, d) => s + (mediaNum(d) ?? d.av1!) * d.ch, 0)
    const sumCH   = comNota.reduce((s, d) => s + d.ch, 0)
    return sumProd / sumCH
  }, [disciplinas])

  const iraColor = ira === null ? '#3182CE' : ira >= 8 ? '#38A169' : ira >= 6 ? '#D69E2E' : '#E53E3E'
  const iraClass  = ira === null ? '' : ira >= 8 ? 'ac-ira--high' : ira >= 6 ? 'ac-ira--mid' : 'ac-ira--low'

  return (
    <div className="ac-section">
      <div className="ac-section-header">
        <h2 className="ac-section-title">Boletim: {periodo}</h2>
        <span className="ac-sem-badge">Semestre em Curso</span>
      </div>

      {ira !== null && (
        <div className="ac-ira-card">
          <div className="ac-ira-left">
            <div className="ac-ira-label">IRA Parcial</div>
            <div className={`ac-ira-valor ${iraClass}`}>{ira.toFixed(2)}</div>
            <div className="ac-ira-hint">Índice de Rendimento Acadêmico</div>
          </div>
          <div className="ac-ira-bar-wrap">
            <div className="ac-ira-track">
              <div className="ac-ira-fill" style={{ width: `${(ira / 10) * 100}%`, background: iraColor }} />
            </div>
            <div className="ac-ira-scale">
              <span>0</span><span>5.0</span><span>10</span>
            </div>
          </div>
        </div>
      )}

      <div className="ac-table-wrap">
        <table className="ac-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>AV1</th>
              <th>AV2</th>
              <th>Média</th>
              <th>C.H.</th>
              <th>Frequência</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((d) => {
              const { color, bg } = situacaoStyle[d.situacao] ?? { color: '#718096', bg: '#F7FAFC' }
              const m = mediaNum(d)
              const faltasPct = d.totalAulas ? ((d.faltas ?? 0) / d.totalAulas) * 100 : null
              const perigo  = faltasPct !== null && faltasPct >= 20
              const atencao = faltasPct !== null && faltasPct >= 10 && !perigo

              return (
                <tr key={d.codigo}>
                  <td>
                    <div className="ac-disc-name">{d.nome}</div>
                    <div className="ac-disc-code">{d.codigo}</div>
                  </td>
                  <td className="ac-prof">{d.professor}</td>
                  <td className={`ac-nota ${notaClass(d.av1)}`}>
                    {d.av1 !== null ? d.av1.toFixed(1) : 'N/A'}
                  </td>
                  <td className={`ac-nota ${notaClass(d.av2)}`}>
                    {d.av2 !== null ? d.av2.toFixed(1) : 'N/A'}
                  </td>
                  <td className={`ac-nota ac-nota-media ${notaClass(m)}`}>
                    {m !== null ? m.toFixed(1) : 'N/A'}
                  </td>
                  <td className="ac-ch">{d.ch}h</td>
                  <td className="ac-freq-cell">
                    {faltasPct !== null ? (
                      <div className="ac-freq-wrap">
                        <div className="ac-freq-track">
                          <div
                            className="ac-freq-fill"
                            style={{
                              width: `${Math.min(faltasPct, 100)}%`,
                              background: perigo ? '#E53E3E' : atencao ? '#D69E2E' : '#38A169',
                            }}
                          />
                        </div>
                        <span className={`ac-freq-txt ${perigo ? 'ac-nota-low' : atencao ? 'ac-nota-warn' : ''}`}>
                          {d.faltas}/{d.totalAulas}
                        </span>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td>
                    <span className="ac-badge" style={{ color, background: bg }}>
                      {d.situacao}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="ac-legenda">
        <span className="ac-leg-item"><span className="ac-leg-dot" style={{ background: '#EBF8FF', border: '1px solid #3182CE' }} /> Em Curso</span>
        <span className="ac-leg-item"><span className="ac-leg-dot" style={{ background: '#F0FFF4', border: '1px solid #38A169' }} /> Aprovado</span>
        <span className="ac-leg-item"><span className="ac-leg-dot" style={{ background: '#FFF5F5', border: '1px solid #E53E3E' }} /> Reprovado</span>
        <span className="ac-leg-sep" />
        <span className="ac-leg-text ac-nota-low">nota &lt; 6.0</span>
        <span className="ac-leg-text ac-nota-high">nota ≥ 8.5</span>
      </div>
    </div>
  )
}
