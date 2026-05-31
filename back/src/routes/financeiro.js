import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router()

router.use(authMiddleware)

router.get('/boletos', (req, res) => {
  res.json({
    ra: req.user.ra,
    boletos: [
      { id: 1, mes: 'Novembro/2024', valor: 1850.00, vencimento: '2024-11-05', status: 'pendente' },
      { id: 2, mes: 'Outubro/2024',  valor: 1850.00, vencimento: '2024-10-05', status: 'pago'     },
      { id: 3, mes: 'Setembro/2024', valor: 1850.00, vencimento: '2024-09-05', status: 'pago'     },
    ],
  })
})

export default router
