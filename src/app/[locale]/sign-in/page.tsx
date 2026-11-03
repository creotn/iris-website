import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import SignInForm from "@/components/forms/SignInForm";
import SplitLayout from "@/components/layout/SplitLayout";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("signIn");
  return { title: t("title") };
}

export default async function SignIn({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setStaticParamsLocale(resolveLocale((await params).locale));

  return (
    <SplitLayout>
      <SignInForm />
    </SplitLayout>
  );
}
