import pool from '../db/connection.js'

export async function getEmprestimos(ra) {
  const [empAtivos, hist, cat] = await Promise.all([
    pool.query(
      `SELECT id, titulo, autor, isbn, emprestado, devolucao, status, icon
       FROM   emprestimos
       WHERE  aluno_ra = $1 AND status IN ('ativo', 'atrasado')
       ORDER  BY id`,
      [ra]
    ),
    pool.query(
      `SELECT titulo, autor, emprestado, devolvido, icon
       FROM   emprestimos
       WHERE  aluno_ra = $1 AND status = 'devolvido'
       ORDER  BY id DESC`,
      [ra]
    ),
    pool.query(
      `SELECT titulo, autor, disponivel
       FROM   catalogo_biblioteca
       ORDER  BY id`
    ),
  ])

  return {
    ra,
    emprestimosAtivos: empAtivos.rows,
    historico:         hist.rows,
    catalogo:          cat.rows,
  }
}
