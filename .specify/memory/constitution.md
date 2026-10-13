<!--
Sync Impact Report
==================
Version change: 1.0.0 → 2.0.0
Bump rationale: MAJOR. The project was renamed (EHYA Website → IRIS Website), the stack changed
(Next 14.2 / React 18 → Next 16 / React 19, middleware.ts → proxy.ts), and Principle V's central
rule was reversed (EHYA's "border-radius 0 or 50% only" → IRIS's rounded radius tokens). Several
platform constraints were removed outright (three deploy modes, chatbot/Axios, Zustand, rent URLs).

Modified principles:
  - I. Server-First Rendering — rewritten for Next.js 16 / React 19 (async params, cookies and
    headers; useActionState; no synchronous setState in effects; router navigation; proxy.ts).
    The EHYA "three house rendering patterns" rule is replaced by "state revalidate explicitly".
  - II. Arabic-First Bilingual Parity (NON-NEGOTIABLE) — default locale is `ar` (was `ar-SA`);
    adds the server-only `_content.ts` pattern for long-form page copy.
  - III. One Data Path, Explicit Cache Intent — EHYA-API references removed; cache purge now
    `revalidateTag(tag, "max")`; auth/session rules moved here from the old constraints section.
  - IV. Simplicity and Single Sourcing — EHYA reuse inventory (galleries, phone inputs, search
    order through deleted folders) replaced with the IRIS shared pieces.
  - V. Design-System Fidelity — REDEFINED: rounded corners are the IRIS design language; the
    radius tokens are mandatory; light/dark token pairs; CSS-only, reduced-motion-safe animation;
    `next/font/google` (was `next/font/local`); DESIGN-TOKENS.md reference removed.

Added sections: none (same five principles and three sections, rewritten in place).
Removed content:
  - "Deploy modes" (ehya.sa / marketing / SAJ), rent URL rules, chatbot API, Zustand, Axios.
  - References to deleted files: PERFORMANCE.md, docs/payments/DESIGN-TOKENS.md,
    src/styles/theme.ts, TablerIconsMap.ts, Countries.tsx, MainLayout / AltLayout, utils/image.ts.
  - "Known drift" grandfathering (the EHYA drift no longer exists in this codebase).
  - isomorphic-dompurify requirement (the package is not installed).

Templates requiring updates:
  ⚠ .specify/templates/overrides/plan-template.md — still the ehya-web override (EHYA-API,
    three deploy modes, ar-SA, "border-radius 0 or 50%", middleware.ts, PERFORMANCE.md).
  ⚠ .specify/templates/overrides/tasks-template.md — still the ehya-web override
    (useFormState, "border-radius 0 or 50%").
  ✅ .specify/templates/plan-template.md, spec-template.md, tasks-template.md,
    checklist-template.md (core) — generic, no conflict.
  ⚠ .claude/skills/new-page/SKILL.md — EHYA-specific scaffolding guidance (not a Spec Kit
    template, but it contradicts this constitution).
  ✅ CLAUDE.md — already describes the IRIS rules this constitution codifies.

Deferred TODOs:
  - RATIFICATION_DATE: v1.0.0 recorded it as TODO. 2026-08-21 (the date v1.0.0 was first
    adopted) is used as the original ratification date; correct it if the team knows otherwise.
-->

# IRIS Website Constitution

## Core Principles

### I. Server-First Rendering

Rendering work MUST default to the server; the client bundle is a budget, not a side effect.

- A `page.tsx` and a `layout.tsx` MUST be Server Components. Interactivity lives in the deepest
  leaf that needs it, and server data is passed down as props or as server-rendered nodes (the
  `PhoneDemo` pattern).
- `"use client"` MUST sit on the deepest component that needs it; every new client boundary MUST
  be justified in the PR.
- Every server page and layout MUST call `setStaticParamsLocale(locale)` and MUST state its
  rendering intent explicitly (`revalidate`, or `dynamic` where per-user data requires it).
