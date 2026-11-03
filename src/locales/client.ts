"use client";
import { createI18nClient } from "next-international/client";
import ar from "./ar";
import en from "./en";

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
