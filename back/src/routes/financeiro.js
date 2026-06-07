import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getBoletos } from '../data/financeiro.js'

const router = Router()
router.use(authMiddleware)

router.get('/boletos', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getBoletos(req.user.ra) })
  } catch {
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar boletos' })
  }
})

export default router
