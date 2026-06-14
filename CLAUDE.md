# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start all apps (web on :3001, server on :3000)
pnpm dev:web          # Start only Next.js web app
pnpm dev:server       # Start only Hono server
pnpm build            # Build all apps
pnpm check-types      # TypeScript type-check across all packages
pnpm check            # Run Biome lint + format (auto-fixes in place)

pnpm db:push          # Push schema changes directly to the database
pnpm db:generate      # Generate Drizzle migration files
pnpm db:migrate       # Run pending migrations
pnpm db:studio        # Open Drizzle Studio UI
```

To target a single package with turbo: `turbo -F <package-name> <task>`.

## Architecture

This is a **Turborepo + pnpm monorepo**

### Apps

| App | Tech | Port |
|-----|------|------|
| `apps/web` | Next.js 16, TailwindCSS v4, shadcn/ui | 3001 |
| `apps/server` | Hono + `@hono/node-server`, tsx watch in dev | 3000 |

### Packages

- **`packages/db`** — Drizzle ORM over Neon PostgreSQL (`@neondatabase/serverless`). `createDb()` / `db` export a drizzle instance. Schema lives in `src/schema/`. `drizzle.config.ts` reads credentials from `../../apps/server/.env`.
- **`packages/auth`** — Better Auth config. Exports `auth` (server-side). Uses the Drizzle adapter wired to `packages/db`. Auth tables are defined in `packages/db/src/schema/auth.ts`.
- **`packages/env`** — Type-safe env validation via `@t3-oss/env-core`/`@t3-oss/env-nextjs`. Two entry points: `@midas/env/server` and `@midas/env/web`. Import the right one per context — never use `process.env` directly.
- **`packages/ui`** — Shared shadcn/ui primitives. Global styles and design tokens are in `src/styles/globals.css`. Import as `@midas/ui/components/<name>`. Add new primitives with `npx shadcn@latest add <component> -c packages/ui`.
- **`packages/config`** — Shared `tsconfig.base.json` extended by all other packages.

### Request flow

```
Browser → Next.js (web, :3001)
             └─ authClient (better-auth/react) → Hono server (:3000) /api/auth/*
                                                       └─ Better Auth handler
                                                              └─ Drizzle → Neon PostgreSQL
```

### Auth pattern

- **Server**: auth routes are handled by `app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))` in `apps/server/src/index.ts`.
- **Client**: `apps/web/src/lib/auth-client.ts` creates `authClient` pointed at `NEXT_PUBLIC_SERVER_URL`. Use `authClient.signIn`, `authClient.signUp`, `authClient.useSession`, etc. in client components.
- Cookie config uses `sameSite: "none"` + `secure: true` to support cross-origin requests between the two ports.

## Environment variables

**`apps/server/.env`**
```
DATABASE_URL=
BETTER_AUTH_SECRET=   # min 32 chars
BETTER_AUTH_URL=      # e.g. http://localhost:3000
CORS_ORIGIN=          # e.g. http://localhost:3001
NODE_ENV=development
```

**`apps/web/.env`**
```
NEXT_PUBLIC_SERVER_URL=  # e.g. http://localhost:3000
```

## Commits

Nunca adicionar linhas de co-autoria do Claude (`Co-Authored-By`) nas mensagens de commit. Apenas título e descrição objetivos.

## Code style

Biome enforces the following (run `pnpm check` to auto-fix):
- **Tabs** for indentation, **double quotes** for JS/TS strings
- TailwindCSS classes sorted via `useSortedClasses` (applies to `clsx`, `cva`, `cn`)
- `noUselessElse`, `useSelfClosingElements`, `noInferrableTypes`, and other strict style rules are errors

After every implementation, always run `pnpm check` to auto-fix Biome errors and warnings before considering the task done.
