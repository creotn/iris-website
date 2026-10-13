import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { resolveLocale } from "@/locales/resolveLocale";
import { getBrandBookContent } from "./_content";
import BookIntro from "./_components/BookIntro";
import BrandPart from "./_components/BrandPart";
import PlatformPart from "./_components/PlatformPart";
import WorldPart from "./_components/WorldPart";

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { meta } = getBrandBookContent(resolveLocale((await params).locale));
  return {
    title: meta.title,
    description: meta.description,
    robots: { index: false, follow: false },
  };
}

export default async function BrandBookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);
  const content = getBrandBookContent(locale);

  return (
    <main>
      <BookIntro c={content} />
      <BrandPart c={content} />
      <PlatformPart c={content} />
      <WorldPart c={content} locale={locale} />
    </main>
  );
}
