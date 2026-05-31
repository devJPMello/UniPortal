import { semAtual, type Disciplina } from '../data/mockData'

function media(d: Disciplina) {
  if (d.av1 !== null && d.av2 !== null) return ((d.av1 + d.av2) / 2).toFixed(1)
  return '—'
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

export default function Boletim() {
  return (
    <div className="ac-section">
      <div className="ac-section-header">
        <h2 className="ac-section-title">Boletim — 2024.2</h2>
        <span className="ac-sem-badge">Semestre em Curso</span>
      </div>

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
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {semAtual.map((d) => {
              const { color, bg } = situacaoStyle[d.situacao]
              return (
                <tr key={d.codigo}>
                  <td>
                    <div className="ac-disc-name">{d.nome}</div>
                    <div className="ac-disc-code">{d.codigo}</div>
                  </td>
                  <td className="ac-prof">{d.professor}</td>
                  <td className={`ac-nota ${notaClass(d.av1)}`}>
                    {d.av1 !== null ? d.av1.toFixed(1) : '—'}
                  </td>
                  <td className={`ac-nota ${notaClass(d.av2)}`}>
                    {d.av2 !== null ? d.av2.toFixed(1) : '—'}
                  </td>
                  <td className="ac-nota ac-nota-media">{media(d)}</td>
                  <td className="ac-ch">{d.ch}h</td>
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
