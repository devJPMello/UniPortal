import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import academicoRoutes  from './routes/academico.js'
import matriculaRoutes  from './routes/matricula.js'
import financeiroRoutes from './routes/financeiro.js'
import bibliotecaRoutes from './routes/biblioteca.js'

const app = express()
const PORT        = process.env.PORT ?? 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000'

const origins = CORS_ORIGIN.split(',').map((s) => s.trim())
app.use(cors({ origin: origins.length === 1 ? origins[0] : origins }))
app.use(express.json())

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'uniportal-api', timestamp: new Date() })
)

app.use('/api/academico',  academicoRoutes)
app.use('/api/matricula',  matriculaRoutes)
app.use('/api/financeiro', financeiroRoutes)
app.use('/api/biblioteca', bibliotecaRoutes)

app.listen(PORT, () =>
  console.log(`UniPortal API rodando em http://localhost:${PORT}`)
)
