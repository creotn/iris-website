import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";
import styles from "../sign-in/page.module.css";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("forgot");
  return { title: t("title") };
}

export default async function ForgotPassword({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setStaticParamsLocale(resolveLocale((await params).locale));

  return (
    <main className={`container ${styles.main}`}>
      <ForgotPasswordForm />
    </main>
  );
}
