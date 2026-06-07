import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getBoletim, getHistorico } from '../data/academico.js'

const router = Router()
router.use(authMiddleware)

router.get('/boletim', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getBoletim(req.user.ra) })
  } catch {
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar boletim' })
  }
})

router.get('/historico', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getHistorico(req.user.ra) })
  } catch {
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar histórico' })
  }
})

export default router
