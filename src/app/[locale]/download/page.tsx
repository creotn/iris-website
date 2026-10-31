import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { getStoreUrls } from "@/lib/downloadLink";
import { getScopedI18n } from "@/locales/server";
import { resolveLocale } from "@/locales/resolveLocale";
import DownloadSection from "../_components/DownloadSection";
import styles from "./download.module.css";

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  setStaticParamsLocale(resolveLocale((await params).locale));
  const t = await getScopedI18n("download");
  return { title: t("pageTitle"), description: t("mobileDescription") };
}

// `/download` goes straight to a store (proxy.ts) and only falls back here if that store isn't set.
export default async function DownloadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setStaticParamsLocale(resolveLocale((await params).locale));
  const t = await getScopedI18n("download");
  const stores = getStoreUrls();

  return (
    <main className={styles.page}>
      <DownloadSection />
      {!stores.ios && !stores.android && (
        <p className={`body-sm ${styles.note}`} role="status">
          {t("unavailable")}
        </p>
      )}
    </main>
  );
}
