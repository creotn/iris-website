export const ctaImage = "/images/cta/watcher.png";

export type CtaContent = {
  title: string;
  description: string;
  primary: string;
};

export const ctaContent: Record<"ar" | "en", CtaContent> = {
  en: {
    title: "Ready for a\nspotless car?",
    description:
      "Book in 30 seconds and get 20% off your first wash with code IRIS20 — plus a free re-wash if it isn't perfect.",
    primary: "Book your wash",
  },
  ar: {
    title: "جاهز لسيارة\nلامعة؟",
    description:
      "احجز في 30 ثانية واحصل على خصم 20% على أول غسلة بالرمز IRIS20 — مع إعادة غسل مجانية إن لم تكن مثالية.",
    primary: "احجز غسلتك",
  },
};
