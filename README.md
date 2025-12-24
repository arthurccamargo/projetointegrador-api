# HelpHub - Backend API

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**API REST enterprise servindo 2 aplicações frontend com RBAC completo**

[Frontend HelpHub](https://github.com/arthurccamargo/projetointegrador-frontend) • [Frontend Admin](https://github.com/arthurccamargo/projetointegrador-admin-app)

</div>

---

## Sobre

Backend centralizado do **HelpHub**, API REST que conecta voluntários e ONGs durante crises humanitárias. Desenvolvida em **NestJS + TypeScript + PostgreSQL**, serve 2 frontends distintos com sistema completo de autenticação e moderação.

## ⚡ Destaques Técnicos

### Roles
```typescript
VOLUNTEER → Candidata-se, faz check-in, avalia
ONG       → Cria eventos, aprova candidatos (após aprovação admin)
ADMIN     → Aprova/bloqueia usuários, modera plataforma
```
**ONGs cadastradas ficam `PENDING` até aprovação do admin via painel exclusivo.**

### ✓ Sistema de Check-in Anti-Fraude
```typescript
1. Evento inicia → Backend gera código único (6 dígitos)
2. ONG compartilha código presencialmente
3. Voluntário faz check-in → Timestamp registrado
4. Apenas quem fez check-in pode avaliar (48h de prazo)
```
**Garantia que avaliações sejam apenas de participações reais.**

### 🔄 Transações Atômicas
```typescript
// Garante consistência de dados
await prisma.$transaction([
  createApplication(),      // Cria candidatura
  incrementEventCounter()   // Atualiza vagas
]);
```

---
## 🛠️ Stack

| Tecnologia | Uso |
|-----------|-----|
| **NestJS** | Framework enterprise Node.js |
| **TypeScript** | 100% type-safe |
| **PostgreSQL** | Banco relacional |
| **Prisma ORM** | Type-safe queries + migrations |
| **JWT + Passport** | Autenticação stateless |
| **Bcrypt** | Hash de senhas |
| **Class-validator** | Validação de DTOs |
| **Swagger/OpenAPI** | Documentação automática |

---

<div align="center">

**Desenvolvido como Projeto Integrador - UFRGS (2025/2)**

</div>
