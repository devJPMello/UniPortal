import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../db/connection.js'
import logger from '../logger.js'

const router = Router()

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autenticar aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ra, senha]
 *             properties:
 *               ra:
 *                 type: string
 *                 pattern: '^\d{7}$'
 *                 example: '2024001'
 *               senha:
 *                 type: string
 *                 minLength: 4
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna token JWT
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais incorretas
 */
router.post('/login', async (req, res) => {
  const { ra, senha } = req.body ?? {}

  if (!ra || typeof ra !== 'string' || !/^\d{7}$/.test(ra.trim())) {
    return res.status(400).json({ sucesso: false, erro: 'RA deve conter exatamente 7 dígitos.' })
  }
  if (!senha || typeof senha !== 'string' || senha.trim().length < 4) {
    return res.status(400).json({ sucesso: false, erro: 'Senha deve ter pelo menos 4 caracteres.' })
  }

  try {
    const { rows } = await pool.query(
      'SELECT ra, nome, curso, semestre, email, senha_hash FROM alunos WHERE ra = $1',
      [ra.trim()],
    )

    const aluno = rows[0]
    if (!aluno) {
      return res.status(401).json({ sucesso: false, erro: 'RA ou senha inválidos.' })
    }

    const senhaValida = await bcrypt.compare(senha, aluno.senha_hash)
    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, erro: 'RA ou senha inválidos.' })
    }

    const payload = {
      ra: aluno.ra,
      nome: aluno.nome,
      curso: aluno.curso,
      semestre: aluno.semestre,
      email: aluno.email,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })

    logger.info({ ra: aluno.ra }, 'Login bem-sucedido')
    res.json({ sucesso: true, token })
  } catch (err) {
    logger.error({ err }, 'Erro no login')
    res.status(500).json({ sucesso: false, erro: 'Erro interno.' })
  }
})

export default router
