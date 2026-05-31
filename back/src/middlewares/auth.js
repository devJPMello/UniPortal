// Valida o token SSO passado no header Authorization: Bearer <token>
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const user = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
}
