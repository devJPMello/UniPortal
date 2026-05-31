import { useState } from 'react'
import GradeHorarios from './components/GradeHorarios'
import ProcessoMatricula from './components/ProcessoMatricula'
import '@uniportal/design-system/tokens.css'
import './styles.css'

interface Props {
  token?: string
}

type Tab = 'grade' | 'matricula'

export default function MatriculaApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('grade')

  let ra = 'Aluno'
  try {
    if (token && token !== 'demo') ra = (JSON.parse(atob(token)) as { ra: string }).ra
  } catch { /* ok */ }

  return (
    <div className="mt-root">
      <div className="mt-tabs">
        <button
          className={`mt-tab${tab === 'grade' ? ' mt-tab--active' : ''}`}
          onClick={() => setTab('grade')}
        >
          Grade de Horários
        </button>
        <button
          className={`mt-tab${tab === 'matricula' ? ' mt-tab--active' : ''}`}
          onClick={() => setTab('matricula')}
        >
          Processo de Matrícula
        </button>
        <span className="mt-tabs-info">RA: {ra}</span>
      </div>

      <div className="mt-content">
        {tab === 'grade'     && <GradeHorarios />}
        {tab === 'matricula' && <ProcessoMatricula />}
      </div>
    </div>
  )
}
