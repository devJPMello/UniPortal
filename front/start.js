// Orquestra o build e start de todos os micro front-ends
const { execSync, spawn } = require('child_process')

const cyan  = (s) => `\x1b[36m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`

console.log(cyan('\n🎓 UniPortal — Iniciando demo de Micro Front-ends\n'))

console.log(yellow('📦 Compilando MFEs remotos (Module Federation)...'))
execSync('npm run build --workspace=mfe-academico', { stdio: 'inherit' })
execSync('npm run build --workspace=mfe-matricula', { stdio: 'inherit' })

console.log(green('\n🚀 Iniciando todos os serviços:\n'))
console.log('  Shell        →  http://localhost:3000')
console.log('  Acadêmico    →  http://localhost:3001  (Module Federation remote)')
console.log('  Matrícula    →  http://localhost:3002  (Module Federation remote)')
console.log('  Biblioteca   →  http://localhost:3003  (iframe target)')
console.log('  Financeiro   →  http://localhost:3004  (iframe target)')
console.log(cyan('\n🔑 Credenciais de demo: RA: 2024001 | Senha: qualquer\n'))

const services = [
  { label: 'mfe-academico', args: ['run', 'preview', '--workspace=mfe-academico'] },
  { label: 'mfe-matricula', args: ['run', 'preview', '--workspace=mfe-matricula'] },
  { label: 'mfe-biblioteca', args: ['run', 'dev', '--workspace=mfe-biblioteca'] },
  { label: 'mfe-financeiro', args: ['run', 'dev', '--workspace=mfe-financeiro'] },
  { label: 'shell', args: ['run', 'dev', '--workspace=shell'] },
]

services.forEach(({ label, args }) => {
  const p = spawn('npm', args, { stdio: 'inherit', shell: true })
  p.on('error', (e) => console.error(`[${label}]`, e.message))
})
