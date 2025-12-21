# 🧩 beSyS — **Documentação de Arquitetura**

## 🚀 1. Visão Geral

O **beSyS** é um **SaaS modular para bares e restaurantes**, cobrindo operação interna, atendimento ao cliente e gestão administrativa.

O ecossistema é composto por **4 aplicações principais**, um **backend centralizado** e **pacotes compartilhados**, organizados em um **Monorepo com Turborepo**.

A arquitetura foi desenhada para ser:

* 🔌 **Modular**
* 📈 **Escalável**
* 🧼 **Fácil de manter**
* ♻️ **Reutilizável**

---

## 🏗️ 2. Arquitetura de Alto Nível

```
                     ┌────────────────────┐
                     │ 🌐 Client Web       │
                     │ (Cliente Final)    │
                     └─────────┬──────────┘
                               │
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐     ┌────────────────┐     ┌──────────────────┐
│ 📱 Waiter App│     │ 🖥️ Admin / PDV │     │ ⚙️ Backend API   │
│ React Native │ ──▶ │   Next.js      │ ──▶ │   NestJS         │ ──▶ 🗄️ PostgreSQL
└──────────────┘     └────────────────┘     └──────────────────┘
                              ▲
                              └──────── WebSockets (futuro)
```

### Componentes

* 🖥️ **Admin / PDV (Web)** → gestão, caixa, pedidos e relatórios
* 🌐 **Client Web** → cardápio, pedidos e acompanhamento
* 📱 **Waiter App** → criação e gestão de pedidos em salão
* ⚙️ **Backend (NestJS)** → regras de negócio, segurança e persistência
* 🗄️ **PostgreSQL** → banco relacional principal

---

## 📦 3. Monorepo com Turborepo

Estrutura oficial do projeto:

```
besys/
├─ apps/
│  ├─ admin/      # Next.js (Admin / PDV)
│  ├─ client/     # Next.js (Cliente final)
│  ├─ waiter/     # React Native CLI (Garçom)
│  └─ backend/    # NestJS API
├─ packages/
│  ├─ shared-types   # Tipagens compartilhadas
│  ├─ ui             # Componentes reutilizáveis
│  ├─ config         # Configurações globais
│  ├─ tsconfig
│  └─ eslint
└─ turbo.json
```

### 🎯 Benefícios do Monorepo

* ♻️ **Reuso de tipagens, contratos e configs**
* ⚡ **Builds e dev otimizados via cache**
* 🧱 **Padronização total entre apps**
* 🧠 **Evolução coordenada do produto**

---

## 🔗 4. Comunicação Entre Sistemas

### 4.1 🌐 REST API

* Padrão `/api/v1/...`
* Controllers por domínio
* DTOs + validação

### 4.2 🔌 WebSockets *(roadmap)*

Eventos em tempo real:

* 🧾 Pedidos
* 💰 Caixa
* 📅 Agendamentos
* 🔔 Notificações para Garçom

---

## 🛡️ 5. Segurança da Arquitetura

* 🔑 JWT + Refresh Token
* 🧩 RBAC (admin, employee, client)
* 🛁 Validação e sanitização
* 🚧 Rate limiting + CORS

---

## 🗄️ 6. Banco de Dados (Prisma ORM)

Modelo conceitual:

```
User ── Company ── Product ── Order ── OrderItem
                    │             └─ CashRegister
              Appointment
```

* 🟦 Prisma ORM
* 🧬 Migrations versionadas
* 📊 Relacionamentos explícitos

---

## 🔄 7. Fluxos Principais

### 7.1 🛒 Venda no PDV

```
Admin / Garçom → cria pedido → API valida
             → Caixa atualiza → Status sincronizado
```

### 7.2 📦 Pedido do Cliente

```
Cliente → Pedido → API → PDV / Garçom → Confirmação
```

### 7.3 📅 Agendamento

```
Cliente → Seleciona serviço → Escolhe data
       → API valida → PDV aprova
```

---

## ☁️ 8. Deploy e Infraestrutura

### ⚙️ Backend

* 🐳 Docker
* 🔄 CI/CD (GitHub Actions)

### 🎨 Frontends

* 🖥️ Admin / Client Web → Vercel
* 📱 Waiter → Play Store / TestFlight

### 🗄️ Banco de Dados

* Railway / Supabase / AWS RDS

---

## 🧭 9. Roadmap de Arquitetura

* [ ] 📡 WebSockets (tempo real)
* [ ] 🏢 Multi-tenancy (schema por empresa)
* [ ] ⚡ Cache Redis
* [ ] 📥 Filas (BullMQ / Redis)
* [ ] 📊 Observabilidade (logs, métricas)