- Next.js 16 / React 19 APIs are mandatory:
  - `params` is a Promise in pages, layouts and `generateMetadata`; it MUST be typed
    `Promise<{ locale: string }>`, awaited, and narrowed with `resolveLocale()`.
  - `cookies()` and `headers()` MUST be awaited.
  - Forms MUST use `useActionState` (from `react`) with `useFormStatus`; `useFormState` and an
    `onSubmit` + client-side fetch are forbidden.
  - `setState` MUST NOT be called synchronously inside an effect. Values are derived during
    render; browser-only values are read with `useSyncExternalStore`.
  - Navigation MUST use `useRouter()` / `redirect()`; `window.location` is forbidden for internal
    routes.
- Request interception lives in `proxy.ts` (the Next.js 16 rename of `middleware.ts`), which runs
  on the Node.js runtime. A new `middleware.ts` MUST NOT be added.
- Route handlers are a last resort: a server action (writes) or server-rendered props (reads) is
  required unless a client component genuinely cannot be served either way. A new handler MUST
  gate itself and state its caching.

Rationale: the site targets mobile visitors in Saudi Arabia, and `pnpm build` cannot run locally,
so no tool here measures a bundle regression — the client boundary has to be held by rule.

### II. Arabic-First Bilingual Parity (NON-NEGOTIABLE)

Arabic (`ar`) is the default locale and RTL is a document-level fact set by the root layout, never
a page opt-in.

- Every user-facing string MUST exist in **both** languages — including `placeholder`, `label`,
  `title`, `aria-label`, `alt`, toast copy, empty states, metadata and validation messages:
  - UI chrome lives in `locales/ar.ts` and `locales/en.ts`.
  - Long-form page copy (brand book, app showcases) lives in the page's server-only `_content.ts`
    as `{ ar, en }` with one shared type, so it never enters the client dictionary. Both halves
    MUST change together.
- The locale files are shared state: append near the feature's block; re-sorting or reformatting
  them is forbidden.
- Bilingual server fields MUST be read `field?.[locale] ?? field?.ar ?? field?.en`. Server data
  MUST NOT be pushed through `t()`.
- API errors MUST surface through `translateError(code, locale)`; rendering `ApiResponse.error` is
  forbidden (it is English-only).
- CSS MUST use logical properties (`margin-inline`, `inset-inline`, `padding-block`); physical
  `left`/`right` layout is forbidden. Codes, numbers and URLs embedded in Arabic text MUST be
  isolated (`dir="ltr"`) where bidi reordering would corrupt them.

Rationale: no lint rule enforces parity, and a missing Arabic string or a mirrored layout bug is a
defect visible to the default audience.

### III. One Data Path, Explicit Cache Intent

There is exactly one server data path, and every read declares how long it may be stale.

- Reads MUST go through `src/api/<Domain>API` → `httpClient`; writes MUST go through
  `src/actions/<domain>.ts` (`"use server"`). An API call inside a component is forbidden, and a
  second HTTP client MUST NOT be added.
- Requests MUST match the backend contract exactly; the prefix is `/v1/api/...`.
- `httpClient` never throws; callers MUST branch on `response.success`. Empty `catch {}` blocks are
  forbidden. Mutations MUST NOT retry without an `idempotencyKey`.
- Every GET MUST state `revalidate`, and every cacheable read MUST carry a purgeable `tags` entry.
  Per-user reads MUST pass `requiresAuth: true` **and** `revalidate: 0`.
- Cache purges go through `POST /api/clear-cache` (shared-secret `x-cache-secret`), which calls
  `revalidateTag(tag, "max")`. A cache with no invalidation path is a bug.
- Server actions MUST validate every input with Zod (custom message written `{ error: "code" }`)
  and return error codes, never raw messages.
