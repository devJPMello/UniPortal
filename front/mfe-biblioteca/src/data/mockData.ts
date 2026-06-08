export interface Emprestimo {
  id: number
  titulo: string
  autor: string
  isbn: string | null
  emprestado: string
  devolucao: string
  status: 'ativo' | 'atrasado'
  icon: string
}

export interface HistoricoLivro {
  titulo: string
  autor: string
  emprestado: string
  devolvido: string
  icon: string
}

export interface LivroCatalogo {
  titulo: string
  autor: string
  disponivel: boolean
}

export interface BibliotecaDados {
  emprestimosAtivos: Emprestimo[]
  historico: HistoricoLivro[]
  catalogo: LivroCatalogo[]
}

export const mockEmprestimos: Emprestimo[] = [
  { id: 1, titulo: 'Clean Code',               autor: 'Robert C. Martin',          isbn: '978-0132350884', emprestado: '15/05/2026', devolucao: '29/05/2026', status: 'atrasado', icon: '📕' },
  { id: 2, titulo: 'The Pragmatic Programmer', autor: 'David Thomas, Andrew Hunt',  isbn: '978-0135957059', emprestado: '18/05/2026', devolucao: '01/06/2026', status: 'ativo',    icon: '📗' },
]

export const mockHistorico: HistoricoLivro[] = [
  { titulo: 'Design Patterns',      autor: 'Gang of Four',  emprestado: '01/04/2026', devolvido: '15/04/2026', icon: '📘' },
  { titulo: 'Refactoring',          autor: 'Martin Fowler', emprestado: '10/03/2026', devolvido: '24/03/2026', icon: '📙' },
  { titulo: 'Domain-Driven Design', autor: 'Eric Evans',    emprestado: '05/02/2026', devolvido: '19/02/2026', icon: '📒' },
]

export const mockCatalogo: LivroCatalogo[] = [
  { titulo: 'Inteligência Artificial: Uma Abordagem Moderna', autor: 'Russell & Norvig',     disponivel: true  },
  { titulo: 'Redes de Computadores',                          autor: 'Andrew Tanenbaum',     disponivel: true  },
  { titulo: 'Engenharia de Software',                         autor: 'Ian Sommerville',      disponivel: false },
  { titulo: 'Introduction to Algorithms',                     autor: 'Cormen et al.',        disponivel: true  },
  { titulo: 'Computer Organization',                          autor: 'Patterson & Hennessy', disponivel: false },
]
