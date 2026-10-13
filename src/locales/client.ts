"use client";
import { createI18nClient } from "next-international/client";
import ar from "./ar";
import en from "./en";

// next-international's provider calls use() only until the locale is cached, so a lazy import
// suspends once and then skips use() — React 19 flags that as a conditional use(). A thenable
// already marked fulfilled is read synchronously by use(), so the provider never suspends.
// Both dictionaries are small and ship to the client anyway.
function preloaded<T>(dictionary: T) {
  return () =>
    Object.assign(Promise.resolve({ default: dictionary }), {
      status: "fulfilled",
      value: { default: dictionary },
    });
}

export const {
  useI18n,
  useScopedI18n,
  I18nProviderClient,
  useChangeLocale,
  useCurrentLocale,
} = createI18nClient({
  ar: preloaded(ar),
  en: preloaded(en),
});
