import { useState, useEffect } from 'react'
import { grade as mockGrade, disciplinasDisponiveis as mockDisponiveis, type Aula, type DisciplinaDisponivel } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export function useMatricula(token?: string) {
  const [grade,        setGrade]        = useState<Aula[]>(mockGrade)
  const [disponiveis,  setDisponiveis]  = useState<DisciplinaDisponivel[]>(mockDisponiveis)
  const [periodoAtual, setPeriodoAtual] = useState<string>('N/A')
  const [loading,      setLoading]      = useState(false)
  const [erro,         setErro]         = useState<string | null>(null)

  useEffect(() => {
    if (!token || !API_URL) return

    const headers = { Authorization: `Bearer ${token}` }
    setLoading(true)
    setErro(null)

    Promise.all([
      fetch(`${API_URL}/api/matricula/grade`,      { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/matricula/disponiveis`, { headers }).then((r) => r.json()),
    ])
      .then(([g, d]) => {
        if (g.sucesso) { setGrade(g.dados.aulas); setPeriodoAtual(g.dados.periodo) }
        if (d.sucesso) setDisponiveis(d.dados)
      })
      .catch(() => setErro('Servidor indisponível. Exibindo dados locais.'))
      .finally(() => setLoading(false))
  }, [token])

  async function confirmar(disciplinas: string[]): Promise<{ sucesso: boolean; mensagem: string }> {
    if (!token || !API_URL) {
      return { sucesso: true, mensagem: 'Pré-matrícula registrada com sucesso.' }
    }
    try {
      const res = await fetch(`${API_URL}/api/matricula/confirmar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ disciplinas }),
      })
      const data = await res.json()
      return { sucesso: data.sucesso, mensagem: data.dados?.mensagem ?? data.erro ?? 'Erro desconhecido' }
    } catch {
      return { sucesso: false, mensagem: 'Erro de conexão com o servidor.' }
    }
  }

  return { grade, disponiveis, periodoAtual, loading, erro, confirmar }
}
