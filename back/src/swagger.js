import swaggerJsdoc from 'swagger-jsdoc'

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UniPortal API',
      version: '1.0.0',
      description: 'API unificada do Portal Acadêmico UniPortal',
    },
    servers: [{ url: '/api', description: 'API principal' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
})

export default spec
