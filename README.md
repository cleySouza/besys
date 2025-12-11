# beSyS

> Sistema completo de PDV/Admin + Portal do Cliente — monorepo com Turborepo

---

## 1. Introdução

beSyS é uma plataforma modular para gestão de vendas, agendamentos e operações de ponto de venda (PDV), composta por:

* Backend em **Node.js + NestJS** (API REST, JWT, RBAC)
* Frontend Admin / PDV interno (React Web) — **App 1**
* Frontend Portal Cliente (React Web / React Native) — **App 2**
* Banco de dados **PostgreSQL**
* Monorepo gerenciado por **Turborepo** com pacotes compartilhados (UI, configs, libs)

Objetivo: permitir operação de estabelecimentos (lojas, serviços) com controle de caixa, vendas, agendamentos e interação direta com o cliente final.

---

## 2. Visão de Arquitetura

Arquitetura proposta (camadas):

* **Client** — App 2 (Portal cliente)
* **Admin / PDV** — App 1 (operadores, caixa, gerência)
* **API Gateway / Backend** — NestJS REST API
* **Banco de Dados** — PostgreSQL
* **Monorepo** — Turborepo (organização e compartilhamento)

Fluxo simplificado:

```
Cliente (App 2) ---> Backend (API) ---> Banco (Postgres)
                            ^
                            |
Admin / PDV (App 1) --------
```

---

## 3. Estrutura do Monorepo (sugerida)

```
besys/
├─ apps/
│  ├─ admin/        # React app - App 1 (Admin / PDV)
│  └─ client/       # React (web) ou React Native - App 2 (Portal Cliente)
├─ backend/         # NestJS API
├─ packages/
│  ├─ ui/           # Componentes React compartilhados
│  ├─ api-types/    # Tipagens compartilhadas (TS interfaces / DTOs)
│  ├─ config/       # Configs compartilhadas (env schema, utilidades)
│  ├─ tsconfig/     # tsconfig base
│  └─ eslint/       # configurações ESLint compartilhadas
├─ .env.example
├─ turbo.json
└─ README.md
```

---

## 4. Principais Módulos (Backend)

* **Auth**: JWT, refresh tokens opcionais, login/logout.
* **Users**: CRUD usuários, perfis (admin, funcionário, cliente), relacionamentos com empresas
* **Companies**: cadastro e configurações da empresa (nome, endereço, horários, temas)
* **Products/Services**: catálogo, categorias, variações (tamanhos, tempo de serviço)
* **Orders**: criação, atualização, status (pending, confirmed, preparing, ready, delivered/canceled)
* **Appointments**: agendamentos de serviços com recursos (colaboradores, salas)
* **CashRegister**: abertura/fechamento de turno, lançamentos manuais, formas de pagamento
* **Themes**: customização visual do PDV e portal (cores, logo, layout)

---

## 5. Controle de Acesso (RBAC)

Perfis básicos:

* **admin**: acesso total (configurações, usuários, relatórios)
* **funcionário**: operar PDV, receber pedidos, gerenciar agenda interna
* **cliente**: criar pedidos, agendamentos, visualizar histórico

Regras: usar Guards do NestJS com decorators `@Roles(...)` + um `RolesGuard` global ou por rota. Mapear permissões finas para rotas sensíveis (ex.: fechamento de caixa).

---

## 6. Fluxos principais (diagramas ASCII)

### 6.1 Vendas — PDV (fluxo)

```
[Operador PDV] --seleciona produto--> [Carrinho] --finaliza venda--> [API/orders#create]
    |
    +-- aplica desconto
    +-- escolhe forma de pagamento

API -> registra pagamento -> atualiza caixa -> retorna recibo/print
```

### 6.2 Pedido do Cliente (App 2 -> PDV)

```
[Cliente App] --cria pedido--> [API/orders#create] --> notificação para PDV
                                                       |
                                                [Admin/PDV recebe pedido]
                                                       |
                                       PDV confirma/recusa -> API envia confirmação ao Cliente
```

### 6.3 Agendamento

