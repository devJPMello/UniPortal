import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getEmprestimos } from '../data/biblioteca.js'
import logger from '../logger.js'

const router = Router()
router.use(authMiddleware)

router.get('/emprestimos', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getEmprestimos(req.user.ra) })
  } catch (err) {
    logger.error({ err, ra: req.user.ra }, 'Erro ao buscar empréstimos')
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar empréstimos' })
  }
})

export default router
