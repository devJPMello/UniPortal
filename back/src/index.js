import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'
import logger from './logger.js'
import spec from './swagger.js'
import authRoutes      from './routes/auth.js'
import academicoRoutes from './routes/academico.js'
import matriculaRoutes from './routes/matricula.js'
import financeiroRoutes from './routes/financeiro.js'
import bibliotecaRoutes from './routes/biblioteca.js'

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET não definido. Defina-o em .env antes de iniciar.')
  process.exit(1)
}

const app = express()
const PORT        = process.env.PORT ?? 4000
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000'

const origins = CORS_ORIGIN.split(',').map((s) => s.trim())
app.use(cors({ origin: origins.length === 1 ? origins[0] : origins }))
app.use(express.json())
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === '/health' } }))

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', service: 'uniportal-api', timestamp: new Date() }),
)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec))
app.get('/api/docs.json', (_req, res) => res.json(spec))

app.use('/api/auth',      authRoutes)
app.use('/api/academico', academicoRoutes)
app.use('/api/matricula', matriculaRoutes)
app.use('/api/financeiro', financeiroRoutes)
app.use('/api/biblioteca', bibliotecaRoutes)

app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Erro não tratado')
  res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' })
})

app.listen(PORT, () =>
  logger.info(`UniPortal API -> http://localhost:${PORT} | Docs -> http://localhost:${PORT}/api/docs`),
)
