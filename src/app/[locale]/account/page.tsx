import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import AccountView from "@/components/account/AccountView";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";
import styles from "../book/book.module.css";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("account");
  return { title: t("title") };
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  setStaticParamsLocale(resolveLocale((await params).locale));

  return (
    <main className={`container ${styles.main}`}>
      <AccountView />
    </main>
  );
}
