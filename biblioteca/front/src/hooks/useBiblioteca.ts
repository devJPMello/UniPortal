import { useState, useEffect } from 'react'
import {
  mockEmprestimos,
  mockHistorico,
  mockCatalogo,
  type Emprestimo,
  type HistoricoLivro,
  type LivroCatalogo,
} from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export function useBiblioteca(token?: string) {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>(mockEmprestimos)
  const [historico,   setHistorico]   = useState<HistoricoLivro[]>(mockHistorico)
  const [catalogo,    setCatalogo]    = useState<LivroCatalogo[]>(mockCatalogo)
  const [loading,     setLoading]     = useState(false)
  const [erro,        setErro]        = useState<string | null>(null)

  useEffect(() => {
    if (!token || !API_URL) return

    setLoading(true)
    setErro(null)

    fetch(`${API_URL}/api/biblioteca/emprestimos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso) {
          setEmprestimos(data.dados.emprestimosAtivos)
          setHistorico(data.dados.historico)
          setCatalogo(data.dados.catalogo)
        }
      })
      .catch(() => setErro('Servidor indisponível. Exibindo dados locais.'))
      .finally(() => setLoading(false))
  }, [token])

  return { emprestimos, historico, catalogo, loading, erro }
}
