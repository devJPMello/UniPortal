import { GraduationCap, AlertTriangle, Check, BookOpen, Star } from 'lucide-react'
import { type SemestreHistorico, type Disciplina } from '../data/mockData'

interface Props {
  semestres: SemestreHistorico[]
}

function mediaNum(d: Disciplina): number | null {
  if (d.av1 !== null && d.av2 !== null) return (d.av1 + d.av2) / 2
  return null
}

function semestreIRA(disciplinas: Disciplina[]): number | null {
  const completas = disciplinas.filter(d => d.av1 !== null && d.av2 !== null)
  if (!completas.length) return null
  const sumProd = completas.reduce((s, d) => s + (mediaNum(d)!) * d.ch, 0)
  const sumCH   = completas.reduce((s, d) => s + d.ch, 0)
  return sumProd / sumCH
}

function GradeBars({ disciplinas }: { disciplinas: Disciplina[] }) {
  return (
    <div className="ac-grade-bars">
      {disciplinas.map(d => {
        const m = mediaNum(d)
        const h = m !== null ? (m / 10) * 100 : 0
        const color = m === null ? '#E2E8F0' : m >= 8.5 ? '#38A169' : m >= 6 ? '#3182CE' : '#E53E3E'
        return (
          <div key={d.codigo} className="ac-grade-bar-col" title={`${d.nome}: ${m?.toFixed(1) ?? 'N/A'}`}>
            <div className="ac-grade-bar-track">
              <div className="ac-grade-bar-fill" style={{ height: `${h}%`, background: color }} />
            </div>
            <div className="ac-grade-bar-lbl">{d.codigo.slice(-3)}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function Historico({ semestres }: Props) {
  const todas          = semestres.flatMap(s => s.disciplinas)
  const aprovadas      = todas.filter(d => d.situacao === 'Aprovado')
  const reprovadas     = todas.filter(d => d.situacao === 'Reprovado')
  const chTotal        = aprovadas.reduce((a, d) => a + d.ch, 0)
  const iraGlobal      = semestreIRA(todas)

  return (
    <div className="ac-section">
      <div className="ac-section-header">
        <h2 className="ac-section-title">Histórico Escolar</h2>
      </div>

      <div className="ac-hist-summary">
        <div className="ac-hist-stat ac-hist-stat--primary">
          <span className="ac-hist-stat-icon"><GraduationCap size={20} /></span>
          <span className="ac-hist-stat-val">{aprovadas.length}</span>
          <span className="ac-hist-stat-lbl">Aprovadas</span>
        </div>
        <div className={`ac-hist-stat ${reprovadas.length > 0 ? 'ac-hist-stat--error' : 'ac-hist-stat--success'}`}>
          <span className="ac-hist-stat-icon">
            {reprovadas.length > 0 ? <AlertTriangle size={20} /> : <Check size={20} />}
          </span>
          <span className={`ac-hist-stat-val ${reprovadas.length > 0 ? 'ac-nota-low' : ''}`}>{reprovadas.length}</span>
          <span className="ac-hist-stat-lbl">Reprovadas</span>
        </div>
        <div className="ac-hist-stat ac-hist-stat--info">
          <span className="ac-hist-stat-icon"><BookOpen size={20} /></span>
          <span className="ac-hist-stat-val">{chTotal}h</span>
          <span className="ac-hist-stat-lbl">CH Integralizada</span>
        </div>
        {iraGlobal !== null && (
          <div className="ac-hist-stat ac-hist-stat--ira">
            <span className="ac-hist-stat-icon"><Star size={20} /></span>
            <span className={`ac-hist-stat-val ${iraGlobal >= 8 ? 'ac-nota-high' : iraGlobal < 6 ? 'ac-nota-low' : ''}`}>
              {iraGlobal.toFixed(2)}
            </span>
            <span className="ac-hist-stat-lbl">IRA Global</span>
          </div>
        )}
      </div>

      {semestres.map(sem => {
        const irasSem = semestreIRA(sem.disciplinas)
        const aprov   = sem.disciplinas.filter(d => d.situacao === 'Aprovado').length
        const reprov  = sem.disciplinas.filter(d => d.situacao === 'Reprovado').length

        return (
          <div key={sem.periodo} className="ac-hist-sem">
            <div className="ac-hist-sem-header">
              <div>
                <h3 className="ac-hist-periodo">{sem.periodo}</h3>
                <div className="ac-hist-sem-stats">
                  {irasSem !== null && (
                    <span className="ac-hist-sem-stat">IRA: <strong>{irasSem.toFixed(2)}</strong></span>
                  )}
                  <span className="ac-hist-sem-stat ac-nota-high">{aprov} aprovadas</span>
                  {reprov > 0 && <span className="ac-hist-sem-stat ac-nota-low">{reprov} reprovadas</span>}
                </div>
              </div>
              <GradeBars disciplinas={sem.disciplinas} />
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
                  {sem.disciplinas.map(d => {
                    const m = mediaNum(d)
                    const mColor = m === null ? '#718096' : m >= 8.5 ? '#38A169' : m >= 6 ? '#1B3A6B' : '#E53E3E'
                    const sitStyle = d.situacao === 'Aprovado'
                      ? { color: '#38A169', bg: '#F0FFF4' }
                      : { color: '#E53E3E', bg: '#FFF5F5' }

                    return (
                      <tr key={d.codigo}>
                        <td>
                          <div className="ac-disc-name">{d.nome}</div>
                          <div className="ac-disc-code">{d.codigo}</div>
                        </td>
                        <td className="ac-prof">{d.professor}</td>
                        <td className="ac-nota">{d.av1?.toFixed(1) ?? 'N/A'}</td>
                        <td className="ac-nota">{d.av2?.toFixed(1) ?? 'N/A'}</td>
                        <td className="ac-nota ac-nota-media" style={{ color: mColor }}>
                          {m?.toFixed(1) ?? 'N/A'}
                        </td>
                        <td className="ac-ch">{d.ch}h</td>
                        <td>
                          <span className="ac-badge" style={{ color: sitStyle.color, background: sitStyle.bg }}>
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
        )
      })}
    </div>
  )
}
