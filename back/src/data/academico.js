import pool from '../db/connection.js'

export async function getBoletim(ra) {
  const { rows } = await pool.query(
    `SELECT d.codigo, d.nome, d.professor, d.ch,
            m.av1, m.av2, m.situacao, m.faltas, m.periodo
     FROM   matriculas_atual m
     JOIN   disciplinas d ON d.codigo = m.disciplina_codigo
     WHERE  m.aluno_ra = $1
     ORDER  BY d.codigo`,
    [ra]
  )

  return {
    ra,
    periodo: rows[0]?.periodo ?? '2024.2',
    disciplinas: rows.map((r) => ({
      codigo:   r.codigo,
      nome:     r.nome,
      professor:r.professor,
      ch:       r.ch,
      av1:      r.av1   !== null ? Number(r.av1)   : null,
      av2:      r.av2   !== null ? Number(r.av2)   : null,
      situacao: r.situacao,
      faltas:   r.faltas,
    })),
  }
}

export async function getHistorico(ra) {
  const { rows } = await pool.query(
    `SELECT d.codigo, d.nome, d.professor, d.ch,
            h.av1, h.av2, h.situacao, h.periodo
     FROM   historico h
     JOIN   disciplinas d ON d.codigo = h.disciplina_codigo
     WHERE  h.aluno_ra = $1
     ORDER  BY h.periodo DESC, d.codigo`,
    [ra]
  )

  const periodos  = [...new Set(rows.map((r) => r.periodo))]
  const semestres = periodos.map((periodo) => ({
    periodo,
    disciplinas: rows
      .filter((r) => r.periodo === periodo)
      .map((r) => ({
        codigo:    r.codigo,
        nome:      r.nome,
        professor: r.professor,
        ch:        r.ch,
        av1:       r.av1 !== null ? Number(r.av1) : null,
        av2:       r.av2 !== null ? Number(r.av2) : null,
        situacao:  r.situacao,
      })),
  }))

  return { ra, semestres }
}
