export type CarSize = "sedan" | "suv" | "van";

export const carSizes: CarSize[] = ["sedan", "suv", "van"];

type L10n = { ar: string; en: string };

export type SingleWash = {
  id: string;
  name: L10n;
  desc: L10n;
  prices: Record<CarSize, number>;
};

// Seed values from the iris-backend service catalogue, VAT included. Verify against the admin Catalog before launch.
export const singleWashes: SingleWash[] = [
  {
    id: "quick",
    name: { en: "Quick Exterior Wash", ar: "غسيل خارجي سريع" },
    desc: {
      en: "Active-foam wash, microfibre dry and tyre shine",
      ar: "غسيل بالرغوة الفعالة مع تجفيف بالمايكروفايبر وتلميع الإطارات",
    },
    prices: { sedan: 70, suv: 90, van: 110 },
  },
  {
    id: "interior",
    name: { en: "Deep Interior Clean", ar: "غسيل داخلي عميق" },
    desc: {
      en: "Steam-cleaned seats, stain removal, sanitised vents",
      ar: "تنظيف المقاعد بالبخار وإزالة البقع وتطهير فتحات التكييف",
    },
    prices: { sedan: 150, suv: 190, van: 230 },
  },
  {
    id: "wax",
    name: { en: "Nano Wax Protection", ar: "حماية شمعية نانو" },
    desc: {
      en: "A nano layer that shields paint from dust and weather for 3 months",
      ar: "طبقة نانو تحمي الطلاء من الأتربة والطقس لثلاثة أشهر",
    },
    prices: { sedan: 180, suv: 220, van: 260 },
  },
  {
    id: "diamond",
    name: { en: "Diamond Full Wash", ar: "غسيل ماسي شامل" },
    desc: {
      en: "Foam exterior, deep interior clean, signature scent",
      ar: "غسيل خارجي رغوي مع تنظيف داخلي عميق وتعطير مميز",
    },
    prices: { sedan: 250, suv: 300, van: 350 },
  },
  {
    id: "polish",
    name: { en: "Paint Polish & Protection", ar: "تلميع وحماية الطلاء" },
    desc: {
      en: "Machine polish to remove fine scratches, sealed with wax",
      ar: "تلميع آلي يزيل الخدوش الدقيقة مع طبقة شمعية واقية",
    },
    prices: { sedan: 350, suv: 420, van: 480 },
  },
];

export const addOnPrices = { engineBay: 60, headlight: 45 };
