CREATE TABLE IF NOT EXISTS schema_migrations (
  version     VARCHAR(20) PRIMARY KEY,
  aplicado_em TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alunos (
  ra          VARCHAR(20)  PRIMARY KEY,
  nome        VARCHAR(200) NOT NULL,
  curso       VARCHAR(200) NOT NULL,
  semestre    VARCHAR(50)  NOT NULL,
  email       VARCHAR(200) NOT NULL,
  senha_hash  VARCHAR(255) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS disciplinas (
  codigo    VARCHAR(10)  PRIMARY KEY,
  nome      VARCHAR(200) NOT NULL,
  professor VARCHAR(200) NOT NULL,
  ch        SMALLINT     NOT NULL,
  sigla     VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS grade_horarios (
  id                 VARCHAR(10) PRIMARY KEY,
  disciplina_codigo  VARCHAR(10) NOT NULL REFERENCES disciplinas(codigo),
  dia                SMALLINT    NOT NULL,
  inicio             SMALLINT    NOT NULL,
  duracao            SMALLINT    NOT NULL,
  sala               VARCHAR(50) NOT NULL,
  cor                VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS matriculas_atual (
  id                 SERIAL      PRIMARY KEY,
  aluno_ra           VARCHAR(20) NOT NULL REFERENCES alunos(ra),
  disciplina_codigo  VARCHAR(10) NOT NULL REFERENCES disciplinas(codigo),
  periodo            VARCHAR(10) NOT NULL,
  av1                NUMERIC(4,1),
  av2                NUMERIC(4,1),
  situacao           VARCHAR(20) NOT NULL DEFAULT 'Em Curso',
  faltas             SMALLINT    NOT NULL DEFAULT 0,
  UNIQUE(aluno_ra, disciplina_codigo, periodo)
);

CREATE TABLE IF NOT EXISTS historico (
  id                 SERIAL      PRIMARY KEY,
  aluno_ra           VARCHAR(20) NOT NULL REFERENCES alunos(ra),
  disciplina_codigo  VARCHAR(10) NOT NULL REFERENCES disciplinas(codigo),
  periodo            VARCHAR(10) NOT NULL,
  av1                NUMERIC(4,1),
  av2                NUMERIC(4,1),
  situacao           VARCHAR(20) NOT NULL,
  UNIQUE(aluno_ra, disciplina_codigo, periodo)
);

CREATE TABLE IF NOT EXISTS disciplinas_disponiveis (
  codigo         VARCHAR(10)  PRIMARY KEY,
  nome           VARCHAR(200) NOT NULL,
  professor      VARCHAR(200) NOT NULL,
  ch             SMALLINT     NOT NULL,
  vagas          SMALLINT     NOT NULL,
  vagas_ocupadas SMALLINT     NOT NULL DEFAULT 0,
  horarios       VARCHAR(100) NOT NULL,
  prereq         VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS pre_matriculas (
  id                 SERIAL      PRIMARY KEY,
  aluno_ra           VARCHAR(20) NOT NULL REFERENCES alunos(ra),
  disciplina_codigo  VARCHAR(10) NOT NULL REFERENCES disciplinas_disponiveis(codigo),
  criado_em          TIMESTAMP   NOT NULL DEFAULT NOW(),
  UNIQUE(aluno_ra, disciplina_codigo)
);

CREATE TABLE IF NOT EXISTS boletos (
  id         SERIAL        PRIMARY KEY,
  aluno_ra   VARCHAR(20)   NOT NULL REFERENCES alunos(ra),
  mes        VARCHAR(50)   NOT NULL,
  valor      NUMERIC(10,2) NOT NULL,
  vencimento VARCHAR(20)   NOT NULL,
  status     VARCHAR(20)   NOT NULL,
  codigo     VARCHAR(100)  NOT NULL
);

CREATE TABLE IF NOT EXISTS emprestimos (
  id         SERIAL       PRIMARY KEY,
  aluno_ra   VARCHAR(20)  NOT NULL REFERENCES alunos(ra),
  titulo     VARCHAR(200) NOT NULL,
  autor      VARCHAR(200) NOT NULL,
  isbn       VARCHAR(50),
  emprestado VARCHAR(20)  NOT NULL,
  devolucao  VARCHAR(20),
  devolvido  VARCHAR(20),
  status     VARCHAR(20)  NOT NULL,
  icon       VARCHAR(10)  NOT NULL
);

CREATE TABLE IF NOT EXISTS catalogo_biblioteca (
  id         SERIAL       PRIMARY KEY,
  titulo     VARCHAR(200) NOT NULL,
  autor      VARCHAR(200) NOT NULL,
  disponivel BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_matriculas_aluno  ON matriculas_atual (aluno_ra);
CREATE INDEX IF NOT EXISTS idx_matriculas_periodo ON matriculas_atual (periodo);
CREATE INDEX IF NOT EXISTS idx_historico_aluno    ON historico (aluno_ra);
CREATE INDEX IF NOT EXISTS idx_historico_periodo  ON historico (periodo);
CREATE INDEX IF NOT EXISTS idx_boletos_aluno      ON boletos (aluno_ra);
CREATE INDEX IF NOT EXISTS idx_emprestimos_aluno  ON emprestimos (aluno_ra);
