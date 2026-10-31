import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { resolveLocale } from "@/locales/resolveLocale";
import ClosingSection from "../_components/ClosingSection";
import FaqSection from "../_components/FaqSection";
import HeroSection from "../_components/HeroSection";
import HowItWorksSection from "../_components/HowItWorksSection";
import ServicesSection from "../_components/ServicesSection";
import WhySection from "../_components/WhySection";
import { homeContent } from "./_content";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const { title, description } = homeContent[locale].meta;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { ar: "/ar", en: "/en", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      siteName: "IRIS",
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      title,
      description,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);
  const c = homeContent[locale];

  return (
    <main>
      <HeroSection locale={locale} c={c.hero} />
      <ServicesSection locale={locale} c={c.services} />
      <HowItWorksSection c={c.how} />
      <WhySection c={c.why} />
      <FaqSection c={c.faq} />
      <ClosingSection locale={locale} c={c.closing} />
    </main>
  );
}
