# IRIS Website

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · CSS Modules · `next-international` (Arabic-first, RTL).

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 — it redirects to `/ar` (use `/en` for English).

### Environment

Create `.env` with at least:

```
API_URL=http://localhost:5000          # backend origin (server-only)
NEXT_PUBLIC_URL=http://localhost:3000  # this site's public URL
CACHE_REVALIDATE_SECRET=               # shared secret for POST /api/clear-cache
```

### Checks

```bash
npx tsc --noEmit
pnpm lint
pnpm test
```
