import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_financeiro',
      filename: 'remoteEntry.js',
      exposes: {
        './FinanceiroApp': './src/FinanceiroApp.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server:  { port: 3004, cors: true },
  preview: { port: 3004, cors: true },
})
