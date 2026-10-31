import "@/app/normalize.css";
import "@/app/globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";
import { setStaticParamsLocale } from "next-international/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PrePaintScript from "@/components/layout/PrePaintScript";
import { I18nProviderClient } from "@/components/providers/I18nProviderClient";
import AppConfig from "@/config/Base";
import { platformInitScript } from "@/config/stores";
import { themeInitScript } from "@/config/theme";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n, getStaticParams } from "@/locales/server";
import { ArabicFont, LatinFont, MonoFont } from "@/styles/fonts";

export function generateStaticParams() {
  return getStaticParams();
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("generalSEO");
  return {
    metadataBase: new URL(AppConfig.baseUrl),
    title: { template: `%s | ${t("name")}`, default: t("name") },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const safeLocale = resolveLocale((await params).locale);
  setStaticParamsLocale(safeLocale);
  const t = await getScopedI18n("header");

  return (
    <html
      lang={safeLocale}
      dir={safeLocale === "ar" ? "rtl" : "ltr"}
      className={`${ArabicFont.variable} ${LatinFont.variable} ${MonoFont.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <PrePaintScript code={themeInitScript} />
        <PrePaintScript code={platformInitScript} />
      </head>
      {/* Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before hydration. */}
      <body suppressHydrationWarning>
        <I18nProviderClient locale={safeLocale}>
          <a href="#root" className="skip-link">
            {t("skipToContent")}
          </a>
          <Header locale={safeLocale} />
          <div id="root" tabIndex={-1}>
            {children}
          </div>
          <Footer locale={safeLocale} />
        </I18nProviderClient>
      </body>
    </html>
  );
}
