const params  = new URLSearchParams(location.search)
const token   = params.get('token') ?? ''
const API_URL = import.meta.env.VITE_API_URL

let user = { ra: '—', nome: 'Visitante', curso: '—' }
try {
  if (token) user = JSON.parse(atob(token))
} catch { /* token inválido */ }

document.getElementById('fin-user').textContent =
  `Aluno(a): ${user.nome} · RA: ${user.ra} · Curso: ${user.curso ?? '—'}`

// ── Dados mockados (fallback se API indisponível) ─────
const mockBoletos = [
  { id: 1, mes: 'Junho/2026',    valor: 1850.00, vencimento: '05/06/2026', status: 'pendente', codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 2, mes: 'Maio/2026',     valor: 1850.00, vencimento: '05/05/2026', status: 'pago',     codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 3, mes: 'Abril/2026',    valor: 1850.00, vencimento: '05/04/2026', status: 'pago',     codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 4, mes: 'Março/2026',    valor: 1850.00, vencimento: '05/03/2026', status: 'pago',     codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 5, mes: 'Fevereiro/2026',valor: 1970.00, vencimento: '05/02/2026', status: 'vencido',  codigo: '00190.50034 56894.190000 40195.476115 7 00000197000' },
]

let boletos = mockBoletos

// ── Renderização ─────────────────────────────────────
function renderSummary() {
  const pagos    = boletos.filter((b) => b.status === 'pago')
  const pendente = boletos.find((b) => b.status === 'pendente')
  const vencidos = boletos.filter((b) => b.status === 'vencido').length
  const totalPago = pagos.reduce((s, b) => s + b.valor, 0)

  document.getElementById('fin-summary').innerHTML = `
    <div class="fin-sum-card">
      <span class="fin-sum-val" style="color:#38A169">${pagos.length}</span>
      <span class="fin-sum-lbl">Mensalidades pagas</span>
    </div>
    <div class="fin-sum-card">
      <span class="fin-sum-val" style="color:#D69E2E">${pendente ? 'R$ ' + pendente.valor.toLocaleString('pt-BR', {minimumFractionDigits:2}) : '—'}</span>
      <span class="fin-sum-lbl">Boleto pendente</span>
    </div>
    <div class="fin-sum-card">
      <span class="fin-sum-val" style="color:${vencidos>0?'#E53E3E':'#38A169'}">${vencidos}</span>
      <span class="fin-sum-lbl">Boleto(s) vencido(s)</span>
    </div>
    <div class="fin-sum-card">
      <span class="fin-sum-val" style="color:#1B3A6B">R$ ${totalPago.toLocaleString('pt-BR', {minimumFractionDigits:2})}</span>
      <span class="fin-sum-lbl">Total pago em 2026</span>
    </div>
  `
}

function renderBoletos() {
  const el = document.getElementById('fin-boletos')
  el.innerHTML = boletos.map((b) => {
    const isPago     = b.status === 'pago'
    const isPendente = b.status === 'pendente'

    return `
    <div class="fin-boleto">
      <div class="fin-boleto-info">
        <div class="fin-boleto-mes">${b.mes}</div>
        <div class="fin-boleto-venc">Vencimento: ${b.vencimento}</div>
        ${isPendente || b.status === 'vencido'
          ? `<span class="fin-codigo" title="Clique para copiar" onclick="copiar('${b.codigo}')">${b.codigo}</span>`
          : ''
        }
      </div>
      <div class="fin-actions">
        <span class="fin-boleto-valor" style="color:${isPago?'#38A169':b.status==='vencido'?'#E53E3E':'#D69E2E'}">
          R$ ${b.valor.toLocaleString('pt-BR', {minimumFractionDigits:2})}
        </span>
        <span class="fin-badge badge-${b.status}">
          ${b.status === 'pago' ? 'Pago' : b.status === 'pendente' ? 'Pendente' : 'Vencido'}
        </span>
        ${isPendente
          ? `<button class="fin-btn" onclick="copiar('${b.codigo}')">Copiar código</button>
             <button class="fin-btn fin-btn-pagar" onclick="simularPagamento(${b.id})">Pagar online</button>`
          : b.status === 'vencido'
            ? `<button class="fin-btn" onclick="copiar('${b.codigo}')">Copiar código</button>
               <button class="fin-btn fin-btn-pagar" onclick="simularPagamento(${b.id})">Regularizar</button>`
            : `<button class="fin-btn" onclick="verComprovante(${b.id})">Comprovante</button>`
        }
      </div>
    </div>
  `}).join('')
}

// ── Ações ─────────────────────────────────────────────
window.copiar = function(codigo) {
  navigator.clipboard.writeText(codigo).catch(() => {})
  showToast('✓ Código de barras copiado!')
}

window.simularPagamento = function(id) {
  const b = boletos.find((b) => b.id === id)
  if (!b) return
  b.status = 'pago'
  renderSummary()
  renderBoletos()
  showToast(`✓ Pagamento de ${b.mes} simulado com sucesso!`)
}

window.verComprovante = function(_id) {
  showToast('✓ Comprovante enviado para o e-mail cadastrado.')
}

function showToast(msg) {
  const t = document.getElementById('fin-toast')
  t.textContent = msg
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2800)
}

// ── Inicialização com fetch à API ─────────────────────
async function init() {
  if (API_URL && token) {
    try {
      const res  = await fetch(`${API_URL}/api/financeiro/boletos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.sucesso) boletos = data.dados.boletos
    } catch { /* mantém mock */ }
  }
  renderSummary()
  renderBoletos()
}

init()
