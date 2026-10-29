import { setStaticParamsLocale } from "next-international/server";
import { resolveLocale } from "@/locales/resolveLocale";
import CoverageSection from "../_components/coverage";
import CtaSection from "../_components/cta";
import FaqSection from "../_components/faq";
import FeaturesSection from "../_components/features";
import HeroSection from "../_components/hero";
import HowItWorksSection from "../_components/how-it-works";
import PricingSection from "../_components/pricing";

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
