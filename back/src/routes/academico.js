import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getBoletim, getHistorico } from '../data/academico.js'
import logger from '../logger.js'

const router = Router()
router.use(authMiddleware)

/**
 * @openapi
 * /academico/boletim:
 *   get:
 *     summary: Retorna o boletim do semestre atual
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Boletim com disciplinas e notas
 *       401:
 *         description: Não autorizado
 */
router.get('/boletim', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getBoletim(req.user.ra) })
  } catch (err) {
    logger.error({ err, ra: req.user.ra }, 'Erro ao buscar boletim')
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar boletim' })
  }
})

/**
 * @openapi
 * /academico/historico:
 *   get:
 *     summary: Retorna o histórico escolar completo
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Histórico por semestre
 */
router.get('/historico', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getHistorico(req.user.ra) })
  } catch (err) {
    logger.error({ err, ra: req.user.ra }, 'Erro ao buscar histórico')
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar histórico' })
  }
})

export default router
