const VALID_LOCALES: Locale[] = ["ar", "en"];

export function resolveLocale(locale: string | undefined): Locale {
  const normalized = locale?.toLowerCase().trim() as Locale;
  return VALID_LOCALES.includes(normalized) ? normalized : "ar";
}
