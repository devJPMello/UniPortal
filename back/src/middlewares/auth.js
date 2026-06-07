export function authMiddleware(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ sucesso: false, erro: 'Token não fornecido' })
  }

  try {
    const user = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    if (!user.ra || !user.nome) {
      return res.status(401).json({ sucesso: false, erro: 'Token inválido: campos obrigatórios ausentes' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ sucesso: false, erro: 'Token inválido' })
  }
}
