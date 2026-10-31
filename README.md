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

See `.env.example` for the full list, including the two store URLs below.

### Download link (`/download`)

One permanent URL for the QR code: `https://<your-domain>/download`.

- Every device lands on the page `/[locale]/download`, with no redirect to a store. Visitors choose a
  store with the App Store and Google Play buttons.
- Set `NEXT_PUBLIC_APP_STORE_URL` and `NEXT_PUBLIC_PLAY_STORE_URL` (https only); a button whose URL is
  unset or invalid shows "coming soon". They are inlined at build time: pass them as Docker build args /
  Vercel env vars and redeploy to change a destination.
  The QR code never changes. The download page's own QR code already encodes `/download`.
- QR for print: `npx qrcode -o iris-download.svg -e H "https://<your-domain>/download"` (SVG for print;
  error correction H survives logos and wear). Generate it once; test by scanning on both platforms.
- Installed-app opening (Universal Links / App Links) is **not** set up: it needs the mobile apps'
  associated-domains / intent filters plus `/.well-known/apple-app-site-association` and
  `/.well-known/assetlinks.json` served from this domain. Add those once the apps ship them.

### Checks

```bash
npx tsc --noEmit
pnpm lint
pnpm test
```
