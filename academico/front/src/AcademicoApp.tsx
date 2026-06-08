import { useState } from 'react'
import Boletim from './components/Boletim'
import Historico from './components/Historico'
import { useAcademico } from './hooks/useAcademico'
import '@uniportal/design-system/tokens.css'
import './styles.css'

interface Props {
  token?: string
}

type Tab = 'boletim' | 'historico'

export default function AcademicoApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('boletim')
  const { boletim, historico, periodoAtual, loading, erro } = useAcademico(token)

  let ra = 'Aluno'
  try {
    if (token) ra = (JSON.parse(atob(token)) as { ra: string }).ra
  } catch { /* token inválido em standalone */ }

  return (
    <div className="ac-root">
      <div className="ac-tabs">
        <button
          className={`ac-tab${tab === 'boletim' ? ' ac-tab--active' : ''}`}
          onClick={() => setTab('boletim')}
        >
          Boletim
        </button>
        <button
          className={`ac-tab${tab === 'historico' ? ' ac-tab--active' : ''}`}
          onClick={() => setTab('historico')}
        >
          Histórico Escolar
        </button>
        <span className="ac-tabs-info">RA: {ra}</span>
        {loading && <span className="ac-tabs-info" style={{ color: '#718096' }}>Carregando...</span>}
      </div>

      {erro && (
        <div style={{ padding: '8px 16px', background: '#FFFBEB', color: '#92400E', fontSize: '13px', borderBottom: '1px solid #FDE68A' }}>
          {erro}
        </div>
      )}

      <div className="ac-content">
        {tab === 'boletim'   && <Boletim disciplinas={boletim} periodo={periodoAtual} />}
        {tab === 'historico' && <Historico semestres={historico} />}
      </div>
    </div>
  )
}
