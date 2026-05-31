import { useState } from 'react'
import Boletim from './components/Boletim'
import Historico from './components/Historico'
import '@uniportal/design-system/tokens.css'
import './styles.css'

interface Props {
  token?: string
}

type Tab = 'boletim' | 'historico'

export default function AcademicoApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('boletim')

  // Decodifica o usuário do token (para exibição contextual)
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
      </div>

      <div className="ac-content">
        {tab === 'boletim'   && <Boletim />}
        {tab === 'historico' && <Historico />}
      </div>
    </div>
  )
}