```
[Cliente] -> seleciona serviço -> escolhe data/hora -> API/appointments#create
    |
    -> API verifica disponibilidade (colaborador/slot)
    -> Confirmação enviada para PDV
    -> PDV aceita/ajusta -> status atualizado
```

---

## 7. Stack de Tecnologias (sugestão)

* Monorepo: **Turborepo**
* Backend: **Node.js**, **NestJS**, **TypeScript**, **TypeORM** ou **Prisma** (recomendado: Prisma)
* DB: **PostgreSQL**
* Frontend Admin: **React**, **Vite**, **TypeScript**, **Tailwind CSS**
* Frontend Cliente: **React** (web) ou **React Native** (se mobile), **TypeScript**
* Autenticação: **JWT** (passport-jwt / nestjs/jwt)
* Mensageria/Notifications: WebSockets (Socket.IO) ou push notifications
* Testes: Jest (backend), React Testing Library (frontend)
* CI/CD: GitHub Actions

---

## 8. Como rodar cada módulo (comandos iniciais)

> Assumimos Node.js >= 18, pnpm, Git

### 8.1 Preparar repositório e ferramentas

```bash
# Instalar pnpm (se necessário)
npm install -g pnpm

# Clonar (após criar repositório no GitHub)
git clone git@github.com:<seu-usuario>/besys.git
cd besys

# Instalar dependências no monorepo
pnpm install
```

### 8.2 Backend (NestJS)

```bash
# Entrar na pasta backend
cd apps/backend

# Instalar dependências (se necessário)
pnpm install

# Rodar migrations (Prisma) / Start localmente
pnpm prisma migrate dev --name init
pnpm run start:dev
```

Padrões de scripts em `package.json` do backend:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest"
  }
}
```

### 8.3 Frontends (Admin / Client)

```bash
# Admin
cd apps/admin
pnpm install
pnpm run dev

# Client
cd ../client
pnpm install
pnpm run dev
```

Scripts sugeridos:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 8.4 Rodar tudo com Turborepo (monorepo root)

No diretório raiz `besys/`:

```bash
pnpm install
pnpm -w turbo run dev
```

> Configurar `turbo.json` para pipeline `dev` que faça `apps/backend`, `apps/admin`, `apps/client` startados em paralelo (ou use pm2/local terminals durante desenvolvimento).

---

## 9. Como preparar o Turborepo (passo a passo)

1. Instalar pnpm globalmente.
2. `pnpm create turbo@latest` ou configurar `turbo.json` manualmente.
3. Configurar `package.json` raiz com scripts úteis:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint"
  }
}
```

4. Em cada app, definir scripts `dev`, `build`, `lint` compatíveis.
5. Compartilhar configs via `packages/` (tsconfig, eslint, tailwind config, storybook, etc.).

---

## 10. Como subir para o GitHub (exemplo rápido)

```bash
# criar repositório no GitHub primeiro
git init
git add .
git commit -m "chore: initial monorepo besys"
git branch -M main
git remote add origin git@github.com:<seu-usuario>/besys.git
git push -u origin main
```

Sugestão: usar GitHub Actions para CI (instalar dependências, rodar linter, run tests, build).

---

## 11. Estrutura de pastas prevista (detalhada)

```
besys/
├─ apps/
│  ├─ admin/
│  │  ├─ public/
│  │  ├─ src/
│  │  │  ├─ pages/
│  │  │  ├─ components/
│  │  │  ├─ hooks/
│  │  │  ├─ services/   # chamadas à API
│  │  │  └─ styles/
│  │  └─ package.json
│  ├─ client/
│  └─ backend/
│     ├─ src/
│     │  ├─ modules/
│     │  │  ├─ auth/
│     │  │  ├─ users/
│     │  │  ├─ companies/
│     │  │  └─ orders/
│     │  ├─ main.ts
│     │  └─ app.module.ts
│     └─ package.json
├─ packages/
│  ├─ ui/
│  ├─ api-types/
│  └─ config/
└─ turbo.json
```

---

