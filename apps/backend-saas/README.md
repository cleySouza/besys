# ⚙️ Backend — beSyS

## ▶️ Rodando o Backend

```bash
cd apps/backend
npm run start:dev
```

## 📦 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/besys
JWT_SECRET=secret
```

## 🗄️ Banco de Dados

```bash
npx prisma migrate dev
npx prisma studio
```

## 🔗 Base URL

```
http://localhost:3000/api/v1
```