- Auth tokens live only in httpOnly cookies and MUST be read through `getAuthToken()` /
  `getRefreshToken()`; reading a token in a client component is forbidden.
- `NEXT_PUBLIC_*` is public; secrets (`API_URL`, `CACHE_REVALIDATE_SECRET`, Redis credentials)
  MUST NEVER be renamed into it.

Rationale: a drifted prefix fails silently with 404s, an untagged cacheable read is stale for its
whole window, and a retried write can double-book.

### IV. Simplicity and Single Sourcing

The simplest thing that fully solves the stated problem wins.

- YAGNI and KISS are binding: no `variant`/`mode` prop with one caller, no options object or
  context provider for a single call site, no wrapper around a `next/*` primitive.
- Shared pieces MUST be reused, not forked: `components/app-prototype` (`PhoneDemo`, `ChipGroup`)
  for any app showcase, `components/layout` (`Header`, `Footer`, `Logo`, `ThemeToggle`,
  `LanguageSwitcher`), `SectionHeader`, `PhoneMockup`, `translateError`, `httpClient`. If one
  almost fits, add a prop.
- Duplication beats the wrong abstraction: extract on the third occurrence, once what varies is
  visible.
- Features MUST stay deletable: a route folder plus its `api/` functions, its `_content.ts` and
  its locale keys.
- Comments are for a non-obvious *why* only, one or two lines. Comments restating the code or the
  task are forbidden. Dead code is deleted, not commented out.

Rationale: near-duplicates are the main source of drift and of the same bug being fixed twice.

### V. Design-System Fidelity

Presentation comes from the IRIS brand and one token set.

