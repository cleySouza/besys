# 🧩 beSyS — **Documentação de Arquitetura**

## 🚀 1. Visão Geral

O **beSyS** é um ecossistema modular para gestão comercial, composto por múltiplos apps, backend robusto e pacotes compartilhados — tudo organizado em um **Monorepo Turborepo**. A arquitetura foi pensada para ser:

* 🔌 **Modular**
* 📈 **Escalável**
* 🧼 **Fácil de manter**
* ♻️ **Reutilizável**

---

## 🏗️ 2. Arquitetura de Alto Nível

```
                 ┌────────────────────┐
                 │  🌐 Portal Cliente │
                 │       (App 2)      │
                 └─────────┬──────────┘
                           |
                           v
┌────────────────┐     ┌────────────────┐
│ 🖥️ Admin / PDV │ --> │ ⚙️ Backend API  │ --> 🗄️ PostgreSQL
│     (App 1)    │     │    (NestJS)    │
└──────┬─────────┘     └────────────────┘
       |                     ▲
       └─────────────────────┘
```

**Componentes:**

* 🖥️ **App 1 (Admin/PDV)** → consumo de rotas autenticadas + envio de eventos.
* 📱 **App 2 (Cliente)** → pedidos, agendamentos e retornos.
* ⚙️ **Backend** → núcleo das regras de negócio e persistência.
* 🗄️ **PostgreSQL** → banco relacional principal.

---

## 📦 3. Monorepo com Turborepo

Estrutura:

```
besys/
├─ apps/
│  ├─ admin/
│  ├─ client/
│  └─ backend/
├─ packages/
│  ├─ ui/
│  ├─ api-types/
│  ├─ config/
│  ├─ tsconfig/
│  └─ eslint/
└─ turbo.json
```

### 🎯 Benefícios do Monorepo

* ♻️ **Reutilização de UI, tipagens e configs**
* ⚡ **Builds otimizados com cache**
* 🧹 **Padronização total (eslint, tsconfig, libs)**
* 🧱 **Arquitetura limpa entre apps e pacotes**

---

## 🔗 4. Comunicação Entre Sistemas

### 4.1 🌐 REST API

* Endpoints seguem padrão: `/api/v1/...`
* Controllers modulares por domínio

### 4.2 🔌 WebSockets *(futuro)*

* Eventos em tempo real:

  * 🧾 Pedidos
  * 💰 Caixa
  * 📅 Agenda

---

## 🛡️ 5. Segurança da Arquitetura

* 🔑 **JWT + Refresh Token**
* 🧩 **RBAC com roles e guards**
* 🛁 **Sanitização e validações**
* 🚧 **Rate limit + CORS configurado**

---

## 🗄️ 6. Banco de Dados (Prisma)

Modelo principal:

```
User -- Company -- Product -- Order -- OrderItem
                      |          └─ CashRegister
              Appointment
```

* 🟦 **Prisma ORM**
* 🧬 Migrations versionadas
* 📊 Relacionamentos claros e escaláveis

---

## 🔄 7. Fluxos Principais

### 7.1 🛒 Venda no PDV

```
Operador → Seleciona itens → Envia venda
       → API registra → Caixa atualiza
```

### 7.2 📦 Pedido do Cliente

```
Cliente → Pedido → API → Notificação PDV → Confirmação
```

### 7.3 📅 Agendamento

```
Cliente → Escolhe serviço → Seleciona data
       → API valida → PDV aprova
```

---

## ☁️ 8. Deploy e Infraestrutura

### ⚙️ Backend

* 🐳 Docker + PostgreSQL
* 🔄 CI/CD com GitHub Actions

### 🎨 Frontends

* 🖥️ Admin → Vercel / Netlify
* 📱 Cliente → Vercel (web) / Play Store / TestFlight

### 🗄️ Banco

* Railway / Render / Supabase / AWS RDS

---

## 🧭 9. Roadmap de Arquitetura

* [ ] 📡 Mensageria (Kafka / NATS)
* [ ] 🏢 Multi-tenancy completo (schema por empresa)
* [ ] 🌐 CDN para assets
* [ ] ⚡ Cache Redis

---

Se quiser, posso gerar uma **versão ilustrada**, **dark mode**, **com ícones grandes**, ou **com tabelas e diagramas avançados**.
