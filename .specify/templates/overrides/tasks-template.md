---

description: "Task list template for feature implementation (iris-web project override)"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md,
data-model.md, contracts/

**Constitution**: `.specify/memory/constitution.md` — the gates in plan.md's Constitution Check
are not optional, and every phase below carries the ones that apply to it.

**Tests**: This repo has **2 Vitest suites** (the fetch transport). Do **not** scaffold a test suite
as a drive-by. Add a test task only when the feature touches the transport
(`src/lib/fetch/__tests__/`) or a pure helper worth pinning (next to it, in `__tests__/`), or when the
spec explicitly asks. `npx tsc --noEmit`, `pnpm lint` and `pnpm test` are the gates.

**Organization**: Tasks are grouped by user story so each story can be implemented and verified
independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a single `src/` tree — there is no backend/frontend or mobile split. Real paths:

- Route: `src/app/[locale]/<route>/page.tsx` (+ `_content.ts` for long-form `{ ar, en }` copy)
- Client leaf: `.../<route>/_components/<Feature>Client.tsx` (+ `<Feature>.module.css`)
- Server reads: `src/api/<Domain>API.tsx`
- Server writes: `src/actions/<domain>.ts`
- Locale keys: `src/locales/ar.ts` **and** `src/locales/en.ts` (both, always)
- Shared UI: `src/components/{layout,app-prototype,forms,buttons}/`, `src/app/[locale]/_components/` · logic: `src/utils/`, `src/lib/`
- Config: `src/config/` (`Base.tsx`, `theme.ts`, `brand.ts`) · tokens: `src/app/globals.css`

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - The Structure Decision and Constitution Check in plan.md
  - Entities from data-model.md
  - Endpoints from contracts/ (verified against the backend, prefix /v1/api/...)

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Discovery & Reuse (no code yet)

**Purpose**: Principle IV — find what already exists before adding anything. This repo's main
defect source is near-duplicates.

- [ ] T001 Run the reuse search for each UI element and helper this feature needs:
      `src/components/` (layout, app-prototype, forms, buttons) → `src/app/[locale]/_components/` →
      `src/lib/` → `src/utils/` → `src/config/`. Record hits (reuse / add a prop / genuinely new).
- [ ] T002 [P] Verify every endpoint against the backend — route, method, payload, `/v1/api/...`
      prefix — and record the exact shapes.
- [ ] T003 [P] Decide where the copy lives (locale keys for UI chrome, `_content.ts` for long-form
      text) and which shared tokens/components the design needs in light and dark themes.
- [ ] T004 [P] Name the cache intent per read: `revalidate` seconds, `tag`, and who purges it via
      `/api/clear-cache` (`revalidateTag(tag, "max")`). Reuse an existing window/tag.

**Checkpoint**: Nothing is being rebuilt, every endpoint is confirmed, cache intent is decided.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The server-side spine every story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Add types for the API payloads in `src/types/api.d.ts` (bilingual fields as
      `TranslationDto`).
- [ ] T006 Add read functions to `src/api/<Domain>API.tsx` — one per endpoint, wrapping
      `httpClient`, each with explicit `revalidate` (+ `tag` if cacheable; `requiresAuth: true`
      **and** `revalidate: 0` if per-user), returning a safe default on failure.
- [ ] T007 Add the Zod schema and server action to `src/actions/<domain>.ts` (`"use server"`,
      `httpClientPost`, Zod `{ error: "code" }`, returns error codes, mutations do not retry).
- [ ] T008 [P] Append the feature's locale block to `src/locales/ar.ts` **and** `src/locales/en.ts`
      — same keys in both, appended near the feature's existing block, no re-sort.
- [ ] T009 [P] Add any new error codes to the `translateError` map in `src/utils/error.ts`.

**Checkpoint**: Data path and copy exist; `npx tsc --noEmit` passes.

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [What this story delivers]

**Independent Test**: [How to verify it alone, in `pnpm dev`, in Arabic/RTL]

### Implementation for User Story 1

