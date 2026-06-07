import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const MFE_ACADEMICO_URL = env.VITE_MFE_ACADEMICO_URL || 'http://localhost:3001'
  const MFE_MATRICULA_URL = env.VITE_MFE_MATRICULA_URL || 'http://localhost:3002'

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: {
          mfe_academico: `${MFE_ACADEMICO_URL}/assets/remoteEntry.js`,
          mfe_matricula: `${MFE_MATRICULA_URL}/assets/remoteEntry.js`,
        },
        shared: ['react', 'react-dom'],
      }),
    ],
    build: {
      target: 'esnext',
      minify: false,
    },
    server: { port: 3000 },
  }
})
