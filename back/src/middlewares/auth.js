import jwt from 'jsonwebtoken'
import logger from '../logger.js'

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ sucesso: false, erro: 'Token não fornecido' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload.ra || !payload.nome) {
      return res.status(401).json({ sucesso: false, erro: 'Token inválido: campos obrigatórios ausentes' })
    }
    req.user = payload
    next()
  } catch (err) {
    logger.warn({ err: err.message }, 'Token JWT inválido')
    return res.status(401).json({ sucesso: false, erro: 'Token inválido ou expirado' })
  }
}
