import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { resolveLocale } from "@/locales/resolveLocale";
import LegalDocument from "../_components/LegalDocument";
import { termsContent } from "./_content";

export const revalidate = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { title, description } = termsContent[resolveLocale((await params).locale)];
  return { title, description };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);

  return (
    <main className="alternating-sections">
      <LegalDocument content={termsContent[locale]} />
    </main>
  );
}
