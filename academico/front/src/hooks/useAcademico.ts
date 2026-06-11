import { useState, useEffect } from 'react'
import { semAtual, historico as mockHistorico, type Disciplina, type SemestreHistorico } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export function useAcademico(token?: string) {
  const [boletim,      setBoletim]      = useState<Disciplina[]>(semAtual)
  const [historico,    setHistorico]    = useState<SemestreHistorico[]>(mockHistorico)
  const [periodoAtual, setPeriodoAtual] = useState<string>('N/A')
  const [loading,      setLoading]      = useState(false)
  const [erro,         setErro]         = useState<string | null>(null)

  useEffect(() => {
    if (!token || !API_URL) return

    const headers = { Authorization: `Bearer ${token}` }
    setLoading(true)
    setErro(null)

    Promise.all([
      fetch(`${API_URL}/api/academico/boletim`,  { headers }).then((r) => r.json()),
      fetch(`${API_URL}/api/academico/historico`, { headers }).then((r) => r.json()),
    ])
      .then(([b, h]) => {
        if (b.sucesso) { setBoletim(b.dados.disciplinas); setPeriodoAtual(b.dados.periodo) }
        if (h.sucesso) setHistorico(h.dados.semestres)
      })
      .catch(() => setErro('Servidor indisponível. Exibindo dados locais.'))
      .finally(() => setLoading(false))
  }, [token])

  return { boletim, historico, periodoAtual, loading, erro }
}
