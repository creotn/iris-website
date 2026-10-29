export const ctaImage = "/images/cta/watcher.png";

export type CtaContent = {
  title: string;
  description: string;
  primary: string;
};

export const ctaContent: Record<"ar" | "en", CtaContent> = {
  en: {
    title: "A clean car today,\nwithout leaving your spot.",
    description:
      "Book now or for later, and leave the rest to your IRIS technician.",
    primary: "Book your wash",
  },
  ar: {
    title: "سيارتك نظيفة اليوم،\nدون أن تتحرك.",
    description:
      "احجز الآن أو في موعد يناسبك، واترك الباقي على فني IRIS.",
    primary: "احجز غسلتك",
  },
};
