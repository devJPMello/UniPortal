import pool from '../db/connection.js'

export async function getGrade(ra) {
  const { rows } = await pool.query(
    `SELECT gh.id, d.nome AS disciplina, d.sigla, d.professor,
            gh.dia, gh.inicio, gh.duracao, gh.sala, gh.cor,
            m.periodo
     FROM   grade_horarios gh
     JOIN   disciplinas d ON d.codigo = gh.disciplina_codigo
     JOIN   matriculas_atual m
              ON  m.disciplina_codigo = gh.disciplina_codigo
              AND m.aluno_ra          = $1
     ORDER  BY gh.dia, gh.inicio`,
    [ra]
  )

  return {
    ra,
    periodo: rows[0]?.periodo ?? '2024.2',
    aulas: rows.map((r) => ({
      id:         r.id,
      disciplina: r.disciplina,
      sigla:      r.sigla ?? r.disciplina.slice(0, 3).toUpperCase(),
      professor:  r.professor,
      dia:        r.dia,
      inicio:     r.inicio,
      duracao:    r.duracao,
      sala:       r.sala,
      cor:        r.cor,
    })),
  }
}

export async function getDisciplinasDisponiveis(_ra) {
  const { rows } = await pool.query(
    `SELECT codigo, nome, professor, ch,
            vagas, vagas_ocupadas AS "vagasOcupadas",
            horarios, prereq
     FROM   disciplinas_disponiveis
     ORDER  BY codigo`
  )

  return rows.map((r) => ({
    codigo:        r.codigo,
    nome:          r.nome,
    professor:     r.professor,
    ch:            r.ch,
    vagas:         r.vagas,
    vagasOcupadas: r.vagasOcupadas,
    horarios:      r.horarios,
    prereq:        r.prereq,
  }))
}

export async function confirmarMatricula(ra, disciplinas) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const codigo of disciplinas) {
      await client.query(
        `INSERT INTO pre_matriculas (aluno_ra, disciplina_codigo)
         VALUES ($1, $2)
         ON CONFLICT (aluno_ra, disciplina_codigo) DO NOTHING`,
        [ra, codigo]
      )
    }
    await client.query('COMMIT')
    return {
      mensagem: 'Pré-matrícula registrada com sucesso. O resultado será divulgado em 25/11/2024.',
      disciplinasMatriculadas: disciplinas,
      ra,
    }
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
