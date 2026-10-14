import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import WashFlow from "@/components/booking/wash/WashFlow";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";
import styles from "../../book.module.css";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("wash");
  return { title: t("serviceTitle") };
}

export default async function WashPage({ params }: { params: Promise<{ locale: string }> }) {
  setStaticParamsLocale(resolveLocale((await params).locale));

  return (
    <main className={`container ${styles.main}`}>
      <WashFlow />
    </main>
  );
}
