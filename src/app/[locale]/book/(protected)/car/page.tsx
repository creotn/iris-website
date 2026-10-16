import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import CarForm from "@/components/booking/CarForm";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";
import styles from "../../book.module.css";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("book");
  return { title: t("carTitle") };
}

export default async function CarPage({ params }: { params: Promise<{ locale: string }> }) {
  setStaticParamsLocale(resolveLocale((await params).locale));

  return (
    <main className={`container ${styles.main}`}>
      <CarForm />
    </main>
  );
}
