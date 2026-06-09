import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getGrade, getDisciplinasDisponiveis, confirmarMatricula } from '../data/matricula.js'
import logger from '../logger.js'

const router = Router()
router.use(authMiddleware)

router.get('/grade', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getGrade(req.user.ra) })
  } catch (err) {
    logger.error({ err, ra: req.user.ra }, 'Erro ao buscar grade')
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar grade' })
  }
})

router.get('/disponiveis', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getDisciplinasDisponiveis(req.user.ra) })
  } catch (err) {
    logger.error({ err, ra: req.user.ra }, 'Erro ao buscar disciplinas disponíveis')
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar disciplinas disponíveis' })
  }
})

router.post('/confirmar', async (req, res) => {
  const { disciplinas } = req.body ?? {}
  if (!Array.isArray(disciplinas) || disciplinas.length === 0) {
    return res.status(400).json({ sucesso: false, erro: 'Selecione pelo menos uma disciplina.' })
  }
  const codigosValidos = disciplinas.every((d) => typeof d === 'string' && d.trim().length > 0)
  if (!codigosValidos) {
    return res.status(400).json({ sucesso: false, erro: 'Códigos de disciplina inválidos.' })
  }
  try {
    res.json({ sucesso: true, dados: await confirmarMatricula(req.user.ra, disciplinas) })
  } catch (err) {
    logger.error({ err, ra: req.user.ra }, 'Erro ao confirmar matrícula')
    res.status(500).json({ sucesso: false, erro: 'Erro ao confirmar matrícula' })
  }
})

export default router
