# Roteiro de Apresentacao - UniPortal

## Ideia principal

O UniPortal foi organizado como uma aplicacao de micro-frontends. Existe um shell principal, responsavel por login, layout e navegacao, e quatro modulos de negocio carregados dinamicamente:

- Academico
- Matricula
- Biblioteca
- Financeiro

Cada modulo tem seu proprio projeto frontend, sua propria porta, seu proprio build e expoe um `remoteEntry.js` via Module Federation.

## Como se relaciona com a aula

A aula mostra que micro-frontends servem para evitar que o frontend vire um monolito unico. No UniPortal, a tela final parece uma aplicacao so, mas cada area funcional fica separada em um micro-frontend.

O shell compoe os modulos em tempo de execucao usando Module Federation:

- `shell`: container da aplicacao
- `mfe-academico`: notas, boletim e historico
- `mfe-matricula`: grade e processo de matricula
- `mfe-biblioteca`: emprestimos e catalogo
- `mfe-financeiro`: boletos e resumo financeiro

## O que o shell faz

- Controla a autenticacao.
- Guarda o token JWT.
- Define as rotas principais.
- Carrega os micro-frontends remotos.
- Passa o token para cada modulo por props.

## O que cada micro-frontend faz

Cada MFE concentra uma area do dominio academico. Eles nao precisam conhecer a estrutura interna do shell; recebem apenas o token e buscam seus dados na API.

Isso reduz acoplamento entre areas do sistema e permite evoluir cada modulo separadamente.

## Decisao importante

O projeto usa micro-frontends no frontend, mas o backend ainda e uma API unificada em Express.

Isso significa que o projeto nao e uma arquitetura completa de microservicos. A escolha foi manter o backend centralizado para simplificar o trabalho e focar na composicao dos frontends.

Na apresentacao, expliquem assim:

> "Nosso foco foi aplicar micro-frontends na camada de interface. O backend ficou como uma API unificada, funcionando como ponto central de dados para os modulos."

## Como rodar

```bash
npm install
docker compose -f infra/docker-compose.yml up -d
npm run setup:db
npm start
```

Servicos:

- Shell: http://localhost:3000
- API: http://localhost:4000
- Academico: http://localhost:3001
- Matricula: http://localhost:3002
- Biblioteca: http://localhost:3003
- Financeiro: http://localhost:3004

Credenciais de demo:

- RA: `2024001`
- Senha: `uniportal`

## O que mostrar na apresentacao

1. Login no shell.
2. Navegacao entre Dashboard, Academico, Matricula, Biblioteca e Financeiro.
3. Explicar que cada modulo vem de uma aplicacao separada.
4. Abrir rapidamente os arquivos `vite.config.ts` do shell e de um MFE para mostrar o Module Federation.
5. Mostrar que os remotes geram `remoteEntry.js`.

## Pontos fortes

- Separacao por dominio.
- Shell simples compondo modulos remotos.
- Uso real de Module Federation.
- Cada MFE tem build independente.
- Compartilhamento controlado de React e ReactDOM.
- Design system compartilhado para manter consistencia visual.

## Limitacoes assumidas

- Backend centralizado, nao microservicos.
- Monorepo, entao a independencia dos times e simulada.
- Contratos entre shell e MFEs ainda sao simples.

Essas limitacoes nao invalidam o projeto, mas devem ser explicadas com clareza.
