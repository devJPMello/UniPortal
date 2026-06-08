import { useState } from 'react'
import EmprestimosAtivos from './components/EmprestimosAtivos'
import HistoricoLivros from './components/HistoricoLivros'
import PesquisaCatalogo from './components/PesquisaCatalogo'
import { useBiblioteca } from './hooks/useBiblioteca'
import './styles.css'

interface Props {
  token?: string
}

type Tab = 'emprestimos' | 'historico' | 'pesquisa'

export default function BibliotecaApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('emprestimos')
  const { emprestimos, historico, catalogo, loading, erro } = useBiblioteca(token)

  let nome = 'Visitante'
  let ra   = '—'
  try {
    if (token) {
      const decoded = JSON.parse(atob(token)) as { ra: string; nome: string }
      nome = decoded.nome
      ra   = decoded.ra
    }
  } catch { /* token inválido */ }

  return (
    <div className="bl-root">
      <div className="bl-header">
        <div>
          <div className="bl-title">📚 Biblioteca Universitária</div>
          <div className="bl-subtitle">Sistema de Fornecedor Externo — integrado via iframe</div>
        </div>
        <div className="bl-user">
          {nome} · RA: {ra}
          {loading && <span className="bl-loading-dot"> · Carregando...</span>}
        </div>
      </div>

      {erro && (
        <div className="bl-erro">{erro}</div>
      )}

      <div className="bl-tabs">
        <button
          className={`bl-tab${tab === 'emprestimos' ? ' bl-tab--active' : ''}`}
          onClick={() => setTab('emprestimos')}
        >
          Empréstimos Ativos
          {emprestimos.some((e) => e.status === 'atrasado') && (
            <span className="bl-tab-alert" />
          )}
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
        {tab === 'emprestimos' && <EmprestimosAtivos emprestimos={emprestimos} />}
        {tab === 'historico'   && <HistoricoLivros historico={historico} />}
        {tab === 'pesquisa'    && <PesquisaCatalogo catalogo={catalogo} />}
      </div>
    </div>
  )
}
