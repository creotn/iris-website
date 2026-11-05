import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import VerifyEmail from "@/components/account/VerifyEmail";
import AuthLayout from "@/components/layout/AuthLayout";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("account");
  return { title: t("emailCheckTitle"), robots: { index: false } };
}

/** The page the confirmation email links to: `/verify-email?token=…`. */
export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  setStaticParamsLocale(resolveLocale((await params).locale));
  const { token } = await searchParams;

  return (
    <AuthLayout>
      <VerifyEmail token={token ?? ""} />
    </AuthLayout>
  );
}
