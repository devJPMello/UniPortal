import express from 'express'
import cors from 'cors'
import academicoRoutes from './routes/academico.js'
import matriculaRoutes from './routes/matricula.js'
import financeiroRoutes from './routes/financeiro.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'uniportal-api' }))

app.use('/api/academico',  academicoRoutes)
app.use('/api/matricula',  matriculaRoutes)
app.use('/api/financeiro', financeiroRoutes)

app.listen(PORT, () =>
  console.log(`UniPortal API rodando em http://localhost:${PORT}`)
)
