# IRIS Website — Agent Guide

Public website (`iris-web`). **Next.js 16** App Router (Turbopack), **React 19**, TypeScript, CSS
Modules, `next-international`. **Arabic-first (`ar`), RTL by default.** Started from the EHYA website
as an empty template — only the plumbing was kept. Next.js-version specifics (APIs that changed since
your training data) live in the Next-managed block of [AGENTS.md](AGENTS.md) and in
`node_modules/next/dist/docs/` — read those before using an unfamiliar Next.js API.

## Commands (pnpm only)

pnpm is pinned to **10.18.3** (`packageManager` in `package.json` + the Dockerfile) — change both
together. pnpm 12 was evaluated and deferred: its default 24h `minimumReleaseAge` rejected freshly
published lockfile entries, and a failed install removes `node_modules` links before it errors.
Runtime: Node 24 LTS locally, `node:22` in Docker.

- `pnpm dev` — dev server (Turbopack), the live check. Output goes to `.next/dev`.
- `npx tsc --noEmit` — type check. `pnpm lint` — `eslint .` (flat config, `eslint.config.mjs`;
  `next lint` no longer exists). `pnpm test` — Vitest (needs Node ≥ 20.12).
- 🚫 Don't run `pnpm build` locally — it hits memory limits.
- Only one `next dev` per checkout: a second one corrupts `.next`. If you see
  `Cannot find module './vendor-chunks/...'`, stop the server, delete `.next`, restart.

## Layout (`src/`)

- `app/[locale]/` — the single root layout (`layout.tsx`: `<html dir>`, fonts, theme script, i18n
  provider, `Header`, `Footer`), `page.tsx` (home), `sign-in/`, `loading.tsx`, `error.tsx`,
  `not-found.tsx`.
- `app/[locale]/_components/` — the landing sections (`HeroSection`, `FeaturesSection`,
  `HowItWorksSection`, `AppsSection`, `BrandBookSection`), `SectionHeader`, and the phone mockups
  (`PhoneMockup` + `MockupScreens`). All server components; shared design classes (`.btn`, `.badge`,
  `.card`, `.heading-*`, `.section`, `.animate-in`, …) live in `globals.css`.
- `app/[locale]/brand/` — the Brand & Platform Book (20 chapters, `_components/`). Its long-form copy
  lives in `brand/_content.ts` (`{ ar, en }`, read server-side by `getBrandBookContent`) instead of
  `locales/*.ts`, because the locale dictionaries also ship to the client. Keep both halves in sync.
- `app/[locale]/customer/` — the Customer App showcase: an interactive iPhone prototype (12 screens)
  plus a screens gallery. Copy in `customer/_content.ts`, same pattern as the brand book.
- `components/app-prototype/` — the reusable iPhone prototype: `PhoneDemo` (client; screens are
  server-rendered nodes that navigate via `data-goto="<screen id>"` and toggle the in-phone theme via
  `data-app-theme`), `ChipGroup` (client), and the shared `AppPrototype.module.css`. Reuse it for the
  Pro App page rather than forking it.
- `app/api/auth/refresh` — spends the session cookie for a fresh access token (the proxy redirects here).
- `app/api/clear-cache` — `POST { tag } | { tags }` with `x-cache-secret` → `revalidateTag(tag, "max")`.
- `api/<Domain>API.tsx` — server **reads** (`ProjectAPI.fetchProjects` is the example).
- `actions/` — server **writes** (`"use server"`, Zod-validated). `auth.ts` = sign-in / sign-out.
- `lib/fetch/` — `httpClient` (the only data path), `getAuthToken`, session cookie relay, `apiLogger`.
- `components/layout/` — `Header`, `Footer`, `Logo`, `LanguageSwitcher`, `ThemeToggle`.
  `components/forms/SignInForm`.
- `components/skeleton/` — `Skeleton` (shimmer block) + `SkeletonScreen` (announces loading in
  both languages). Every route has a `loading.tsx` skeleton shaped like its page (`(home)/`,
  `brand/`, `customer/`, `sign-in/`); a new page ships its own instead of a spinner. **Never put a
  `loading.tsx` directly in `app/[locale]/`**: navigation shows the loading screen of the highest
  segment that changes, so it would replace every page's own skeleton. That's why the home page
  lives in the `(home)` route group (no effect on the URL).
- `locales/` — `ar.ts`, `en.ts` + `client.ts` / `server.ts`.
- `proxy.ts` — locale routing (`next-international`) + session refresh redirect. This is Next 16's
  rename of `middleware.ts`; it always runs on the Node.js runtime.
