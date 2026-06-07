import pool from '../db/connection.js'

export async function getBoletos(ra) {
  const { rows } = await pool.query(
    `SELECT id, mes, valor::float AS valor, vencimento, status, codigo
     FROM   boletos
     WHERE  aluno_ra = $1
     ORDER  BY id DESC`,
    [ra]
  )

  const pagos    = rows.filter((b) => b.status === 'pago')
  const pendente = rows.find((b) => b.status === 'pendente')
  const vencidos = rows.filter((b) => b.status === 'vencido')

  const resumo = {
    mensalidadesPagas: pagos.length,
    totalPago:         pagos.reduce((s, b) => s + b.valor, 0),
    boletosPendentes:  pendente?.valor ?? null,
    boletosVencidos:   vencidos.length,
  }

  return { ra, boletos: rows, resumo }
}
