# AGENTS.md

## Stack

- Vue 3 (Composition API, `<script setup lang="ts">`)
- TypeScript, Vite, Tailwind CSS, PostCSS
- PrimeVue 4 (Aura theme), PrimeIcons
- Pinia (state), Vue Router 4, TanStack Vue Query (server state)
- Axios (HTTP), vue3-google-login (OAuth)
- Node >=20.19.0 or >=22.12.0

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + build (parallel via `npm-run-all2`) |
| `npm run type-check` | `vue-tsc --build` |
| `npm run build-only` | `vite build` |
| `npm run preview` | Vite preview |

No tests, no linter, no formatter, no CI (no `.github/workflows`).

## Architecture

- **Entrypoint**: `src/main.ts` — registers PrimeVue, Pinia, Router, TanStack Vue Query, vue3-google-login, ToastService, ConfirmationService
- **Router**: `src/router/index.ts` — `createWebHistory`, auth guard checks `localStorage.getItem("token")`, public pages use `meta: { hideSidebar: true }`
- **API**: `src/services/api.ts` — Axios instance, `withCredentials: true`, auto-attaches `Bearer` token from localStorage, 401 interceptor with refresh-token queue
- **Auth**: JWT in localStorage keys: `token`, `username`, `user`; refresh via `POST /auth/refresh-token`
- **Themes**: Tailwind's `indigo` palette mapped to green (school chalkboard), custom `school` palette for slates; PrimeVue dark mode via `.my-app-dark` class
- **Fonts**: Inter (sans), Outfit (display), Lora (serif) — loaded via Google Fonts in `src/assets/main.css`
- **Icons**: PrimeIcons (`pi-*` class names)
- **Path alias**: `@` → `./src`

## Env

```
VITE_BACKEND_URL=https://lmdi.onrender.com/api
VITE_GOOGLE_CLIENT_ID=...
```

Dev API: `http://localhost:3000/api` (hardcoded in `api.ts`). Prod API: `VITE_BACKEND_URL` env var.

## Project structure

```
src/
  main.ts                    # App bootstrap
  App.vue                    # Root layout: sidebar + router-view
  assets/main.css            # Tailwind directives + font imports
  router/index.ts            # Route definitions + auth guard
  services/
    api.ts                   # Axios instance (base, interceptors, refresh)
    examService.ts           # CRUD /exams
    submissionService.ts     # CRUD /submissions
    turmas.ts                # CRUD /classes
  composables/               # TanStack Vue Query wrappers
    useExams.ts              # Exams + submissions with auto-polling (3s when pending)
    useGabaritos.ts          # Dependent query: templates after turmas loaded
  types/                     # Exam.ts, Submission.ts, Turma.ts
  components/
    TheAside.vue             # Responsive sidebar + mobile drawer
    Classes/                 # Per-feature components
    Exams/
    Submissions/
  views/
    auth/                    # Login, Cadastro, SendEmailReset, ResetPassword
    Home.vue                 # Dashboard
    TurmasDashboard.vue      # /classes
    Turma.vue                # /classes/:id
    Gabaritos.vue            # /templates
    Submissoes.vue           # /submissions
    utils/                   # Duvidas (FAQ), NotFound
```

## Key conventions

- **Language**: pt-BR (UI text, routes, variable naming in Portuguese)
- **API endpoints**: plural kebab-case (`/exams/`, `/submissions/`, `/classes/`)
- **TanStack Query keys**: `["provas", classId]`, `["submissoes", examId]`, `["turmas"]`, `["todos-gabaritos", ...]`
- **Submission files**: renamed to `{nome}.{ext}` before upload via `FormData`
- **Composables** wrap TanStack Query + service layer; views are thin

## Vercel deployment

Live at `https://letmedoit-olive.vercel.app`. No vercel config in repo (uses defaults).