- Styling MUST be CSS Modules reading the `:root` custom properties in `app/globals.css`. A JS
  palette or a raw hex in a module is forbidden; the only exception is brand-specimen data that
  is itself the subject (e.g. the brand book's colour swatches). There is no Tailwind.
- The palette is the IRIS identity: Royal Lavender `--iris-violet` (#6A4FB6), Deep Purple, Soft
  Lavender and cool neutrals, exposed as semantic tokens (`--accent`, `--bg-*`, `--text-*`,
  `--border*`).
- Rounded corners ARE the IRIS design language: corners MUST use the radius tokens
  (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`) or `50%` for true circles.
- Theming is mandatory: light is the default, dark is `:root[data-theme="dark"]`. Every new colour
  token MUST define both values, and per-theme assets MUST use `.theme-light-only` /
  `.theme-dark-only` (as `Logo` does).
- Typography comes from `next/font/google` — Tajawal (Arabic), Roboto (Latin), JetBrains Mono —
  via `styles/fonts.ts`; a webfont `<link>` is forbidden.
- Images MUST use `next/image` (no raw `<img>`); `sizes` on every responsive image; `priority`
  only above the fold.
- Icons MUST come from `@tabler/icons-react`; no second icon library.
- Motion MUST be CSS-first and safe: scroll reveals use `animation-timeline: view()` inside
  `@supports` so unsupported browsers simply show the content; `@keyframes` are defined in the
  same CSS module that uses them; hover lifts use `translate`, not `transform`; the global
  `prefers-reduced-motion` rule MUST keep disabling all motion.
- Loading, empty and error states are part of the change, not a follow-up.

Rationale: the brand is the product's first impression; a single token set is what keeps light,
dark, RTL and LTR consistent without per-page fixes.

## Platform, Security & Cost Constraints

**Toolchain.** pnpm only (`only-allow pnpm`). pnpm is pinned to **10.18.3** through
`packageManager` in `package.json` and the Dockerfile; the two MUST change together. Runtime is
Node 24 LTS locally and `node:22` in Docker. The stack is Next.js 16 App Router (Turbopack),
React 19, TypeScript `strict`, CSS Modules + PostCSS preset-env, `next-international`, Zod 4 and
Vitest.

**Build.** `pnpm build` MUST NOT be run locally — it exceeds this environment's memory. Production
is a `standalone` output in a Docker image; the environment contract is `API_URL` (server-only)
and `NEXT_PUBLIC_URL`, plus `CACHE_REVALIDATE_SECRET` and the optional Redis settings read by
`cache-handler.js`.

**Injection.** `dangerouslySetInnerHTML` is limited to fixed, non-user strings (the pre-paint
theme script). No sanitizer is installed, so user- or API-supplied HTML MUST NOT be injected;
markdown, if ever needed, is rendered as React elements.

**External routes.** `proxy.ts`'s matcher excludes `/api`, so any externally callable route
handler MUST authenticate itself; the shared-secret check on `/api/clear-cache` is the model.

**Cost.** Every list read MUST pass an explicit bound; a fetch inside a loop or a request per row
is forbidden. Large static assets MUST be justified (the ~59 MB brand book PDF is served as a
download, never embedded). The server dictionary (`getI18n`) is preferred over the client one.

## Development Workflow & Quality Gates

**Specs.** Non-trivial work — a new route, a new showcase page, a change spanning `api/`,
`actions/` and both locales — goes through Spec Kit: `/speckit-specify` → `/speckit-clarify` →
`/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`. Artifacts live in
`specs/<###>-<short-name>/` and are committed with the feature. The plan's Constitution Check is a
gate: a violation needs a Complexity Tracking entry and agreement recorded before code is written.
`.specify/feature.json` is machine-local and MUST NOT be committed. Git branches stay
ticket-named; spec numbers are not branch names.

**Branching.** Work happens on a branch and merges through a PR. Committing directly to `master`,
and amending, rebasing or force-pushing pushed work, are forbidden. Commits are made only when
asked.

**Scope discipline.** The diff MUST contain only the requested change — no drive-by refactors,
renames or reformatting. Unrelated problems are reported, not silently fixed.

**Shared-file care.** Before editing `lib/fetch/httpClient.ts`, `proxy.ts`, the locale files, the
`:root` tokens in `app/globals.css`, `components/layout/*`, `components/app-prototype/*` or
`next.config.mjs`, the author MUST check every call site; additive changes are preferred over
signature changes.

**Gates.** Before merge: `npx tsc --noEmit`, `pnpm lint` (`eslint .`, flat config) and
`pnpm test` MUST pass; `pnpm dev` is the live check, in both `ar` (RTL) and `en`, light and dark.

**Documentation truth.** When a comment, CLAUDE.md or AGENTS.md contradicts the code, the code wins
and the mismatch MUST be flagged.

## Governance

This constitution supersedes all other development practices for `iris-web`. CLAUDE.md is the
runtime guidance file and elaborates these principles with current paths; AGENTS.md carries the
Next.js-managed version notes. Where CLAUDE.md conflicts with this constitution, the constitution
wins and CLAUDE.md MUST be corrected in the same PR.

**Amendment procedure.** Amendments are made only through `/speckit-constitution`, in a PR that
carries the updated Sync Impact Report and states the version bump and its rationale, approved by
at least one contributor other than the author. A MAJOR amendment MUST name the affected areas and
how existing code is brought into compliance.

**Versioning policy.** Semantic versioning applies:

- **MAJOR** — a principle is removed or redefined incompatibly, or governance changes
  incompatibly.
- **MINOR** — a principle or section is added, or guidance is materially expanded.
- **PATCH** — clarifications, wording and typo fixes.

**Compliance review.** Every PR review MUST verify compliance; a violating diff is rejected unless
the deviation was agreed and recorded beforehand. Complexity MUST be justified in the PR.
`/speckit-plan`, `/speckit-tasks`, `/speckit-analyze` and `/speckit-implement` read this file at
runtime, and a plan that conflicts with it MUST be revised rather than approved as an exception.

**Version**: 2.0.0 | **Ratified**: 2026-08-21 | **Last Amended**: 2026-10-13
