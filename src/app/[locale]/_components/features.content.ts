import {
  IconCreditCard,
  IconDeviceMobile,
  IconLeaf,
  IconMapPin,
  IconShieldCheck,
  IconSparkles,
  type Icon,
} from "@tabler/icons-react";

export type Feature = {
  icon: Icon;
  image: string;
  title: { ar: string; en: string };
  desc?: { ar: string; en: string };
};

export const features: Feature[] = [
  {
    icon: IconDeviceMobile,
    image: "/images/features/book-in-30-seconds.jpg",
    title: { en: "Book in 30 seconds", ar: "احجز في 30 ثانية" },
  },
  {
    icon: IconMapPin,
    image: "/images/features/live-tracking.jpg",
    title: { en: "Live tracking", ar: "تتبع مباشر" },
  },
  {
    icon: IconShieldCheck,
    image: "/images/features/vetted-insured-pros.jpg",
    title: { en: "Vetted & insured pros", ar: "محترفون موثّقون ومؤمَّنون" },
  },
  {
    icon: IconCreditCard,
    image: "/images/features/transparent-pricing.jpg",
    title: { en: "Transparent pricing", ar: "أسعار شفافة" },
  },
  {
    icon: IconLeaf,
    image: "/images/features/eco-friendly.jpg",
    title: { en: "Eco-friendly by design", ar: "صديق للبيئة بالتصميم" },
  },
  {
    icon: IconSparkles,
    image: "/images/features/smart-recommendations.jpg",
    title: { en: "Smart recommendations", ar: "توصيات ذكية" },
  },
];
