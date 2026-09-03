# Production data latency and global categories

## Goal

Restore the finance data requests in production, recreate a minimal set of global categories, and remove the avoidable latency caused by malformed proxied routes without weakening authentication or cross-origin protections.

## Findings

- The web application requests `/entries` and `/categories` through Next.js rewrites.
- The wildcard rewrites currently forward those exact paths as `/entries/` and `/categories/`.
- The production Hono application returns `404` for the trailing-slash variants. Recent logs show repeated failed requests, while the exact paths correctly reach authentication.
- Warm Hono handlers complete in roughly 1–5 ms. Cold requests observed in production took roughly 238–763 ms.
- A direct Neon check took 151 ms cold and 87 ms warm, which is reasonable for this application.
- The database currently contains no global categories.
- The Redis hostname in the local server environment does not resolve. Production secrets will not be downloaded or changed as part of this work; production behavior will be checked through application logs after deployment.

## Design

### Route forwarding

Add exact rewrite rules for `/entries` and `/categories` before their parameterized rewrite rules. Exact list and create requests must arrive at the backend without a trailing slash. Requests containing an ID must continue to preserve the remaining path.

The API will keep its existing same-origin proxy and authentication middleware. CORS, secure cookies, origin checks, and authorization rules remain unchanged.

### Global categories

The seed remains the single source of truth for global categories. It will insert only missing category names so that rerunning it is safe and does not delete or duplicate existing data.

The global set is:

1. Alimentação — `UtensilsCrossed`
2. Moradia — `Home`
3. Transporte — `Bus`
4. Saúde — `HeartPulse`
5. Educação — `BookOpen`
6. Lazer — `Gamepad2`
7. Compras — `ShoppingCart`
8. Contas e serviços — `Zap`
9. Salário — `Briefcase`
10. Investimentos — `TrendingUp`
11. Outros — `Tag`

These records have a null `userId`, making them visible to every authenticated user while remaining protected from user update and delete operations.

### Latency scope

Keep the existing parallel client requests and React Query caching. Do not add a combined Dashboard endpoint or another cache layer until measurements after the route correction show a remaining user-visible bottleneck.

The unresolved local Redis hostname will be reported separately. A production Redis change requires confirmation of the production value or production failures and is outside this minimal patch.

## Error handling and safety

- The seed must do nothing when all defaults already exist.
- If only some defaults exist, it inserts only the missing records.
- Existing global and user-owned categories are preserved.
- No credentials are logged or committed.
- The backend remains the enforcement point for authentication and category ownership.

## Verification

- Type-check the web, server, and database packages.
- Run the relevant formatter/linter checks.
- Build the web and server applications.
- Verify the rewrite configuration contains exact and parameterized routes.
- Run the seed against the configured Neon database.
- Query the final global category names and confirm the expected 11 records exist without duplicates.
- After deployment, inspect production logs for successful exact-path requests and compare cold and warm durations.

