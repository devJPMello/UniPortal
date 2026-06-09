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

function decodeRaFromJwt(token: string): string {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return (JSON.parse(atob(base64)) as { ra: string }).ra
  } catch {
    return 'Aluno'
  }
}

export default function AcademicoApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('boletim')
  const { boletim, historico, periodoAtual, loading, erro } = useAcademico(token)

  const ra = token ? decodeRaFromJwt(token) : 'Aluno'

  return (
    <div className="ac-root">
      <div className="ac-tabs" role="tablist" aria-label="Seções acadêmicas">
        <button
          role="tab"
          aria-selected={tab === 'boletim'}
          className={`ac-tab${tab === 'boletim' ? ' ac-tab--active' : ''}`}
          onClick={() => setTab('boletim')}
        >
          Boletim
        </button>
        <button
          role="tab"
          aria-selected={tab === 'historico'}
          className={`ac-tab${tab === 'historico' ? ' ac-tab--active' : ''}`}
          onClick={() => setTab('historico')}
        >
          Histórico Escolar
        </button>
        <span className="ac-tabs-info" aria-label={`RA do aluno: ${ra}`}>RA: {ra}</span>
        {loading && <span className="ac-tabs-info" style={{ color: '#718096' }} aria-live="polite">Carregando…</span>}
      </div>

      {erro && (
        <div
          role="alert"
          style={{ padding: '8px 16px', background: '#FFFBEB', color: '#92400E', fontSize: '13px', borderBottom: '1px solid #FDE68A' }}
        >
          {erro}
        </div>
      )}

      <div className="ac-content" role="tabpanel">
        {tab === 'boletim'   && <Boletim disciplinas={boletim} periodo={periodoAtual} />}
        {tab === 'historico' && <Historico semestres={historico} />}
      </div>
    </div>
  )
}
