// Lê o token SSO passado pelo shell via URL param
const params = new URLSearchParams(location.search)
const token  = params.get('token') ?? ''

let user = { ra: '—', nome: 'Visitante' }
try {
  if (token) user = JSON.parse(atob(token))
} catch { /* token inválido */ }

document.getElementById('lib-user').textContent =
  `Aluno(a): ${user.nome} · RA: ${user.ra}`

// ── Dados mockados ──────────────────────────────────
const emprestimosAtivos = [
  { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', isbn: '978-0132350884', emprestado: '15/10/2024', devolucao: '29/10/2024', status: 'atrasado', icon: '📕' },
  { id: 2, titulo: 'The Pragmatic Programmer', autor: 'David Thomas, Andrew Hunt', isbn: '978-0135957059', emprestado: '18/10/2024', devolucao: '01/11/2024', status: 'ativo', icon: '📗' },
]

const historicoLivros = [
  { titulo: 'Design Patterns', autor: 'Gang of Four', emprestado: '01/09/2024', devolvido: '15/09/2024', icon: '📘' },
  { titulo: 'Refactoring', autor: 'Martin Fowler', emprestado: '10/07/2024', devolvido: '24/07/2024', icon: '📙' },
  { titulo: 'Domain-Driven Design', autor: 'Eric Evans', emprestado: '05/05/2024', devolvido: '19/05/2024', icon: '📒' },
]

const catalogo = [
  { titulo: 'Inteligência Artificial: Uma Abordagem Moderna', autor: 'Russell & Norvig', disponivel: true  },
  { titulo: 'Redes de Computadores', autor: 'Andrew Tanenbaum', disponivel: true  },
  { titulo: 'Engenharia de Software', autor: 'Ian Sommerville', disponivel: false },
  { titulo: 'Introduction to Algorithms', autor: 'Cormen et al.', disponivel: true  },
  { titulo: 'Computer Organization', autor: 'Patterson & Hennessy', disponivel: false },
]

// ── Renderiza empréstimos ativos ─────────────────────
function renderEmprestimos() {
  const el = document.getElementById('tab-emprestimos')
  if (!emprestimosAtivos.length) {
    el.innerHTML = '<div class="lib-empty">Nenhum empréstimo ativo.</div>'
    return
  }
  el.innerHTML = emprestimosAtivos.map((e) => `
    <div class="lib-card">
      <div class="lib-book-icon" style="background:${e.status==='atrasado'?'#FFF5F5':'#F0FFF4'}">${e.icon}</div>
      <div class="lib-book-info">
        <div class="lib-book-title">${e.titulo}</div>
        <div class="lib-book-author">${e.autor}</div>
        <div class="lib-book-dates">Emprestado: ${e.emprestado} · Devolução: <strong>${e.devolucao}</strong></div>
        <button class="lib-renovar-btn" onclick="renovar(${e.id})">Renovar</button>
      </div>
      <span class="lib-badge badge-${e.status}">${e.status === 'atrasado' ? 'Atrasado' : 'Ativo'}</span>
    </div>
  `).join('')
}

// ── Renderiza histórico ──────────────────────────────
function renderHistorico() {
  const el = document.getElementById('tab-historico')
  el.innerHTML = historicoLivros.map((l) => `
    <div class="lib-card">
      <div class="lib-book-icon" style="background:#F7F9FC">${l.icon}</div>
      <div class="lib-book-info">
        <div class="lib-book-title">${l.titulo}</div>
        <div class="lib-book-author">${l.autor}</div>
        <div class="lib-book-dates">Emprestado: ${l.emprestado} · Devolvido: ${l.devolvido}</div>
      </div>
      <span class="lib-badge badge-devolvido">Devolvido</span>
    </div>
  `).join('')
}

// ── Renderiza pesquisa ───────────────────────────────
function renderPesquisa(filtro = '') {
  const el = document.getElementById('tab-pesquisa')
  const lista = filtro
    ? catalogo.filter((l) => l.titulo.toLowerCase().includes(filtro.toLowerCase()) || l.autor.toLowerCase().includes(filtro.toLowerCase()))
    : catalogo

  const resultados = lista.map((l) => `
    <div class="lib-result-card">
      <div>
        <div class="lib-result-name">${l.titulo}</div>
        <div class="lib-result-sub">${l.autor} · ${l.disponivel ? '<span style="color:#38A169">Disponível</span>' : '<span style="color:#E53E3E">Indisponível</span>'}</div>
      </div>
      ${l.disponivel
        ? `<button class="lib-reservar-btn" onclick="reservar('${l.titulo}')">Reservar</button>`
        : `<button class="lib-reservar-btn" disabled style="opacity:.4;cursor:not-allowed">Indisponível</button>`
      }
    </div>
  `).join('') || '<div class="lib-empty">Nenhum resultado encontrado.</div>'

  el.innerHTML = `
    <div class="lib-pesquisa-box">
      <input id="lib-search-input" class="lib-input" placeholder="Buscar por título ou autor..." value="${filtro}" />
      <button class="lib-search-btn" onclick="buscar()">Buscar</button>
    </div>
    ${resultados}
  `
}

// ── Ações ────────────────────────────────────────────
window.showTab = function(tab) {
  document.querySelectorAll('.lib-section').forEach((el) => el.classList.remove('visible'))
  document.querySelectorAll('.lib-tab').forEach((el) => el.classList.remove('active'))
  document.getElementById(`tab-${tab}`).classList.add('visible')
  event.target.classList.add('active')
}

window.renovar = function(id) {
  const toast = document.getElementById('toast')
  toast.classList.add('show')
  setTimeout(() => toast.classList.remove('show'), 2500)
}

window.reservar = function(titulo) {
  const toast = document.getElementById('toast')
  toast.textContent = `✓ "${titulo}" reservado!`
  toast.classList.add('show')
  setTimeout(() => { toast.classList.remove('show'); toast.textContent = '✓ Renovado com sucesso!' }, 2500)
}

window.buscar = function() {
  const filtro = document.getElementById('lib-search-input').value
  renderPesquisa(filtro)
}

// ── Init ─────────────────────────────────────────────
renderEmprestimos()
renderHistorico()
renderPesquisa()
