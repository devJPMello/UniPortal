import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'
import { getGrade, getDisciplinasDisponiveis, confirmarMatricula } from '../data/matricula.js'

const router = Router()
router.use(authMiddleware)

router.get('/grade', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getGrade(req.user.ra) })
  } catch {
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar grade' })
  }
})

router.get('/disponiveis', async (req, res) => {
  try {
    res.json({ sucesso: true, dados: await getDisciplinasDisponiveis(req.user.ra) })
  } catch {
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar disciplinas disponíveis' })
  }
})

router.post('/confirmar', async (req, res) => {
  const { disciplinas } = req.body ?? {}
  if (!Array.isArray(disciplinas) || disciplinas.length === 0) {
    return res.status(400).json({ sucesso: false, erro: 'Selecione pelo menos uma disciplina.' })
  }
  try {
    res.json({ sucesso: true, dados: await confirmarMatricula(req.user.ra, disciplinas) })
  } catch {
    res.status(500).json({ sucesso: false, erro: 'Erro ao confirmar matrícula' })
  }
})

export default router