- `styles/fonts.ts` — `ArabicFont` (Tajawal), `LatinFont` (Roboto), `MonoFont` (JetBrains Mono), all
  `next/font/google`, exposed as `--font-ar` / `--font-en` / `--font-mono`; `globals.css` picks the
  body font by `html[dir]`. The mono font has no Arabic glyphs and no adjusted fallback on purpose, so
  Arabic mono labels fall back to the system monospace face (the brand look).
- `config/brand.ts` — `BRAND_BOOK_PDF` (`public/brand/iris-brand-platform-book.pdf`, ~59 MB).
- `config/theme.ts` — theme storage key + the pre-paint init script.
- `public/brand/` — IRIS logos (`iris-logo-black.png` on light backgrounds, `-white` on dark), mascot,
  mood images, brand book PDF.
- `utils/error.ts` — `errorsMap` + `translateError(code, locale)`.
- Design source: the static IRIS site (`../iris-website`, `assets/styles.css` + the brand book) —
  tokens in `globals.css` (`--iris-*`, `--accent`, `--bg-*`, `--text-*`, `--radius-*`) mirror it.

## Spec-driven development (Spec Kit)

[.specify/memory/constitution.md](.specify/memory/constitution.md) (v2.0.0) is authoritative — where
it conflicts with this file, the constitution wins and this file gets corrected. Non-trivial work (a
new route, a new showcase page, a change spanning `api/` + `actions/` + both locales) goes through
`/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` →
`/speckit-implement`; artifacts live in `specs/<###>-<name>/`. Amend the constitution only via
`/speckit-constitution`. Project template changes go in `.specify/templates/overrides/`, never the
core templates. `/new-page` scaffolds a page/action. `.specify/feature.json` is machine-local.

## Next.js 16 / React 19 rules

- **`params` is a Promise** in pages, layouts and `generateMetadata`. Type it as
  `params: Promise<{ locale: string }>`, `await` it, and narrow with `resolveLocale()`.
- **`cookies()` / `headers()` are async** — always `await cookies()`. `relayApiSessionCookie` and
  `clearSessionCookie` are async too.
- Forms use **`useActionState`** (from `react`) + `useFormStatus`; never `useFormState`.
- `revalidateTag` takes a cache-life profile: `revalidateTag(tag, "max")`.
- Don't call `setState` synchronously inside an effect (the lint rule `react-hooks/set-state-in-effect`
  fails the lint). Derive values during render; read browser-only values with `useSyncExternalStore`.
- Navigate with `useRouter()` / `redirect()`, not `window.location`.

## Rules

- **Pages are Server Components.** `"use client"` only on the leaf that needs it. Every server
  page/layout calls `setStaticParamsLocale(locale)` and states its `revalidate`.
- **API calls only in `src/api/` and `src/actions/`**, through `httpClient`. The prefix is
  `/v1/api/...`. `httpClient` never throws — branch on `response.success`. Every GET states
  `revalidate` and a `tags` entry so it can be purged.
- **Every user-facing string exists in both `ar.ts` and `en.ts`** (or both halves of a page's
  `_content.ts`). Bilingual API fields are read `field?.[locale] ?? field?.ar ?? field?.en`. API errors
  are shown through `translateError`, never `ApiResponse.error` (English-only).
- **Auth tokens live in httpOnly cookies**; read them with `getAuthToken()`, never client-side.
- **CSS:** CSS Modules + the `:root` tokens in `app/globals.css`; logical properties
  (`margin-inline`, `inset-inline`) only, no raw hex outside `globals.css`.
- **Keyframes are module-scoped:** an `animation` in a `.module.css` file only finds `@keyframes`
  defined in that same file — define them there, not just in `globals.css`.
- **Theme:** light by default; dark is `<html data-theme="dark">`, saved in `localStorage`
  (`iris-theme`) by `components/layout/ThemeToggle` and restored before paint by `config/theme.ts`'s
  inline script. Every color is a `:root` token in `globals.css` with a `:root[data-theme="dark"]`
  override — add both values for any new token. `.theme-light-only` / `.theme-dark-only` swap
  per-theme assets (see `components/layout/Logo`).
- **Animations:** scroll reveals are pure CSS (`animation-timeline: view()` inside
  `@supports`), so unsupported browsers just show the content. Hover lifts use the `translate`
  property, not `transform`, so they still work on scroll-revealed elements. The global
  `prefers-reduced-motion` rule turns all motion off.
- `API_URL` and other secrets are server-only — never rename them to `NEXT_PUBLIC_*`.
- `next/image` for images (add a `remotePatterns` entry in `next.config.mjs` for a new host).
- Keep it simple: no abstraction or provider for a single call site; comments only for a non-obvious "why".
