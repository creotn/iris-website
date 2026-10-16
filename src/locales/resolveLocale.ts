const VALID_LOCALES: Locale[] = ["ar", "en"];

// The i18n proxy skips any path containing a dot, so `[locale]` can be a bot's
// `wp-login.php` or a `.well-known` probe rather than a real locale.
export function resolveLocale(locale: string | undefined): Locale {
  const normalized = locale?.toLowerCase().trim() as Locale;
  return VALID_LOCALES.includes(normalized) ? normalized : "ar";
}
