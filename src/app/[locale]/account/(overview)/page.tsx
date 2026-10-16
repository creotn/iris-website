import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import AccountView from "@/components/account/AccountView";
import styles from "@/components/account/Account.module.css";
import { VIEWS, type View } from "@/components/account/order";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("account");
  return { title: t("title") };
}

export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  setStaticParamsLocale(resolveLocale((await params).locale));
  const { view } = await searchParams;

  return (
    <main className={`container ${styles.main}`}>
      <AccountView initialView={VIEWS.includes(view as View) ? (view as View) : "live"} />
    </main>
  );
}
