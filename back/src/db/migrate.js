import 'dotenv/config'
import { readdir, readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pool from './connection.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = join(__dirname, 'migrations')

async function migrate() {
  const client = await pool.connect()
  try {
    // Garante que a tabela de controle existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version     VARCHAR(20) PRIMARY KEY,
        aplicado_em TIMESTAMP   NOT NULL DEFAULT NOW()
      )
    `)

    const { rows: aplicadas } = await client.query('SELECT version FROM schema_migrations')
    const versoeAplicadas = new Set(aplicadas.map((r) => r.version))

    const arquivos = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith('.sql'))
      .sort()

    for (const arquivo of arquivos) {
      const versao = arquivo.replace('.sql', '')
      if (versoeAplicadas.has(versao)) {
        console.log(`[skip] ${arquivo}`)
        continue
      }

      const sql = await readFile(join(MIGRATIONS_DIR, arquivo), 'utf-8')
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [versao])
        await client.query('COMMIT')
        console.log(`[ok]   ${arquivo}`)
      } catch (err) {
        await client.query('ROLLBACK')
        throw err
      }
    }

    console.log('Migração concluída.')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((err) => { console.error(err); process.exit(1) })
