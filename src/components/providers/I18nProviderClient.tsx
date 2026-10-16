"use client";
import { I18nProviderClient as _I18nProviderClient } from "@/locales/client";
import { resolveLocale } from "@/locales/resolveLocale";
import { ReactNode } from "react";

export function I18nProviderClient({
  locale,
  fallback,
  children,
}: {
  locale: string;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  return (
    <_I18nProviderClient locale={resolveLocale(locale)} fallback={fallback}>
      {children}
    </_I18nProviderClient>
  );
}
