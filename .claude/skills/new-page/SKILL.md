---
name: new-page
description: Scaffold a new page and/or server action in the IRIS Website (Next.js 16 App Router) following project conventions — localized route under app/[locale], server-only bilingual copy, Zod-validated server action in actions/, and strings in both languages. Use when adding a marketing or showcase page, a form with submission, or a new server action.
---

# New website page / server action (IRIS Website)

Add a localized page and/or a server action. **The rules live in [CLAUDE.md](../../../CLAUDE.md)**
and the constitution (`.specify/memory/constitution.md`) — read them rather than relying on this
file to restate them. What's here is the scaffolding: the decisions to make, and skeletons that
already comply.

References: `src/app/[locale]/customer/page.tsx` (server page + `_content.ts` + metadata),
`src/api/ProjectAPI.tsx` (read layer), `src/actions/auth.ts` (write + Zod),
`src/components/forms/SignInForm.tsx` (`useActionState` + `translateError`).

## Steps

1. **Confirm scope.** Route path (`src/app/[locale]/<route>/`), whether it reads data, whether it
   submits data, and whether it needs a header/footer link (`components/layout/Header.tsx`,
   `Footer.tsx`). There are no route groups and no deploy modes — one root layout serves every page.

2. **State the rendering intent in the file.** Static content: `export const revalidate = false`.
   Cached API data: `export const revalidate = <seconds>`. Per-user data:
   `export const dynamic = "force-dynamic"`. Showcase/confidential pages also set
   `robots: { index: false, follow: false }` in `generateMetadata`.

3. **Page** at `src/app/[locale]/<route>/page.tsx` — a **Server Component**. `params` is a Promise:
   await it and narrow with `resolveLocale()`, then call `setStaticParamsLocale(locale)` (mandatory).
   `"use client"` goes on the deepest `_components/<Thing>Client.tsx` leaf, never on `page.tsx`.

4. **Copy.** Short UI strings → keys in **both** `src/locales/ar.ts` and `src/locales/en.ts`,
   appended near the feature's block. Long-form page copy → `src/app/[locale]/<route>/_content.ts`
   as `{ ar, en }` with one shared type (`const en: Content = …`), read server-side — it never
   enters the client dictionary. Bilingual API fields: `field?.[locale] ?? field?.ar ?? field?.en`.

5. **Reads** go in `src/api/<Domain>API.tsx` via `httpClient`, with an explicit `revalidate`, a
   `tags` entry, and a bounded list. Never a bare `fetch` in a page.

6. **Writes** go in `src/actions/<domain>.ts` (`"use server"`): a **Zod** schema (Zod 4 custom
   messages are `{ error: "code" }`), then `httpClientPost`. Return error **codes** — never a raw
   message, never `response.error`.

7. **Styles** in a `.module.css` beside the component: `:root` tokens only (they already have dark
   values), logical properties, radius tokens (`--radius-sm/md/lg/full`), `@keyframes` defined in
   the same module, scroll reveals inside `@supports (animation-timeline: view())`.

8. **Verify:** `npx tsc --noEmit`, `pnpm lint`, `pnpm test`, then `pnpm dev` in `ar` and `en`,
   light and dark. Never `pnpm build` locally.

## Skeletons

`src/app/[locale]/<route>/_content.ts`
```ts
// Long-form copy, server-only so it stays out of the client dictionary.
const ar = {
  meta: { title: "عنوان الصفحة", description: "وصف الصفحة" },
  title: "عنوان",
  empty: "لا توجد عناصر حالياً",
};

type FeatureContent = typeof ar;

const en: FeatureContent = {
  meta: { title: "Page title", description: "Page description" },
  title: "Title",
  empty: "Nothing here yet",
};

export function getFeatureContent(locale: Locale): FeatureContent {
  return locale === "en" ? en : ar;
}
```

`src/app/[locale]/<route>/page.tsx`
```tsx
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { fetchFeatures } from "@/api/FeatureAPI";
import { resolveLocale } from "@/locales/resolveLocale";
import { getFeatureContent } from "./_content";
import styles from "./page.module.css";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { meta } = getFeatureContent(resolveLocale((await params).locale));
  return { title: meta.title, description: meta.description };
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);
  const c = getFeatureContent(locale);
  const items = await fetchFeatures();

  return (
    <main className={`container ${styles.page}`}>
      <h1 className="heading-2">{c.title}</h1>
      {items.length === 0 ? (
        <p className={styles.empty}>{c.empty}</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.pubkey} className="card">
              {item.name?.[locale] ?? item.name?.ar ?? item.name?.en}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```

`src/api/FeatureAPI.tsx` — the read layer
```ts
import { httpClient } from "@/lib/fetch/httpClient";

export const fetchFeatures = async (limit = 50): Promise<Feature[]> => {
  const response = await httpClient<FindManyResponse<Feature>>(
    `${process.env.API_URL}/v1/api/features?limit=${limit}`,
    { revalidate: 300, tags: ["features-public"] },
  );
  return response.success ? response.data?.data || [] : [];
};
```
Note: the prefix is `/v1/api/...`, `API_URL` is server-only, every list read carries a bound,
`httpClient` never throws, and a new tag needs someone who purges it via `/api/clear-cache`.

`src/actions/<domain>.ts`
```ts
"use server";

import { z } from "zod";
import { httpClientPost } from "@/lib/fetch/httpClient";

const featureSchema = z.object({
  name: z.string().trim().min(2, { error: "name_too_short" }),
});

export async function SubmitFeature(
  previousState: unknown,
  formData: FormData,
): Promise<{ success: boolean; errorCode?: string } | null> {
  const parsed = featureSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { success: false, errorCode: parsed.error.issues[0]?.message ?? "invalid_input" };
  }

  const response = await httpClientPost(`${process.env.API_URL}/v1/api/features`, parsed.data);
  if (!response.success) {
    return { success: false, errorCode: response.errorCode ?? "network_error" };
  }
  return { success: true };
}
```

`src/app/[locale]/<route>/_components/FeatureFormClient.tsx`
```tsx
"use client";

import { useActionState } from "react";
import { SubmitFeature } from "@/actions/feature";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import styles from "./FeatureForm.module.css";

export default function FeatureFormClient() {
  const t = useScopedI18n("feature");
  const locale = useCurrentLocale();
  const [state, formAction] = useActionState(SubmitFeature, null);

  // Derived during render — no setState in an effect.
  const error = state?.errorCode ? translateError(state.errorCode, locale) : "";

  return (
    <form action={formAction} className={styles.form}>
      <input
        className={styles.input}
        name="name"
        placeholder={t("namePlaceholder")}
        aria-label={t("namePlaceholder")}
        required
      />
      <p className="errorMessage">{error}</p>
      <SubmitButton className="btn btn-primary">{t("submit")}</SubmitButton>
    </form>
  );
}
```

`src/app/[locale]/<route>/page.module.css`
```css
.page {
  padding-block: var(--space-4xl);
}

.list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-lg);
  margin-block-start: var(--space-xl);
  list-style: none;
}

.empty {
  color: var(--text-muted);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@supports (animation-timeline: view()) {
  .list > li {
    animation: rise linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 80%;
  }
}
```

Adjust the route, content, schema fields, action name, cache window, tag and i18n keys to match the
actual feature and the surrounding files before finishing.
