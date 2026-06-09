import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_academico',
      filename: 'remoteEntry.js',
      exposes: {
        './AcademicoApp': './src/AcademicoApp.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
  },
  server:  { port: 3001, cors: true },
  preview: { port: 3001, cors: true },
})
