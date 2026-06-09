import {
  GraduationCap, Calendar, BookOpen, CreditCard,
  AlertCircle, CheckCircle, Clock, CalendarDays,
  ChevronRight, Landmark,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const stats = [
  { icon: GraduationCap, label: 'Disciplinas em Curso', value: '5',        detail: '2026.1',        color: '#2E5DA8', bg: '#EBF2FF', to: '/academico'  },
  { icon: CalendarDays,  label: 'Aulas esta semana',    value: '18h',      detail: '9 aulas',       color: '#805AD5', bg: '#FAF5FF', to: '/matricula'  },
  { icon: BookOpen,      label: 'Empréstimos Ativos',   value: '2',        detail: '1 com atraso',  color: '#38A169', bg: '#F0FFF4', to: '/biblioteca' },
  { icon: CreditCard,    label: 'Boleto Pendente',      value: 'R$ 1.850', detail: 'Vence em 5 dias', color: '#D69E2E', bg: '#FFFFF0', to: '/financeiro' },
]

const alerts = [
  { icon: AlertCircle, urgency: 'error',   text: 'Boleto de Junho/2026 vence em 5 dias',        chip: '5 dias',    to: '/financeiro' },
  { icon: Clock,       urgency: 'warning', text: 'Matrícula para 2026.2 abre em 20/06/2026',     chip: '15 dias',   to: '/matricula'  },
  { icon: CheckCircle, urgency: 'success', text: 'Prova AV2 de Estruturas de Dados: 18/06/2026', chip: '18/06',     to: '/academico'  },
]

const modules = [
  {
    icon: GraduationCap, color: '#2E5DA8', bg: '#EBF2FF',
    tag: 'Module Federation', tipo: 'mfe',
    title: 'Acadêmico', desc: 'Notas, boletim e histórico escolar',
    to: '/academico',
  },
  {
    icon: Calendar, color: '#805AD5', bg: '#FAF5FF',
    tag: 'Module Federation', tipo: 'mfe',
    title: 'Matrícula', desc: 'Grade de horários e processo de matrícula',
    to: '/matricula',
  },
  {
    icon: BookOpen, color: '#38A169', bg: '#F0FFF4',
    tag: 'iframe', tipo: 'iframe',
    title: 'Biblioteca', desc: 'Empréstimos, reservas e acervo digital',
    to: '/biblioteca',
  },
  {
    icon: Landmark, color: '#D69E2E', bg: '#FFFFF0',
    tag: 'iframe', tipo: 'iframe',
    title: 'Financeiro', desc: 'Boletos, mensalidades e extrato',
    to: '/financeiro',
  },
]

const urgencyColor: Record<string, string> = {
  error:   '#E53E3E',
  warning: '#D69E2E',
  success: '#38A169',
}

const urgencyBg: Record<string, string> = {
  error:   '#FFF5F5',
  warning: '#FFFFF0',
  success: '#F0FFF4',
}

export default function Dashboard() {
  const { user } = useAuth()

  const semestreAtual = 4
  const totalSemestres = 8
  const progresso = Math.round((semestreAtual / totalSemestres) * 100)

  return (
    <div className="page">

      {/* ── Banner de boas-vindas ── */}
      <div className="db-banner">
        <div className="db-banner-body">
          <div className="db-banner-left">
            <p className="db-banner-greeting">Bem-vindo(a) de volta</p>
            <h1 className="db-banner-name">{user?.nome}</h1>
            <p className="db-banner-sub">{user?.curso} · RA {user?.ra}</p>

            <div className="db-progress-wrap">
              <div className="db-progress-labels">
                <span>{semestreAtual}º Semestre</span>
                <span>{progresso}% do curso</span>
              </div>
              <div className="db-progress-track">
                <div className="db-progress-fill" style={{ width: `${progresso}%` }} />
              </div>
              <p className="db-progress-hint">{semestreAtual} de {totalSemestres} semestres concluídos</p>
            </div>
          </div>

          <div className="db-banner-decoration">
            <GraduationCap size={96} strokeWidth={1} color="rgba(255,255,255,0.15)" />
          </div>
        </div>

        <div className="db-banner-tags">
          <span className="db-banner-tag">2026.1 em curso</span>
          <span className="db-banner-tag">{user?.email}</span>
        </div>
      </div>

      {/* ── Cards de estatísticas ── */}
      <div className="db-stats">
        {stats.map(({ icon: Icon, label, value, detail, color, bg, to }) => (
          <Link key={label} to={to} className="db-stat" style={{ '--sc': color, '--sb': bg } as React.CSSProperties}>
            <div className="db-stat-top">
              <span className="db-stat-value">{value}</span>
              <div className="db-stat-icon" style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
            </div>
            <p className="db-stat-label">{label}</p>
            <p className="db-stat-detail">{detail}</p>
          </Link>
        ))}
      </div>

      {/* ── Linha inferior: alertas + módulos ── */}
      <div className="db-bottom">

        {/* Módulos */}
        <div className="db-col db-col--wide">
          <h2 className="db-section-title">Módulos do Portal</h2>
          <div className="db-modules">
            {modules.map(({ icon: Icon, color, bg, tag, tipo, title, desc, to }) => (
              <Link key={title} to={to} className="db-module">
                <div className="db-module-icon" style={{ background: bg }}>
                  <Icon size={22} color={color} />
                </div>
                <div className="db-module-body">
                  <div className="db-module-header">
                    <span className="db-module-title">{title}</span>
                    <span className={`db-module-tag db-module-tag--${tipo}`}>{tag}</span>
                  </div>
                  <p className="db-module-desc">{desc}</p>
                </div>
                <ChevronRight size={16} className="db-module-arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Avisos */}
        <div className="db-col">
          <h2 className="db-section-title">Avisos e Lembretes</h2>
          <div className="db-alerts">
            {alerts.map(({ icon: Icon, urgency, text, chip, to }) => (
              <Link key={text} to={to} className="db-alert"
                style={{ '--ac': urgencyColor[urgency], '--ab': urgencyBg[urgency] } as React.CSSProperties}>
                <Icon size={16} color={urgencyColor[urgency]} className="db-alert-icon" />
                <span className="db-alert-text">{text}</span>
                <span className="db-alert-chip" style={{ color: urgencyColor[urgency], background: urgencyBg[urgency] }}>
                  {chip}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
