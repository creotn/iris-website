import {
  IconCamera,
  IconCreditCard,
  IconKey,
  IconMapPin,
  IconUsers,
  IconWallet,
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
    icon: IconKey,
    image: "/images/features/book-in-30-seconds.jpg",
    title: { en: "You don't need to be there", ar: "لا داعي لحضورك" },
    desc: { en: "Hand over the key, leave it with the guard, or leave the car unlocked. Your choice.", ar: "سلّم المفتاح بنفسك، أو اتركه مع الحارس، أو اترك السيارة مفتوحة. أنت تختار." },
  },
  {
    icon: IconMapPin,
    image: "/images/features/live-tracking.jpg",
    title: { en: "Live tracking", ar: "تتبع مباشر" },
    desc: { en: "See when your booking is accepted, when the technician sets off, arrives, starts and finishes.", ar: "اعرف متى قُبل الطلب، ومتى انطلق الفني، ومتى وصل وبدأ وانتهى." },
  },
  {
    icon: IconCamera,
    image: "/images/features/vetted-insured-pros.jpg",
    title: { en: "Before-and-after photos", ar: "صور قبل وبعد" },
    desc: { en: "Every visit ends with photos of your car before and after the wash.", ar: "كل زيارة تنتهي بصور لسيارتك قبل الغسيل وبعده." },
  },
  {
    icon: IconCreditCard,
    image: "/images/features/transparent-pricing.jpg",
    title: { en: "Clear pricing by car size", ar: "سعر واضح حسب حجم سيارتك" },
    desc: { en: "Pick sedan, SUV or van and see the final price, VAT included, before you confirm.", ar: "اختر سيدان أو دفع رباعي أو فان، وشاهد السعر النهائي شاملاً الضريبة قبل التأكيد." },
  },
  {
    icon: IconUsers,
    image: "/images/features/eco-friendly.jpg",
    title: { en: "Several cars, one visit", ar: "أكثر من سيارة، زيارة واحدة" },
    desc: { en: "Add the family's cars to the same visit, or share it with neighbours for a lower price per car.", ar: "أضف سيارات العائلة إلى الزيارة نفسها، أو شاركها مع جيرانك بسعر أقل للسيارة." },
  },
  {
    icon: IconWallet,
    image: "/images/features/smart-recommendations.jpg",
    title: { en: "Wallet, memberships and gifts", ar: "المحفظة والعضويات والهدايا" },
    desc: { en: "Top up your balance, take a membership, or gift a wash to any phone number.", ar: "اشحن رصيدك أو اشترك في عضوية، أو أهدِ غسلة لأي رقم جوال." },
  },
];
