import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/boletim', (req, res) => {
  res.json({
    ra: req.user.ra,
    periodo: '2024.2',
    disciplinas: [
      { codigo: 'CC401', nome: 'Estruturas de Dados Avançadas', av1: 8.5, av2: null, ch: 80, situacao: 'Em Curso' },
      { codigo: 'CC402', nome: 'Banco de Dados II',             av1: 7.0, av2: 7.5,  ch: 60, situacao: 'Em Curso' },
      { codigo: 'CC403', nome: 'Engenharia de Software',        av1: 9.0, av2: null, ch: 80, situacao: 'Em Curso' },
      { codigo: 'CC404', nome: 'Redes de Computadores',         av1: 6.5, av2: 7.0,  ch: 60, situacao: 'Em Curso' },
      { codigo: 'CC405', nome: 'Computação em Nuvem',           av1: 8.0, av2: null, ch: 60, situacao: 'Em Curso' },
    ],
  })
})

router.get('/historico', (req, res) => {
  res.json({
    ra: req.user.ra,
    semestres: [
      { periodo: '2024.1', disciplinas: [
        { codigo: 'CC301', nome: 'POO',              av1: 9.0, av2: 8.5, ch: 80, situacao: 'Aprovado' },
        { codigo: 'CC302', nome: 'Banco de Dados I', av1: 7.5, av2: 8.0, ch: 60, situacao: 'Aprovado' },
      ]},
    ],
  })
})

export default router
