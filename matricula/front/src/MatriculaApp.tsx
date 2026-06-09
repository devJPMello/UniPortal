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

function decodeRaFromJwt(token: string): string {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return (JSON.parse(atob(base64)) as { ra: string }).ra
  } catch {
    return 'Aluno'
  }
}

export default function MatriculaApp({ token }: Props) {
  const [tab, setTab] = useState<Tab>('grade')
  const { grade, disponiveis, periodoAtual, loading, erro, confirmar } = useMatricula(token)

  const ra = token && token !== 'demo' ? decodeRaFromJwt(token) : 'Aluno'

  return (
    <div className="mt-root">
      <div className="mt-tabs" role="tablist" aria-label="Seções de matrícula">
        <button
          role="tab"
          aria-selected={tab === 'grade'}
          className={`mt-tab${tab === 'grade' ? ' mt-tab--active' : ''}`}
          onClick={() => setTab('grade')}
        >
          Grade de Horários
        </button>
        <button
          role="tab"
          aria-selected={tab === 'matricula'}
          className={`mt-tab${tab === 'matricula' ? ' mt-tab--active' : ''}`}
          onClick={() => setTab('matricula')}
        >
          Processo de Matrícula
        </button>
        <span className="mt-tabs-info" aria-label={`RA do aluno: ${ra}`}>RA: {ra}</span>
        {loading && <span className="mt-tabs-info" style={{ color: '#718096' }} aria-live="polite">Carregando…</span>}
      </div>

      {erro && (
        <div
          role="alert"
          style={{ padding: '8px 16px', background: '#FFFBEB', color: '#92400E', fontSize: '13px', borderBottom: '1px solid #FDE68A' }}
        >
          {erro}
        </div>
      )}

      <div className="mt-content" role="tabpanel">
        {tab === 'grade'     && <GradeHorarios grade={grade} periodo={periodoAtual} />}
        {tab === 'matricula' && <ProcessoMatricula disponiveis={disponiveis} gradeAtual={grade} onConfirmar={confirmar} />}
      </div>
    </div>
  )
}
