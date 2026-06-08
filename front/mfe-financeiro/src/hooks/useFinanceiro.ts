import { useState, useEffect } from 'react'
import { mockBoletos, mockResumo, type Boleto, type ResumoFinanceiro } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export function useFinanceiro(token?: string) {
  const [boletos, setBoletos] = useState<Boleto[]>(mockBoletos)
  const [resumo,  setResumo]  = useState<ResumoFinanceiro>(mockResumo)
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState<string | null>(null)

  useEffect(() => {
    if (!token || !API_URL) return

    setLoading(true)
    setErro(null)

    fetch(`${API_URL}/api/financeiro/boletos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.sucesso) {
          setBoletos(data.dados.boletos)
          setResumo(data.dados.resumo)
        }
      })
      .catch(() => setErro('Servidor indisponível. Exibindo dados locais.'))
      .finally(() => setLoading(false))
  }, [token])

  return { boletos, resumo, loading, erro }
}
