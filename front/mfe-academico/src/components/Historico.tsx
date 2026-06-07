import { type SemestreHistorico, type Disciplina } from '../data/mockData'

interface Props {
  semestres: SemestreHistorico[]
}

function media(d: Disciplina) {
  if (d.av1 !== null && d.av2 !== null) return ((d.av1 + d.av2) / 2).toFixed(1)
  return '—'
}

const situacaoStyle: Record<string, { color: string; bg: string }> = {
  'Aprovado':  { color: '#38A169', bg: '#F0FFF4' },
  'Reprovado': { color: '#E53E3E', bg: '#FFF5F5' },
}

export default function Historico({ semestres }: Props) {
  const todas         = semestres.flatMap((s) => s.disciplinas)
  const totalAprovadas  = todas.filter((d) => d.situacao === 'Aprovado').length
  const totalReprovadas = todas.filter((d) => d.situacao === 'Reprovado').length
  const chTotal         = todas.filter((d) => d.situacao === 'Aprovado').reduce((a, d) => a + d.ch, 0)

  return (
    <div className="ac-section">
      <div className="ac-section-header">
        <h2 className="ac-section-title">Histórico Escolar</h2>
      </div>

      <div className="ac-hist-summary">
        <div className="ac-hist-stat">
          <span className="ac-hist-stat-val">{totalAprovadas}</span>
          <span className="ac-hist-stat-lbl">Disciplinas Aprovadas</span>
        </div>
        <div className="ac-hist-stat">
          <span className="ac-hist-stat-val ac-nota-low">{totalReprovadas}</span>
          <span className="ac-hist-stat-lbl">Reprovadas</span>
        </div>
        <div className="ac-hist-stat">
          <span className="ac-hist-stat-val">{chTotal}h</span>
          <span className="ac-hist-stat-lbl">Carga Horária Integralizada</span>
        </div>
      </div>

      {semestres.map((sem) => (
        <div key={sem.periodo} className="ac-hist-sem">
          <h3 className="ac-hist-periodo">{sem.periodo}</h3>
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
                {sem.disciplinas.map((d) => {
                  const { color, bg } = situacaoStyle[d.situacao] ?? { color: '#718096', bg: '#F7FAFC' }
                  return (
                    <tr key={d.codigo}>
                      <td>
                        <div className="ac-disc-name">{d.nome}</div>
                        <div className="ac-disc-code">{d.codigo}</div>
                      </td>
                      <td className="ac-prof">{d.professor}</td>
                      <td className="ac-nota">{d.av1?.toFixed(1) ?? '—'}</td>
                      <td className="ac-nota">{d.av2?.toFixed(1) ?? '—'}</td>
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
        </div>
      ))}
    </div>
  )
}
