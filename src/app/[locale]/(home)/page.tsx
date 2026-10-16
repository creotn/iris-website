import { setStaticParamsLocale } from "next-international/server";
import { resolveLocale } from "@/locales/resolveLocale";
import AppsSection from "../_components/AppsSection";
import FeaturesSection from "../_components/FeaturesSection";
import HeroSection from "../_components/HeroSection";
import HowItWorksSection from "../_components/HowItWorksSection";

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);

  return (
    <main>
      <HeroSection locale={locale} />
      <FeaturesSection />
      <HowItWorksSection />
      <AppsSection locale={locale} />
    </main>
  );
}
