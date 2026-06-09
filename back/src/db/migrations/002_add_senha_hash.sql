-- Adiciona coluna senha_hash caso a tabela já exista sem ela
ALTER TABLE alunos ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(255) NOT NULL DEFAULT '';
