import { useState } from 'react'
import { Library } from 'lucide-react'
import EmprestimosAtivos from './components/EmprestimosAtivos'
import HistoricoLivros from './components/HistoricoLivros'
import PesquisaCatalogo from './components/PesquisaCatalogo'
import { useBiblioteca } from './hooks/useBiblioteca'
import { useLocalStorage } from './hooks/useLocalStorage'
import './styles.css'

export interface EstadoEmprestimo {
  dataAtual: string
  renovacoes: number
}

interface Props {
  token?: string
}

type Tab = 'emprestimos' | 'historico' | 'pesquisa'

export default function BibliotecaApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('emprestimos')

  const [estados,    setEstados]   = useLocalStorage<Record<number, EstadoEmprestimo>>('bl:estados', {})
  const [devolvidos, setDevolvidos] = useLocalStorage<number[]>('bl:devolvidos', [])

  const { emprestimos, historico, catalogo, loading, erro } = useBiblioteca(token)

  let nome = 'Visitante'
  let ra   = 'N/A'
  try {
    if (token) {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
      const decoded = JSON.parse(new TextDecoder().decode(bytes)) as { ra: string; nome: string }
      nome = decoded.nome
      ra   = decoded.ra
    }
  } catch { /* token inválido */ }

  const emprestimosAtivos = emprestimos.filter(e => !devolvidos.includes(e.id))
  const temAtrasado = emprestimosAtivos.some(e => e.status === 'atrasado')

  return (
    <div className="bl-root">
      <div className="bl-header">
        <div>
          <div className="bl-title"><Library size={20} /> Biblioteca Universitária</div>
          <div className="bl-subtitle">Micro-frontend Biblioteca integrado via Module Federation</div>
        </div>
        <div className="bl-user">
          {nome} · RA: {ra}
          {loading && <span className="bl-loading-dot"> · Carregando...</span>}
        </div>
      </div>

      {erro && <div className="bl-erro">{erro}</div>}

      <div className="bl-tabs">
        <button
          className={`bl-tab${tab === 'emprestimos' ? ' bl-tab--active' : ''}`}
          onClick={() => setTab('emprestimos')}
        >
          Empréstimos Ativos
          {temAtrasado && <span className="bl-tab-alert" />}
        </button>
        <button
          className={`bl-tab${tab === 'historico' ? ' bl-tab--active' : ''}`}
          onClick={() => setTab('historico')}
        >
          Histórico
        </button>
        <button
          className={`bl-tab${tab === 'pesquisa' ? ' bl-tab--active' : ''}`}
          onClick={() => setTab('pesquisa')}
        >
          Pesquisar / Reservar
        </button>
      </div>

      <div className="bl-content">
        {tab === 'emprestimos' && (
          <EmprestimosAtivos
            emprestimos={emprestimos}
            estados={estados}
            devolvidos={devolvidos}
            onEstadosChange={setEstados}
            onDevolvidosChange={setDevolvidos}
          />
        )}
        {tab === 'historico' && <HistoricoLivros historico={historico} />}
        {tab === 'pesquisa'  && <PesquisaCatalogo catalogo={catalogo} />}
      </div>
    </div>
  )
}
