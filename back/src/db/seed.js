import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pool from './connection.js'

const SENHA_DEMO = 'uniportal'

async function seed() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    await client.query(`
      TRUNCATE TABLE
        pre_matriculas,
        emprestimos,
        catalogo_biblioteca,
        boletos,
        historico,
        matriculas_atual,
        grade_horarios,
        disciplinas_disponiveis,
        disciplinas,
        alunos
      RESTART IDENTITY CASCADE
    `)

    const senhaHash = await bcrypt.hash(SENHA_DEMO, 12)

    await client.query(`
      INSERT INTO alunos (ra, nome, curso, semestre, email, senha_hash) VALUES
        ('2024001', 'João Pedro Mello', 'Ciência da Computação', '4º Semestre', 'joao.mello@uni.edu.br', $1)
    `, [senhaHash])

    await client.query(`
      INSERT INTO disciplinas (codigo, nome, professor, ch, sigla) VALUES
        ('CC101', 'Introdução à Computação',          'Prof. Dr. Carlos Lima',       60,  NULL),
        ('CC102', 'Cálculo I',                        'Prof. Dr. André Pinto',       80,  NULL),
        ('CC103', 'Álgebra Linear',                   'Prof. Dra. Lúcia Mendes',     60,  NULL),
        ('CC104', 'Fundamentos de Programação',       'Prof. Dr. Felipe Rocha',      80,  NULL),
        ('CC201', 'Algoritmos e Estruturas de Dados', 'Prof. Dr. Ricardo Santos',    80,  NULL),
        ('CC202', 'Arquitetura de Computadores',      'Prof. Dr. João Ferreira',     60,  NULL),
        ('CC203', 'Cálculo II',                       'Prof. Dr. André Pinto',       80,  NULL),
        ('CC204', 'Lógica de Programação Avançada',   'Prof. Dra. Sofia Leal',       60,  NULL),
        ('CC301', 'Programação Orientada a Objetos',  'Prof. Dr. Felipe Rocha',      80,  NULL),
        ('CC302', 'Banco de Dados I',                 'Prof. Dra. Ana Oliveira',     60,  NULL),
        ('CC303', 'Sistemas Operacionais',            'Prof. Dr. Marcos Souza',      80,  NULL),
        ('CC304', 'Estatística Aplicada',             'Prof. Dra. Lúcia Mendes',     60,  NULL),
        ('CC401', 'Estruturas de Dados Avançadas',    'Prof. Dr. Ricardo Santos',    80,  'EDA'),
        ('CC402', 'Banco de Dados II',                'Prof. Dra. Ana Oliveira',     60,  'BD2'),
        ('CC403', 'Engenharia de Software',           'Prof. Dr. Carlos Lima',       80,  'ES'),
        ('CC404', 'Redes de Computadores',            'Prof. Dr. Paulo Costa',       60,  'RC'),
        ('CC405', 'Computação em Nuvem',              'Prof. Dra. Maria Silva',      60,  'CN')
    `)

    await client.query(`
      INSERT INTO grade_horarios (id, disciplina_codigo, dia, inicio, duracao, sala, cor) VALUES
        ('1', 'CC401', 1, 8,  2, 'Lab 3', '#3182CE'),
        ('2', 'CC401', 3, 8,  2, 'Lab 3', '#3182CE'),
        ('3', 'CC402', 2, 10, 2, '201',   '#38A169'),
        ('4', 'CC402', 4, 10, 2, '201',   '#38A169'),
        ('5', 'CC403', 1, 14, 2, '305',   '#805AD5'),
        ('6', 'CC403', 3, 14, 2, '305',   '#805AD5'),
        ('7', 'CC404', 2, 16, 2, '102',   '#DD6B20'),
        ('8', 'CC404', 4, 16, 2, '102',   '#DD6B20'),
        ('9', 'CC405', 5, 8,  4, 'Lab 5', '#E53E3E')
    `)

    await client.query(`
      INSERT INTO matriculas_atual (aluno_ra, disciplina_codigo, periodo, av1, av2, situacao, faltas) VALUES
        ('2024001', 'CC401', '2026.1', 8.5, NULL, 'Em Curso', 2),
        ('2024001', 'CC402', '2026.1', 7.0, 7.5,  'Em Curso', 0),
        ('2024001', 'CC403', '2026.1', 9.0, NULL, 'Em Curso', 1),
        ('2024001', 'CC404', '2026.1', 6.5, 7.0,  'Em Curso', 4),
        ('2024001', 'CC405', '2026.1', 8.0, NULL, 'Em Curso', 0)
    `)

    await client.query(`
      INSERT INTO historico (aluno_ra, disciplina_codigo, periodo, av1, av2, situacao) VALUES
        ('2024001', 'CC301', '2025.2', 9.0, 8.5, 'Aprovado'),
        ('2024001', 'CC302', '2025.2', 7.5, 8.0, 'Aprovado'),
        ('2024001', 'CC303', '2025.2', 6.0, 6.5, 'Aprovado'),
        ('2024001', 'CC304', '2025.2', 5.0, 4.5, 'Reprovado'),
        ('2024001', 'CC201', '2025.1', 8.0, 9.0, 'Aprovado'),
        ('2024001', 'CC202', '2025.1', 7.0, 7.5, 'Aprovado'),
        ('2024001', 'CC203', '2025.1', 6.5, 7.0, 'Aprovado'),
        ('2024001', 'CC204', '2025.1', 9.5, 9.0, 'Aprovado'),
        ('2024001', 'CC101', '2024.2', 8.5, 9.0, 'Aprovado'),
        ('2024001', 'CC102', '2024.2', 7.0, 6.5, 'Aprovado'),
        ('2024001', 'CC103', '2024.2', 6.5, 7.5, 'Aprovado'),
        ('2024001', 'CC104', '2024.2', 9.0, 9.5, 'Aprovado')
    `)

    await client.query(`
      INSERT INTO disciplinas_disponiveis (codigo, nome, professor, ch, vagas, vagas_ocupadas, horarios, prereq) VALUES
        ('CC501', 'Inteligência Artificial', 'Prof. Dr. Rafael Moura', 80, 40, 28, 'Seg/Qua 14h-16h', 'CC401'),
        ('CC502', 'Desenvolvimento Mobile',  'Prof. Dra. Carla Dias',  60, 35, 30, 'Ter/Qui 10h-12h', 'CC301'),
        ('CC503', 'Segurança da Informação', 'Prof. Dr. Bruno Alves',  60, 40, 15, 'Sex 08h-12h',     'CC404'),
        ('CC504', 'Arquitetura de Software', 'Prof. Dr. Carlos Lima',  80, 30, 29, 'Seg/Qua 16h-18h', 'CC403'),
        ('CC505', 'Machine Learning',        'Prof. Dra. Maria Silva', 80, 35, 20, 'Ter/Qui 14h-16h', 'CC401')
    `)

    await client.query(`
      INSERT INTO boletos (aluno_ra, mes, valor, vencimento, status, codigo) VALUES
        ('2024001', 'Junho/2026',     1850.00, '05/06/2026', 'pendente', '00190.50034 56894.190000 40195.476115 7 00000185000'),
        ('2024001', 'Maio/2026',      1850.00, '05/05/2026', 'pago',     '00190.50034 56894.190000 40195.476115 7 00000185000'),
        ('2024001', 'Abril/2026',     1850.00, '05/04/2026', 'pago',     '00190.50034 56894.190000 40195.476115 7 00000185000'),
        ('2024001', 'Março/2026',     1850.00, '05/03/2026', 'pago',     '00190.50034 56894.190000 40195.476115 7 00000185000'),
        ('2024001', 'Fevereiro/2026', 1970.00, '05/02/2026', 'vencido',  '00190.50034 56894.190000 40195.476115 7 00000197000')
    `)

    await client.query(`
      INSERT INTO emprestimos (aluno_ra, titulo, autor, isbn, emprestado, devolucao, devolvido, status, icon) VALUES
        ('2024001', 'Clean Code',               'Robert C. Martin',          '978-0132350884', '15/05/2026', '29/05/2026', NULL,         'atrasado', '📕'),
        ('2024001', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt',  '978-0135957059', '18/05/2026', '01/06/2026', NULL,         'ativo',    '📗'),
        ('2024001', 'Design Patterns',          'Gang of Four',               NULL,             '01/04/2026', NULL,         '15/04/2026', 'devolvido','📘'),
        ('2024001', 'Refactoring',              'Martin Fowler',              NULL,             '10/03/2026', NULL,         '24/03/2026', 'devolvido','📙'),
        ('2024001', 'Domain-Driven Design',     'Eric Evans',                 NULL,             '05/02/2026', NULL,         '19/02/2026', 'devolvido','📒')
    `)

    await client.query(`
      INSERT INTO catalogo_biblioteca (titulo, autor, disponivel) VALUES
        ('Inteligência Artificial: Uma Abordagem Moderna', 'Russell & Norvig',     TRUE),
        ('Redes de Computadores',                          'Andrew Tanenbaum',     TRUE),
        ('Engenharia de Software',                         'Ian Sommerville',      FALSE),
        ('Introduction to Algorithms',                     'Cormen et al.',        TRUE),
        ('Computer Organization',                          'Patterson & Hennessy', FALSE)
    `)

    await client.query('COMMIT')
    console.log(`Seed concluído. Credenciais demo -> RA: 2024001 | Senha: ${SENHA_DEMO}`)
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch((err) => { console.error(err); process.exit(1) })
