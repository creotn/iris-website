import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setStaticParamsLocale } from "next-international/server";
import VerifyForm from "@/components/booking/VerifyForm";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";
import styles from "../book.module.css";

// Reads the identifier from the query string, so this page renders per request.
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("book");
  return { title: t("verifyTitle") };
}

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ identifier?: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);
  const { identifier } = await searchParams;
  if (!identifier) redirect(`/${locale}/sign-in`);

  return (
    <main className={`container ${styles.main}`}>
      <VerifyForm identifier={identifier} />
    </main>
  );
}
