import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/grade', (req, res) => {
  res.json({
    ra: req.user.ra,
    periodo: '2024.2',
    aulas: [
      { id: '1', disciplina: 'Estruturas de Dados Avançadas', dia: 1, inicio: 8,  duracao: 2, sala: 'Lab 3' },
      { id: '2', disciplina: 'Estruturas de Dados Avançadas', dia: 3, inicio: 8,  duracao: 2, sala: 'Lab 3' },
      { id: '3', disciplina: 'Banco de Dados II',             dia: 2, inicio: 10, duracao: 2, sala: '201'   },
      { id: '4', disciplina: 'Banco de Dados II',             dia: 4, inicio: 10, duracao: 2, sala: '201'   },
    ],
  })
})

router.get('/disponiveis', (_req, res) => {
  res.json([
    { codigo: 'CC501', nome: 'Inteligência Artificial', vagas: 40, vagasOcupadas: 28 },
    { codigo: 'CC502', nome: 'Desenvolvimento Mobile',  vagas: 35, vagasOcupadas: 30 },
  ])
})

router.post('/confirmar', (req, res) => {
  const { disciplinas } = req.body
  res.json({ status: 'confirmado', disciplinas, mensagem: 'Pré-matrícula registrada com sucesso.' })
})

export default router
