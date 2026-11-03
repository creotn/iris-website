"use client";

import { useChangeLocale, useCurrentLocale } from "@/locales/client";

/** Names the other language in its own script ("العربية" on the English site, "English" on the Arabic one). */
export default function LanguageSwitcher({
  labels,
  className,
}: {
  labels: { en: string; ar: string };
  className?: string;
}) {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const next = currentLocale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => changeLocale(next)}
      className={className}
      lang={next}
      title={labels[next]}
    >
      {next === "ar" ? "العربية" : "English"}
    </button>
  );
}
