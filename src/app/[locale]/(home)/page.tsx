import { setStaticParamsLocale } from "next-international/server";
import { resolveLocale } from "@/locales/resolveLocale";
import CoverageSection from "../_components/CoverageSection";
import CtaSection from "../_components/CtaSection";
import FaqSection from "../_components/FaqSection";
import FeaturesSection from "../_components/FeaturesSection";
import HeroSection from "../_components/HeroSection";
import HowItWorksSection from "../_components/HowItWorksSection";
import PricingSection from "../_components/PricingSection";

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);

  return (
    <main className="alternating-sections">
      <HeroSection locale={locale} />
      <FeaturesSection locale={locale} />
      <HowItWorksSection locale={locale} />
      <PricingSection locale={locale} />
      <CoverageSection locale={locale} />
      <FaqSection locale={locale} />
      <CtaSection locale={locale} />
    </main>
  );
}
