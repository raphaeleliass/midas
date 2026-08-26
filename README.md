<h1 align="center">
  <br />
  Midas
  <br />
</h1>

<p align="center">
  Organize suas finanças com clareza e controle total sobre o seu dinheiro.
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" />
  <img alt="Hono" src="https://img.shields.io/badge/Hono-E36002?style=flat-square&logo=hono&logoColor=white" />
  <img alt="Drizzle ORM" src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img alt="Turborepo" src="https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white" />
</p>

---

## Sobre o projeto

**Midas** é um organizador de finanças pessoais que oferece uma visão clara e centralizada da sua vida financeira. Com autenticação segura, dashboard interativo e uma arquitetura moderna, o projeto foi construído com foco em escalabilidade e experiência do desenvolvedor.

O nome é uma referência ao Rei Midas da mitologia grega — aquele que transformava tudo em ouro.

## Stack

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 16, TailwindCSS v4, shadcn/ui |
| **Backend** | Hono (Node.js) |
| **Banco de dados** | PostgreSQL via Neon (serverless) |
| **ORM** | Drizzle ORM |
| **Autenticação** | Better Auth |
| **Monorepo** | Turborepo + pnpm |
| **Qualidade de código** | Biome (lint + format) |

## Estrutura do projeto

```
midas/
├── apps/
│   ├── web/          # Frontend — Next.js (porta 3001)
│   └── server/       # Backend API — Hono (porta 3000)
│
└── packages/
    ├── ui/           # Componentes shadcn/ui compartilhados
    ├── auth/         # Configuração do Better Auth
    ├── db/           # Schema Drizzle + cliente do banco
    ├── env/          # Variáveis de ambiente tipadas (t3-env)
    └── config/       # tsconfig base compartilhado
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- Banco de dados PostgreSQL (recomendado: [Neon](https://neon.tech))

## Primeiros passos

**1. Clone e instale as dependências**

```bash
git clone https://github.com/raphaeleliass/midas.git
cd midas
pnpm install
```

**2. Configure as variáveis de ambiente**

Crie `apps/server/.env`:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=    # string aleatória com pelo menos 32 caracteres
BETTER_AUTH_URL=       # http://localhost:3000
CORS_ORIGIN=           # http://localhost:3001
NODE_ENV=development
NGROK_AUTHTOKEN=       # token da sua conta ngrok (necessário apenas para pnpm dev:remote)
```

Crie `apps/web/.env`:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

**3. Inicialize o banco de dados**

```bash
pnpm db:push
```

**4. Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

Acesse [http://localhost:3001](http://localhost:3001) no navegador.

### Testar pelo celular com ngrok

Instale o [ngrok CLI](https://ngrok.com/download/linux) e preencha `NGROK_AUTHTOKEN` em `apps/server/.env`. Em seguida, execute:

```bash
pnpm dev:remote
```

O comando inicia um túnel HTTPS temporário, configura a web e a API com a URL gerada e a mostra no terminal. Abra essa URL no celular. Em contas gratuitas, a URL muda a cada execução e a primeira visita pode mostrar o aviso padrão do ngrok.

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia todos os apps em modo de desenvolvimento |
| `pnpm dev:remote` | Inicia o ambiente com um link HTTPS temporário do ngrok |
| `pnpm dev:web` | Inicia apenas o frontend |
| `pnpm dev:server` | Inicia apenas o backend |
| `pnpm build` | Build de produção de todos os apps |
| `pnpm check-types` | Verifica tipos TypeScript em todo o monorepo |
| `pnpm check` | Roda Biome (lint + format) com auto-fix |
| `pnpm db:push` | Aplica o schema ao banco sem gerar migrations |
| `pnpm db:generate` | Gera arquivos de migration |
| `pnpm db:migrate` | Executa as migrations pendentes |
| `pnpm db:studio` | Abre o Drizzle Studio para explorar o banco |

## Arquitetura

```
Browser
  └─ Next.js (web :3001)
       └─ authClient (Better Auth)  ──►  Hono API (:3000)
                                              └─ Better Auth handler
                                                    └─ Drizzle ORM
                                                          └─ Neon PostgreSQL
```

A autenticação usa cookies seguros em HTTPS. No acesso remoto, o Next.js encaminha as rotas da API para o Hono, mantendo navegador e autenticação na mesma origem.

## UI compartilhada

Os componentes shadcn/ui ficam em `packages/ui` e são importados pelos apps:

```tsx
import { Button } from "@midas/ui/components/button";
```

Para adicionar novos primitivos ao pacote compartilhado:

```bash
npx shadcn@latest add <component> -c packages/ui
```

---

<p align="center">
  Feito com TypeScript e ☕
</p>
