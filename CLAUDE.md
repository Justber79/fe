# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Need4Deed frontend — a Next.js 15 PWA for a Berlin NGO connecting volunteers with refugee accommodation centers. Deployed on AWS CloudFront. Open-source with volunteer contributors of varying experience levels.

**Domain vocabulary (required reading):**

- **Deed** — task posted by a center (e.g. "German tutoring", "translation")
- **Volunteer** — registers via public form, has skills, languages, location
- **Center (RAC)** — refugee accommodation center in Berlin
- **Match** — pairing of a volunteer to a deed (currently manual, later automated)
- **SDK** — shared TypeScript types in the sibling `sdk` repo; always import from there, never redefine

## Commands

```bash
yarn dev              # start dev server (Next.js + Turbopack)
yarn build            # production build
yarn lint             # ESLint
yarn typecheck        # tsc --noEmit
yarn dev:docker       # start local backend via Docker Compose
```

No test framework is configured.

## Local setup

```bash
# All three repos must be siblings
git clone https://github.com/need4deed-org/fe.git
git clone https://github.com/need4deed-org/sdk.git
cd fe && yarn install
yarn install ../sdk   # links local SDK for type safety
cp .env.example .env.local
yarn dev
```

After pulling SDK changes: `cd fe && yarn install ../sdk` again.

## Architecture

**Stack:** Next.js 15 App Router, React 19, TypeScript strict, Styled Components, TanStack Query v5, React Hook Form + TanStack Form, Zod, Axios, i18next (en/de).

**Routing:** All routes are under `src/app/[lang]/` — the middleware injects the language prefix automatically from the `preferred-lang` cookie. Device type (mobile/tablet/desktop) is also detected in middleware and available via `DeviceContext`.

**API layer:**

- Next.js rewrites proxy `/{apiPrefix}/*` → backend URL (configured via `API_URL` env var)
- `src/config/axios.ts` handles 401s with automatic token refresh, queues in-flight requests, redirects to login on failure
- All API paths are constants in `src/config/constants.ts`

**Data fetching pattern — use these hooks, don't call axios directly:**

```typescript
// GET with pagination/filtering
useGetQuery<T>({ apiPath, queryKey, params?, staleTime?, enabled? })

// POST/PATCH/PUT/DELETE with toast notifications + cache invalidation
useMutationQuery<TData, TResponse>({ apiPath?, method?, successMessage?, onSuccessCallback?, queryKeyToInvalidate? })
```

Both live in `src/hooks/`. Many resource-specific hooks wrap these (e.g. `useGetVolunteer`, `useUpdateOpportunityStatus`).

**State:** Server state via TanStack Query (5 min `cacheTTL`). Client state via React Context (`DeviceContext`). No global store.

**Forms:** React Hook Form for simple forms; TanStack Form for complex ones. Validate with Zod.

**Styling:** Styled Components. Follow Figma designs in each issue before styling. Do not introduce new UI libraries.

**i18n:** Translation files at `public/locales/{en,de}/translations.json`. Language falls back to `de` if not found.

## Key constraints

- **SDK types:** Import from `need4deed-sdk`. Never redefine types that exist there.
- **Data protection:** No personal data in URLs, `localStorage`/`sessionStorage` beyond minimum, or `console.log` calls.
- **Dependencies:** Check what's already installed before adding anything new.
- **PWA performance:** Target mobile + lower-bandwidth users; avoid large dependencies.
- **PRs:** Keep small (one component or feature). Do not merge your own PRs.

## Branching & commits

Branch: `yourname/feature-name` (e.g. `alex/deed-card-component`)

Commit prefixes: 🎨 style · 🐛 fix · ✨ feature · 📝 docs · ♻️ refactor · 🔥 remove
