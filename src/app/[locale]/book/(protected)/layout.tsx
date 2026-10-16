import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/fetch/getAuthToken";
import { resolveLocale } from "@/locales/resolveLocale";

// The proxy has already spent the session cookie for a fresh access token, so no token here means
// the visitor is signed out.
export default async function ProtectedBookLayout({
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
