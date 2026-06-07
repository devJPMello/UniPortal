import { useState } from 'react'
import GradeHorarios from './components/GradeHorarios'
import ProcessoMatricula from './components/ProcessoMatricula'
import { useMatricula } from './hooks/useMatricula'
import '@uniportal/design-system/tokens.css'
import './styles.css'

interface Props {
  token?: string
}

type Tab = 'grade' | 'matricula'

export default function MatriculaApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('grade')
  const { grade, disponiveis, periodoAtual, loading, erro, confirmar } = useMatricula(token)

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
        {loading && <span className="mt-tabs-info" style={{ color: '#718096' }}>Carregando...</span>}
      </div>

      {erro && (
        <div style={{ padding: '8px 16px', background: '#FFFBEB', color: '#92400E', fontSize: '13px', borderBottom: '1px solid #FDE68A' }}>
          {erro}
        </div>
      )}

      <div className="mt-content">
        {tab === 'grade'     && <GradeHorarios grade={grade} periodo={periodoAtual} />}
        {tab === 'matricula' && <ProcessoMatricula disponiveis={disponiveis} gradeAtual={grade} onConfirmar={confirmar} />}
      </div>
    </div>
  )
}
