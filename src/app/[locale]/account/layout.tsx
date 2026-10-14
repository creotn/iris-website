import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/fetch/getAuthToken";
import { resolveLocale } from "@/locales/resolveLocale";

// Same guard as the booking steps: the proxy has already refreshed the token, so none means signed out.
export default async function AccountLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  if (!(await getAuthToken())) redirect(`/${locale}/sign-in`);

  return children;
}
