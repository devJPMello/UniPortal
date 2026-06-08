export interface Disciplina {
  codigo: string
  nome: string
  professor: string
  av1: number | null
  av2: number | null
  ch: number
  situacao: 'Em Curso' | 'Aprovado' | 'Reprovado'
}

export interface SemestreHistorico {
  periodo: string
  disciplinas: Disciplina[]
}

export const semAtual: Disciplina[] = [
  { codigo: 'CC401', nome: 'Estruturas de Dados Avançadas',  professor: 'Prof. Dr. Ricardo Santos',  av1: 8.5, av2: null, ch: 80, situacao: 'Em Curso'  },
  { codigo: 'CC402', nome: 'Banco de Dados II',              professor: 'Prof. Dra. Ana Oliveira',   av1: 7.0, av2: 7.5,  ch: 60, situacao: 'Em Curso'  },
  { codigo: 'CC403', nome: 'Engenharia de Software',         professor: 'Prof. Dr. Carlos Lima',    av1: 9.0, av2: null, ch: 80, situacao: 'Em Curso'  },
  { codigo: 'CC404', nome: 'Redes de Computadores',          professor: 'Prof. Dr. Paulo Costa',    av1: 6.5, av2: 7.0,  ch: 60, situacao: 'Em Curso'  },
  { codigo: 'CC405', nome: 'Computação em Nuvem',            professor: 'Prof. Dra. Maria Silva',   av1: 8.0, av2: null, ch: 60, situacao: 'Em Curso'  },
]

export const historico: SemestreHistorico[] = [
  {
    periodo: '2024.1',
    disciplinas: [
      { codigo: 'CC301', nome: 'Programação Orientada a Objetos', professor: 'Prof. Dr. Felipe Rocha', av1: 9.0, av2: 8.5, ch: 80, situacao: 'Aprovado' },
      { codigo: 'CC302', nome: 'Banco de Dados I',                professor: 'Prof. Dra. Ana Oliveira', av1: 7.5, av2: 8.0, ch: 60, situacao: 'Aprovado' },
      { codigo: 'CC303', nome: 'Sistemas Operacionais',           professor: 'Prof. Dr. Marcos Souza',  av1: 6.0, av2: 6.5, ch: 80, situacao: 'Aprovado' },
      { codigo: 'CC304', nome: 'Estatística Aplicada',            professor: 'Prof. Dra. Lúcia Mendes', av1: 5.0, av2: 4.5, ch: 60, situacao: 'Reprovado' },
    ],
  },
  {
    periodo: '2023.2',
    disciplinas: [
      { codigo: 'CC201', nome: 'Algoritmos e Estruturas de Dados', professor: 'Prof. Dr. Ricardo Santos', av1: 8.0, av2: 9.0, ch: 80, situacao: 'Aprovado' },
      { codigo: 'CC202', nome: 'Arquitetura de Computadores',      professor: 'Prof. Dr. João Ferreira',  av1: 7.0, av2: 7.5, ch: 60, situacao: 'Aprovado' },
      { codigo: 'CC203', nome: 'Cálculo II',                       professor: 'Prof. Dr. André Pinto',   av1: 6.5, av2: 7.0, ch: 80, situacao: 'Aprovado' },
      { codigo: 'CC204', nome: 'Lógica de Programação Avançada',   professor: 'Prof. Dra. Sofia Leal',   av1: 9.5, av2: 9.0, ch: 60, situacao: 'Aprovado' },
    ],
  },
  {
    periodo: '2023.1',
    disciplinas: [
      { codigo: 'CC101', nome: 'Introdução à Computação',     professor: 'Prof. Dr. Carlos Lima',   av1: 8.5, av2: 9.0, ch: 60, situacao: 'Aprovado' },
      { codigo: 'CC102', nome: 'Cálculo I',                   professor: 'Prof. Dr. André Pinto',   av1: 7.0, av2: 6.5, ch: 80, situacao: 'Aprovado' },
      { codigo: 'CC103', nome: 'Álgebra Linear',              professor: 'Prof. Dra. Lúcia Mendes', av1: 6.5, av2: 7.5, ch: 60, situacao: 'Aprovado' },
      { codigo: 'CC104', nome: 'Fundamentos de Programação',  professor: 'Prof. Dr. Felipe Rocha',  av1: 9.0, av2: 9.5, ch: 80, situacao: 'Aprovado' },
    ],
  },
]
