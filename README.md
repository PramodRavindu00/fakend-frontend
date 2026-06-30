# Fakend Frontend

Web application for **Fakend** — a mock API platform built for software teams, especially **frontend developers** and **QA engineers**, who need realistic API responses without standing up a real backend.

Use the dashboard to manage mock projects and routes, sign in with Google or GitHub, and copy shareable mock API links. Point your app at those URLs to test success paths, error states, and edge cases with predictable JSON and status codes.

> **Project status:** Fakend is still in active development. The UI, dashboard workflows, and docs are evolving. More features will be added over time — expect placeholder pages, incomplete flows, and upcoming enhancements.

## Technologies

| Layer | Stack |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| UI library | [React](https://react.dev/) 19 |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) 4 |
| Components | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| Server state | [TanStack Query](https://tanstack.com/query) 5 |
| Client state | [Zustand](https://zustand.docs.pmnd.rs/) 5 |
| HTTP client | [Axios](https://axios-http.com/) |
| Forms / validation | React Hook Form, Zod |
| Theming | next-themes (light / dark) |
| Icons | Lucide React |
| Package manager | [pnpm](https://pnpm.io/) |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+
- **Fakend backend** running locally or deployed (`fakend-backend`)

## Default ports

| Service | Port |
| --- | --- |
| Frontend (Next.js) | `3000` |
| Backend API | `8080` (configured via `NEXT_PUBLIC_SERVER_URL`) |

## Quick start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root (see [Environment variables](#environment-variables) below).

### 3. Start the backend

Ensure the `fakend-backend` API is running (default: `http://localhost:8080`).

### 4. Run the development server

```bash
pnpm dev
```

Open **http://localhost:3000** in your browser.

## Environment variables

Create `.env.local` in the repository root. Env files are gitignored.

```env
# Backend API base URL (no trailing slash)
NEXT_PUBLIC_SERVER_URL=http://localhost:8080
```

### Variable reference

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SERVER_URL` | Yes | Base URL of the Fakend backend. Used by Axios and OAuth login links. Must be reachable from the browser. |

> **Note:** Only variables prefixed with `NEXT_PUBLIC_` are exposed to client-side code. Do not put secrets in frontend env files.

### Example for production

```env
NEXT_PUBLIC_SERVER_URL=https://api.your-fakend-domain.com
```

The backend `FRONTEND_URL` must match your deployed frontend origin for CORS and OAuth redirects to work.

## Available scripts

| Script | Command | Description |
| --- | --- | --- |
| Development | `pnpm dev` | Start Next.js dev server on port 3000 |
| Production build | `pnpm build` | Create an optimized production build |
| Production run | `pnpm start` | Serve the production build |
| Lint | `pnpm lint` | Run ESLint |

## Project structure

```
fakend-frontend/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout (theme, auth, React Query providers)
│   ├── globals.css                # Global styles and Tailwind imports
│   ├── (public)/                  # Marketing pages (no auth required)
│   │   ├── layout.tsx             # Public layout with AppBar
│   │   ├── page.tsx               # Home
│   │   ├── about/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── docs/page.tsx
│   │   └── login/page.tsx
│   ├── (authenticated)/           # Protected pages (session required)
│   │   ├── layout.tsx             # Auth gate + AppBar
│   │   ├── dashboard/page.tsx     # Main workspace (mock API management)
│   │   └── unauthorized/page.tsx  # Redirect target when not signed in
│   ├── (guest)/                   # Guest layout (shared AppBar)
│   │   └── layout.tsx
│   └── auth/
│       └── oauth/
│           └── callback/page.tsx  # OAuth return handler
├── components/
│   ├── custom/                    # App-specific components
│   │   ├── AppBar.tsx             # Navigation, OAuth sign-in buttons
│   │   └── oauth/                 # OAuth loading, error, and token views
│   ├── icons/                     # Google, GitHub brand icons
│   ├── providers/
│   │   ├── AuthProvider.tsx       # Session bootstrap on load
│   │   ├── QueryClientProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/                        # shadcn/ui primitives (button, avatar, etc.)
├── hooks/
│   └── useSessionQuery.ts         # Refresh-token session bootstrap
├── lib/
│   ├── axios/
│   │   └── axios.ts               # API client with JWT + auto-refresh
│   ├── constants/
│   │   └── constants.ts           # Auth types, nav links
│   └── utils.ts                   # cn() and shared utilities
├── services/
│   └── auth.service.ts            # /auth/me, /auth/refresh helpers
├── store/
│   └── auth.store.ts              # Zustand auth state (user, token, status)
├── components.json                # shadcn/ui configuration
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Routing and layouts

The app uses **route groups** (folders in parentheses) to share layouts without affecting URLs:

| Route group | URL examples | Access |
| --- | --- | --- |
| `(public)` | `/`, `/about`, `/pricing`, `/docs`, `/login` | Open to everyone |
| `(authenticated)` | `/dashboard` | Requires valid session |
| `auth/oauth/callback` | `/auth/oauth/callback` | OAuth return URL (handled automatically) |

### Authenticated area

The `(authenticated)/layout.tsx` client layout:

1. Bootstraps the session via refresh token (httpOnly cookie on the backend).
2. Shows a loading view while validating.
3. Redirects to `/unauthorized` if the user is not signed in.
4. Renders `AppBar` and page content when authenticated.

## Authentication

Fakend uses **OAuth** (Google and GitHub) handled by the backend, with **JWT access tokens** on the frontend and **httpOnly refresh-token cookies** for session renewal.

### Sign-in flow

1. User clicks **Sign in with Google** or **Sign in with GitHub** in `AppBar`.
2. Browser navigates to `{NEXT_PUBLIC_SERVER_URL}/auth/oauth/google` or `/auth/oauth/github`.
3. After provider approval, the backend redirects to `/auth/oauth/callback?token=<accessToken>`.
4. `OAuthHandlerView` stores the token, fetches `/auth/me`, and redirects to the dashboard.

### Session persistence

- On app load, `AuthProvider` calls `/auth/refresh` (unless on the OAuth callback page).
- Axios attaches `Authorization: Bearer <accessToken>` to protected requests.
- On `401`, the Axios interceptor retries once after refreshing the token.

Relevant files:

- `lib/axios/axios.ts` — HTTP client and token refresh
- `store/auth.store.ts` — in-memory auth state
- `services/auth.service.ts` — auth API calls
- `hooks/useSessionQuery.ts` — React Query wrapper for session bootstrap

## API integration

All backend calls go through the shared Axios instance:

```typescript
import api from "@/lib/axios/axios";

// Protected request (JWT attached automatically)
const { data } = await api.post("/auth/me");

// Public request (skip Authorization header)
const { data } = await api.post("/auth/refresh", {}, { public: true });
```

Base URL: `process.env.NEXT_PUBLIC_SERVER_URL`  
Credentials: `withCredentials: true` (required for refresh-token cookies)

## UI and theming

- **Tailwind CSS 4** with PostCSS (`postcss.config.mjs`).
- **shadcn/ui** components live under `components/ui/`.
- **Dark / light mode** via `next-themes` in `ThemeProvider`.

Add new shadcn components with the CLI (if configured) or copy patterns from existing `components/ui/` files.

## Key pages (current)

| Page | Path | Status |
| --- | --- | --- |
| Home | `/` | Marketing landing |
| About | `/about` | Product information |
| Pricing | `/pricing` | Pricing information |
| Docs | `/docs` | Usage documentation |
| Login | `/login` | Sign-in entry |
| Dashboard | `/dashboard` | Mock API workspace (authenticated) |
| Unauthorized | `/unauthorized` | Shown when auth is required but missing |

Dashboard and docs content are actively being built out to support creating projects, routes, and shareable mock links.

## Production build

```bash
pnpm build
pnpm start
```

Deploy to any platform that supports Next.js (e.g. Vercel). Set `NEXT_PUBLIC_SERVER_URL` to your production API URL at build time.

## Local development checklist

1. PostgreSQL and backend `.env` configured (see `fakend-backend` README).
2. Backend running: `pnpm dev` in `fakend-backend` → `http://localhost:8080`.
3. Frontend `.env.local` with `NEXT_PUBLIC_SERVER_URL=http://localhost:8080`.
4. Frontend running: `pnpm dev` in `fakend-frontend` → `http://localhost:3000`.
5. OAuth apps registered with callback URLs pointing to `http://localhost:8080/auth/oauth/.../callback`.

## Related repository

- **Backend**: `fakend-backend` — NestJS API, database, OAuth, and mock response storage.

## License

Private project.
