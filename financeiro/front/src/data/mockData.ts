export interface Boleto {
  id: number
  mes: string
  valor: number
  vencimento: string
  status: 'pago' | 'pendente' | 'vencido'
  codigo: string
}

export interface ResumoFinanceiro {
  mensalidadesPagas: number
  totalPago: number
  boletosPendentes: number | null
  boletosVencidos: number
}

export interface FinanceiroDados {
  boletos: Boleto[]
  resumo: ResumoFinanceiro
}

export const mockBoletos: Boleto[] = [
  { id: 1, mes: 'Junho/2026',     valor: 1850.00, vencimento: '05/06/2026', status: 'pendente', codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 2, mes: 'Maio/2026',      valor: 1850.00, vencimento: '05/05/2026', status: 'pago',     codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 3, mes: 'Abril/2026',     valor: 1850.00, vencimento: '05/04/2026', status: 'pago',     codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 4, mes: 'Março/2026',     valor: 1850.00, vencimento: '05/03/2026', status: 'pago',     codigo: '00190.50034 56894.190000 40195.476115 7 00000185000' },
  { id: 5, mes: 'Fevereiro/2026', valor: 1970.00, vencimento: '05/02/2026', status: 'vencido',  codigo: '00190.50034 56894.190000 40195.476115 7 00000197000' },
]

export const mockResumo: ResumoFinanceiro = {
  mensalidadesPagas: 3,
  totalPago: 5550.00,
  boletosPendentes: 1850.00,
  boletosVencidos: 1,
}