- [ ] T010 [US1] Create `src/app/[locale]/<route>/page.tsx` as a **Server Component** — await
      `params` + `resolveLocale()`, `setStaticParamsLocale(locale)`, explicit `revalidate`,
      `generateMetadata`, data fetched via `api/<Domain>API` and passed down as props.
- [ ] T011 [P] [US1] Create `_components/<Feature>Client.tsx` — the only `"use client"` in this
      story; form wired with `useActionState` + `useFormStatus` against the server action, using
      `components/buttons/SubmitButton`.
- [ ] T012 [P] [US1] Create `_components/<Feature>.module.css` — `:root` tokens (light + dark), logical
      properties only, radius tokens, keyframes local to the module, reduced-motion safe.
- [ ] T013 [US1] Render server text as `field?.[locale] ?? field?.ar ?? field?.en`; UI chrome via
      `getI18n` (server) or `useI18n` (client leaf only).
- [ ] T014 [US1] Loading, empty and error states (the `[locale]` segment already ships `loading.tsx`
      and `error.tsx`).
- [ ] T015 [US1] Verify in RTL (`ar`) and LTR (`en`), light and dark, in `pnpm dev`; no physical
      `left`/`right` crept in.

**Checkpoint**: User Story 1 works on its own, in both locales.

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [What this story delivers]

**Independent Test**: [How to verify it alone]

### Implementation for User Story 2

- [ ] T016 [P] [US2] [Route / component / action task with its real path]
- [ ] T017 [US2] [Locale keys appended to both files for this story's copy]
- [ ] T018 [US2] [Loading / empty / error states; RTL check]

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

- [ ] TXXX [P] Confirm no new `"use client"` sits above the component that needs it.
- [ ] TXXX [P] Confirm every list read is bounded and there is no request per row.
- [ ] TXXX [P] Confirm no heavy episodic package gained a new top-level import (`next/dynamic` at
      the point of use instead).
- [ ] TXXX Re-check the Constitution Check gates in plan.md against the actual diff.
- [ ] TXXX Locale parity sweep: every key added exists in **both** `ar.ts` and `en.ts`.
- [ ] TXXX `pnpm lint` · `npx tsc --noEmit` · `pnpm test` all pass. **`pnpm build` not run.**
- [ ] TXXX Diff review: only the requested change — no drive-by refactors, renames, or
      reformatting.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Discovery (Phase 1)**: No dependencies — start here, always.
- **Foundational (Phase 2)**: Depends on Discovery — BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Foundational; then parallel or in priority order
  (P1 → P2 → P3).
- **Polish (Final Phase)**: Depends on all desired user stories being complete.

### Within Each User Story

- Types → `api/<Domain>API` read → `actions/<domain>.ts` write → `page.tsx` → `*Client.tsx` leaf
- Locale keys land with the component that uses them, in **both** files
- Loading / empty / error states are part of the story, not the polish phase
- RTL verification closes the story

### Parallel Opportunities

- Discovery tasks T002–T004 are all `[P]`.
- `locales/*` and `utils/error.ts` edits are `[P]` against each other, but **`ar.ts` and `en.ts`
  are shared state** — one task edits both together to keep them in parity, and never re-sorts.
- A story's `*Client.tsx` and its `.module.css` are `[P]`.
- Different user stories can run in parallel once Foundational is done.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Discovery & Reuse
2. Complete Phase 2: Foundational (blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: test US1 alone in `pnpm dev`, in Arabic first
5. `npx tsc --noEmit`, then open the PR

### Incremental Delivery

1. Discovery + Foundational → data path and copy ready
2. Add User Story 1 → verify in both locales → PR (MVP)
3. Add User Story 2 → verify → PR
4. Each story ships without breaking the previous one

---

## Notes

- [P] tasks = different files, no dependencies
- Each user story should be independently completable and verifiable
- Commit after each task or logical group; never commit to `master`
- **`pnpm build` is not run locally** (memory) — `pnpm dev` is the live check; tsc, lint, test are the gates
- Avoid: vague tasks, same-file conflicts, a task that edits only one locale file, a task that
  hardcodes a colour or a radius instead of using the tokens