## 12. Roadmap inicial (MVP -> V1 -> V2)

### MVP (4–6 semanas estimadas)

* Autenticação básica (JWT)
* CRUD Users, Companies
* Produtos/Serviços (CRUD)
* PDV (venda simples) no Admin
* Portal Cliente: visualizar catálogo e realizar pedido
* Banco: Postgres + migrations iniciais
* Monorepo e scripts dev funcionando

### V1

* RBAC completo
* Controle de caixa (abertura/fechamento)
* Agendamentos (com disponibilidade)
* Notificações em tempo real (WebSockets)
* Relatórios básicos (vendas diárias)

### V2

* Multi-empresa (tenancy avançada)
* Integrações de pagamento (Stripe, PagSeguro)
* Integração com impressora/PDV local
* Mobile App dedicado (React Native)

---

## 13. Boas práticas e decisões recomendadas

* Usar **Prisma** para migrations e tipagem do DB (boa DX).
* Separar responsabilidades por módulos no NestJS (cada domínio com service/controller/module).
* DTOs e validação com `class-validator` / `class-transformer`.
* Componentes UI reutilizáveis em `packages/ui` com Storybook.
* Testes unitários e de integração desde o início.

---

## 14. Tutoriais iniciais rápidos (comandos)

### 14.1 Inicializar backend NestJS (boilerplate)

```bash
# No monorepo raiz
mkdir -p apps/backend && cd apps/backend
pnpm init -y
pnpm add -w -D typescript
pnpm add @nestjs/core @nestjs/common @nestjs/cli @nestjs/platform-express reflect-metadata rxjs
pnpm exec nest new . --skip-git --package-manager pnpm
# ou usar nest cli global: npm i -g @nestjs/cli ; nest new backend
```

Arquivos importantes: `src/main.ts`, `src/app.module.ts`, `src/modules`.

### 14.2 Inicializar frontends (Vite + React + TS)

```bash
# Admin
pnpm create vite apps/admin -- --template react-ts

# Client (web)
pnpm create vite apps/client -- --template react-ts
```

Instalar Tailwind e configurar conforme docs do Tailwind + Vite.

### 14.3 Preparar Turborepo

```bash
pnpm create turbo@latest
# ou manualmente adicionar turbo.json com pipelines dev/build
pnpm add -w turbo
```

### 14.4 Inicializar Prisma (Backend)

```bash
# no backend
pnpm add -w prisma @prisma/client
pnpm prisma init
# editar schema.prisma com provider = "postgresql"
```

---

## 15. Boilderplate inicial sugerido (arquivos-chave)

* `apps/backend/src/main.ts` — bootstrap do NestJS
* `apps/backend/src/app.module.ts` — import Module(s)
* `apps/backend/src/modules/auth` — login, jwt strategy
* `apps/backend/src/modules/users` — entidade + service + controller
* `apps/admin/src/main.tsx` — root React
* `packages/ui` — botão, inputs, layout base

---

## 16. Próximos passos (curto prazo)

1. Criar repositório no GitHub e inicializar monorepo (turbo + pnpm).
2. Gerar scaffold do backend (NestJS) + configurar Prisma + primeiro model `User` e `Company`.
3. Criar scaffold do admin (Vite React) com layout base e login form.
4. Integrar endpoint de login JWT entre backend e admin.
5. Entregar PRs pequenos e iterativos — eu acompanho e ajudo no código-boilerplate.

---

## 17. Contato / Como vou trabalhar com você

* Prefiro dividir tarefas em issues/milestones no GitHub.
* Cada entrega deve ter PR com descrição, testes mínimos e checklist.
* Podemos usar este chat para iteração rápida: eu gero código, scripts e explico como testar.

---

> Se quiser, já posso gerar agora:
>
> * os comandos exatos para inicializar cada módulo (scripts `pnpm`),
> * os templates/boilerplates (arquivos `src/*`) para `backend`, `admin` e `client`.

Escolha: eu gero os **comandos de inicialização** agora ou já gero o **boilerplate inicial** (código) para cada módulo.
