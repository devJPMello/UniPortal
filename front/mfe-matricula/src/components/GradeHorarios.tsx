import { grade } from '../data/mockData'

const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
const HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
const CELL_H = 44 // px por hora

export default function GradeHorarios() {
  return (
    <div className="mt-section">
      <h2 className="mt-section-title">Grade de Horários — 2024.2</h2>

      <div className="mt-grade-wrap">
        {/* Legenda de disciplinas */}
        <div className="mt-legenda">
          {[...new Map(grade.map((a) => [a.disciplina, a])).values()].map((a) => (
            <span key={a.id} className="mt-leg-item">
              <span className="mt-leg-dot" style={{ background: a.cor }} />
              {a.sigla} — {a.disciplina}
            </span>
          ))}
        </div>

        {/* Timetable grid */}
        <div className="mt-grid-outer">
          {/* Header de dias */}
          <div className="mt-grid-header">
            <div className="mt-grid-corner" />
            {DIAS.map((d) => (
              <div key={d} className="mt-grid-day">{d}</div>
            ))}
          </div>

          {/* Corpo */}
          <div className="mt-grid-body" style={{ height: HORAS.length * CELL_H }}>
            {/* Coluna de horas */}
            <div className="mt-grid-times">
              {HORAS.map((h) => (
                <div key={h} className="mt-grid-time" style={{ height: CELL_H }}>
                  {String(h).padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* Colunas dos dias */}
            {DIAS.map((_, dIdx) => {
              const diaNum = (dIdx + 1) as 1 | 2 | 3 | 4 | 5
              const aulasNoDia = grade.filter((a) => a.dia === diaNum)
              return (
                <div key={dIdx} className="mt-grid-col" style={{ height: HORAS.length * CELL_H }}>
                  {/* Linhas de grade */}
                  {HORAS.map((h) => (
                    <div key={h} className="mt-grid-cell" style={{ height: CELL_H }} />
                  ))}
                  {/* Aulas */}
                  {aulasNoDia.map((aula) => {
                    const top = (aula.inicio - HORAS[0]) * CELL_H
                    const height = aula.duracao * CELL_H - 4
                    return (
                      <div
                        key={aula.id}
                        className="mt-aula"
                        style={{ top, height, background: aula.cor }}
                        title={`${aula.disciplina}\n${aula.professor}\nSala: ${aula.sala}`}
                      >
                        <span className="mt-aula-sigla">{aula.sigla}</span>
                        <span className="mt-aula-hora">{String(aula.inicio).padStart(2,'0')}–{String(aula.inicio + aula.duracao).padStart(2,'0')}h</span>
                        <span className="mt-aula-sala">{aula.sala}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
