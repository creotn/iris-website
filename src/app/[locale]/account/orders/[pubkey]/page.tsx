import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import OrderDetail from "@/components/account/OrderDetail";
import styles from "@/components/account/Account.module.css";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("account");
  return { title: t("orderTitle") };
}

export default async function OrderPage({ params }: { params: Promise<{ locale: string; pubkey: string }> }) {
  const { locale, pubkey } = await params;
  setStaticParamsLocale(resolveLocale(locale));

  return (
    <main className={`container ${styles.main}`}>
      <OrderDetail pubkey={pubkey} />
    </main>
  );
}
