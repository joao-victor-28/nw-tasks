
# 🚀 Projeto Monorepo - Gestão de Tarefas

Bem-vindo ao repositório do projeto de Gestão de Tarefas, que inclui Backend, Frontend e Infraestrutura organizados em um monorepo.

---

## 🧱 Estrutura do Projeto

- **Backend:** NestJS com TypeScript, TypeORM, PostgreSQL, autenticação JWT e controle de permissões (admin e usuário).
- **Frontend:** Next.js com React e TypeScript, consumindo as APIs do backend.
- **Infraestrutura:** Docker e Terraform para orquestração e infraestrutura.

---

## ⚙️ Funcionalidades Principais

- Cadastro e login de usuários com autenticação JWT.
- Controle de acesso com níveis de permissão (admin e usuário).
- CRUD de tarefas, onde cada usuário pode manipular suas próprias tarefas.
- Admin pode visualizar e gerenciar todas as tarefas.
- Documentação da API via **Swagger** disponível em: [`/api`](http://localhost:3000/api)

---

## 📦 Como rodar o projeto

### 1. Rodar o backend

```bash
cd apps/backend
yarn install
# Configure seu .env na raiz do monorepo (apps/backend/src/app.module.ts lê do ../../../.env) tem um exemplo .env.example
yarn typeorm
yarn migration:generate     #Gera as migrations
yarn migration:run  # Executa as migrations no banco
yarn start:dev              # Roda o backend em modo de desenvolvimento
```

---

### 2. Rodar o frontend

```bash
cd apps/frontend
yarn install
yarn dev                   # Roda o frontend em modo de desenvolvimento
```

O frontend estará disponível em [`http://localhost:3001`](http://localhost:3001).

---

## 📋 Documentação da API

O backend expõe uma documentação automática via Swagger:

- Acesse [`http://localhost:3000/api`](http://localhost:3000/api) para ver e testar todos os endpoints.

---

## 🛠 Tecnologias utilizadas

| Camada        | Tecnologias                      |
|---------------|---------------------------------|
| Backend       | NestJS, TypeScript, TypeORM, PostgreSQL, JWT, Swagger, class-validator |
| Frontend      | Next.js, React, TypeScript       |
| Infraestrutura| Docker, Docker Compose, Terraform|

---

## 🚧 Observações

- Certifique-se de que o banco PostgreSQL está rodando e as variáveis de ambiente estão configuradas corretamente.
- O backend precisa ser iniciado antes do frontend para que as chamadas API funcionem corretamente.
- O token JWT é salvo no localStorage pelo frontend para manter a sessão do usuário.
- Proteções de rota no frontend baseadas em roles (admin/usuário).

---
