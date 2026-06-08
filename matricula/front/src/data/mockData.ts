export interface Aula {
  id: string
  disciplina: string
  sigla: string
  professor: string
  dia: 1 | 2 | 3 | 4 | 5  // 1=Seg … 5=Sex
  inicio: number            // hora inteira (ex: 8 = 08:00)
  duracao: number           // em horas
  sala: string
  cor: string
}

export interface DisciplinaDisponivel {
  codigo: string
  nome: string
  professor: string
  ch: number
  vagas: number
  vagasOcupadas: number
  horarios: string
  prereq: string
}

export const grade: Aula[] = [
  { id: '1', disciplina: 'Estruturas de Dados Avançadas', sigla: 'EDA',  professor: 'Prof. Dr. Ricardo Santos',  dia: 1, inicio: 8,  duracao: 2, sala: 'Lab 3',  cor: '#3182CE' },
  { id: '2', disciplina: 'Estruturas de Dados Avançadas', sigla: 'EDA',  professor: 'Prof. Dr. Ricardo Santos',  dia: 3, inicio: 8,  duracao: 2, sala: 'Lab 3',  cor: '#3182CE' },
  { id: '3', disciplina: 'Banco de Dados II',             sigla: 'BD2',  professor: 'Prof. Dra. Ana Oliveira',   dia: 2, inicio: 10, duracao: 2, sala: '201',    cor: '#38A169' },
  { id: '4', disciplina: 'Banco de Dados II',             sigla: 'BD2',  professor: 'Prof. Dra. Ana Oliveira',   dia: 4, inicio: 10, duracao: 2, sala: '201',    cor: '#38A169' },
  { id: '5', disciplina: 'Engenharia de Software',        sigla: 'ES',   professor: 'Prof. Dr. Carlos Lima',     dia: 1, inicio: 14, duracao: 2, sala: '305',    cor: '#805AD5' },
  { id: '6', disciplina: 'Engenharia de Software',        sigla: 'ES',   professor: 'Prof. Dr. Carlos Lima',     dia: 3, inicio: 14, duracao: 2, sala: '305',    cor: '#805AD5' },
  { id: '7', disciplina: 'Redes de Computadores',         sigla: 'RC',   professor: 'Prof. Dr. Paulo Costa',     dia: 2, inicio: 16, duracao: 2, sala: '102',    cor: '#DD6B20' },
  { id: '8', disciplina: 'Redes de Computadores',         sigla: 'RC',   professor: 'Prof. Dr. Paulo Costa',     dia: 4, inicio: 16, duracao: 2, sala: '102',    cor: '#DD6B20' },
  { id: '9', disciplina: 'Computação em Nuvem',           sigla: 'CN',   professor: 'Prof. Dra. Maria Silva',    dia: 5, inicio: 8,  duracao: 4, sala: 'Lab 5',  cor: '#E53E3E' },
]

export const disciplinasDisponiveis: DisciplinaDisponivel[] = [
  { codigo: 'CC501', nome: 'Inteligência Artificial',     professor: 'Prof. Dr. Rafael Moura', ch: 80, vagas: 40, vagasOcupadas: 28, horarios: 'Seg/Qua 14h–16h', prereq: 'CC401' },
  { codigo: 'CC502', nome: 'Desenvolvimento Mobile',      professor: 'Prof. Dra. Carla Dias',  ch: 60, vagas: 35, vagasOcupadas: 30, horarios: 'Ter/Qui 10h–12h', prereq: 'CC301' },
  { codigo: 'CC503', nome: 'Segurança da Informação',     professor: 'Prof. Dr. Bruno Alves',  ch: 60, vagas: 40, vagasOcupadas: 15, horarios: 'Sex 08h–12h',     prereq: 'CC404' },
  { codigo: 'CC504', nome: 'Arquitetura de Software',     professor: 'Prof. Dr. Carlos Lima',  ch: 80, vagas: 30, vagasOcupadas: 29, horarios: 'Seg/Qua 16h–18h', prereq: 'CC403' },
  { codigo: 'CC505', nome: 'Machine Learning',            professor: 'Prof. Dra. Maria Silva', ch: 80, vagas: 35, vagasOcupadas: 20, horarios: 'Ter/Qui 14h–16h', prereq: 'CC401' },
]
