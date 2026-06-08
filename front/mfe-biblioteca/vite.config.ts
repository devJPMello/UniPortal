import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_biblioteca',
      filename: 'remoteEntry.js',
      exposes: {
        './BibliotecaApp': './src/BibliotecaApp.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server:  { port: 3003, cors: true },
  preview: { port: 3003, cors: true },
})
