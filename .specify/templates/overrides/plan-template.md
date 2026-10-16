# Implementation Plan: [FEATURE]

**Branch**: `[ticket-or-feature-branch]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the
execution workflow. This is the `iris-web` project override — it replaces the core plan template
with this repo's real stack and gates. Constitution: `.specify/memory/constitution.md`.

## Summary

[Extract from feature spec: primary requirement + technical approach]

## Technical Context

<!--
  Pre-filled from the repo. Only edit a line if THIS feature genuinely changes it; do not
  re-derive the stack per feature, and do not write NEEDS CLARIFICATION for anything below
  that is already stated.
-->

**Language/Version**: TypeScript (`strict`), React 19, Next.js 16 App Router (Turbopack)

**Primary Dependencies**: `next-international`, Zod 4, CSS Modules + PostCSS preset-env,
`@tabler/icons-react`, `clsx`. **No Tailwind**, no client state library.

**Storage**: None local. State of record lives in the backend API, reached at `/v1/api/...`
through `httpClient` (`API_URL`). Auth lives in httpOnly cookies (`access_token`, the relayed
session cookie, `user`).

**Testing**: Vitest. `npx tsc --noEmit`, `pnpm lint` and `pnpm test` are the pre-merge gates;
`pnpm build` MUST NOT be run locally (memory limits).

**Target Platform**: Web, mobile-first, Saudi market. One site, Docker `standalone` image.

**Project Type**: Next.js App Router web app (server-first; single `src/` tree).

**Performance Goals**: First paint on mobile. Bundle size cannot be measured locally — cost is
argued in the PR.

**Constraints**: Arabic-first (`ar`), RTL by default; light and dark themes. Every user-facing
string in **both** languages. Rounded corners via the radius tokens. Server Components unless
interactivity forces otherwise.

**Scale/Scope**: [routes touched, locale keys / `_content.ts` entries added, API endpoints consumed]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Each gate below is a MUST from `.specify/memory/constitution.md` v2.0.0. Mark `PASS`, `N/A` (with
one line of why), or `VIOLATION` (then fill Complexity Tracking — an unjustified violation blocks
the plan).

### I. Server-First Rendering

- [ ] Every new `page.tsx` / `layout.tsx` is a Server Component; interactivity is isolated in the
      deepest leaf, data passed as props or server-rendered nodes.
- [ ] Every new `"use client"` is named here with the reason it cannot sit deeper.
- [ ] Every new server page/layout calls `setStaticParamsLocale(locale)` and states `revalidate`
      (or `dynamic` for per-user data).
- [ ] `params` is typed `Promise<{ locale: string }>`, awaited and narrowed with
      `resolveLocale()`; `cookies()` / `headers()` are awaited.
- [ ] Forms use `useActionState` + `useFormStatus`; no `setState` called synchronously in an
      effect; navigation via `useRouter()` / `redirect()`.
- [ ] No new route handler, or the plan says why a server action and server-rendered props both
      fail, and how the handler authenticates itself.

### II. Arabic-First Bilingual Parity (NON-NEGOTIABLE)

- [ ] Every new user-facing string is listed for **both** languages — UI chrome in
      `locales/ar.ts` + `locales/en.ts`, long-form copy in the page's `_content.ts` `{ ar, en }`
      (including `placeholder`, `aria-label`, `alt`, metadata, validation messages).
- [ ] Locale-file edits are append-only near the feature's block — no re-sort, no reformat.
- [ ] Bilingual server fields are read `field?.[locale] ?? field?.ar ?? field?.en`.
- [ ] API errors surface via `translateError(code, locale)`; `ApiResponse.error` is never rendered.
- [ ] CSS uses logical properties only; codes/numbers in Arabic text are bidi-isolated; RTL and
      LTR are both verified.

### III. One Data Path, Explicit Cache Intent

- [ ] Reads go `src/api/<Domain>API` → `httpClient`; writes go `src/actions/<domain>.ts`. No API
      call in a component, no new HTTP client.
- [ ] Every endpoint matches the backend contract — route, method, payload — with `/v1/api/...`.
- [ ] Every GET states `revalidate`; every cacheable read names a `tags` entry **and** who purges
      it via `/api/clear-cache` (`revalidateTag(tag, "max")`).
- [ ] Per-user reads pass `requiresAuth: true` **and** `revalidate: 0`.
- [ ] No mutation retries without an `idempotencyKey`; callers branch on `response.success`.
- [ ] Server actions Zod-validate input and return error codes.
- [ ] Tokens only via `getAuthToken()`; no secret in a `NEXT_PUBLIC_*` name.

### IV. Simplicity and Single Sourcing

- [ ] Shared pieces were checked first — `components/app-prototype`, `components/layout`,
      `SectionHeader`, `PhoneMockup`, `lib/fetch`, `utils/error` — and reuse is recorded here.
- [ ] No abstraction, wrapper, provider or flag exists for a single call site.
- [ ] The feature is deletable: route folder + `api/` functions + `_content.ts` + locale keys.

### V. Design-System Fidelity

- [ ] CSS Modules reading `:root` tokens; no raw hex (except brand-specimen data), no JS palette.
- [ ] Corners use `--radius-sm/md/lg/full` (or `50%` for circles).
- [ ] Every new colour token defines its `:root[data-theme="dark"]` value; per-theme assets use
      `.theme-light-only` / `.theme-dark-only`.
- [ ] Images use `next/image` with `sizes`; icons from `@tabler/icons-react`.
- [ ] Motion: scroll reveals inside `@supports (animation-timeline: view())`, keyframes in the
      same module, hover lifts via `translate`, nothing bypasses `prefers-reduced-motion`.
- [ ] Loading, empty and error states are in scope.

### Platform, Security & Cost

- [ ] No `dangerouslySetInnerHTML` for user- or API-supplied content.
- [ ] Every list read is bounded; no request per row.
- [ ] Shared files (`httpClient`, `proxy.ts`, locale files, `:root` tokens, `components/layout`,
      `components/app-prototype`, `next.config.mjs`) are untouched or their call sites are
      checked and stated.
- [ ] pnpm stays pinned to the version in `packageManager` and the Dockerfile.

**Gate result (Phase 0)**: [PASS / VIOLATIONS — see Complexity Tracking]

**Gate result (post-Phase 1 re-check)**: [PASS / VIOLATIONS]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: replace the bracketed names below with the real paths this feature touches.
  Delete every line the feature does not touch.
-->

```text
src/
├── app/[locale]/[route]/
│   ├── page.tsx                  # Server Component; await params, setStaticParamsLocale, revalidate
│   ├── _content.ts               # long-form copy { ar, en } (server-only), if any
│   └── _components/
│       ├── [Feature].tsx          # server components
│       ├── [Feature]Client.tsx    # the only "use client" leaf, if any
│       └── [Feature].module.css   # tokens, logical properties, radius tokens, local keyframes
├── api/[Domain]API.tsx           # server reads → httpClient, explicit revalidate + tag
├── actions/[domain].ts           # "use server" writes, Zod, error codes
├── locales/{ar,en}.ts            # UI chrome — BOTH files, appended near the feature's block
└── components/                   # reuse first: layout, app-prototype, forms, buttons
```

**Structure Decision**: [Name the route, the client leaf boundary, the `api/<Domain>API` file, the
`actions/<domain>.ts` file, and where the copy lives (locale block or `_content.ts`).]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified.** A violation needs
> agreement recorded in the PR before the code is written — see Governance in the constitution.

| Violation | Principle | Why Needed | Simpler Alternative Rejected Because |
|-----------|-----------|------------|--------------------------------------|
| [e.g., client-side fetch to a route handler] | III | [current need] | [why a server action fails] |
| [e.g., new `"use client"` above the leaf] | I | [current need] | [why it cannot sit deeper] |
