export type HowItWorksContent = {
  label: string;
  title: string;
  cta: string;
  steps: { title: string; desc: string; image: string }[];
};

export const howItWorksContent: Record<"ar" | "en", HowItWorksContent> = {
  en: {
    label: "How it works",
    title: "Four steps\nto a spotless car.",
    cta: "Book your first wash",
    steps: [
      {
        title: "Pin your car",
        desc: "Search the address or use your location, and tell us how the technician gets the key: from you, from the guard, or the car is unlocked.",
        image: "/images/how-it-works/visit-place.png",
      },
      {
        title: "Choose a service and time",
        desc: "Pick your car size, service, add-ons and scent level, then book now or for later.",
        image: "/images/how-it-works/membership.jpg",
      },
      {
        title: "Pay your way",
        desc: "By card (mada, Visa, Mastercard), from your balance, from your membership washes, or in cash to the technician.",
        image: "/images/how-it-works/payment-card.jpg",
      },
      {
        title: "Track and receive",
        desc: "Follow the technician live, get before-and-after photos when done, then rate the visit.",
        image: "/images/how-it-works/visit-tracking.jpg",
      },
    ],
  },
  ar: {
    label: "كيف يعمل",
    title: "أربع خطوات\nوسيارتك لامعة.",
    cta: "احجز أول غسلة",
    steps: [
      {
        title: "حدّد موقع سيارتك",
        desc: "ابحث عن العنوان أو استخدم موقعك، وأخبرنا كيف يصل الفني للمفتاح: معك، أو مع الحارس، أو السيارة مفتوحة.",
        image: "/images/how-it-works/visit-place.png",
      },
      {
        title: "اختر الخدمة والوقت",
        desc: "حدّد حجم سيارتك والخدمة والإضافات ودرجة العطر، ثم احجز الآن أو في موعد يناسبك.",
        image: "/images/how-it-works/membership.jpg",
      },
      {
        title: "ادفع بطريقتك",
        desc: "بالبطاقة (مدى، فيزا، ماستركارد)، أو من رصيدك، أو من غسلات عضويتك، أو نقداً للفني عند الزيارة.",
        image: "/images/how-it-works/payment-card.jpg",
      },
      {
        title: "تابع واستلم",
        desc: "تابع الفني مباشرة، واستلم صور قبل وبعد عند الانتهاء، ثم قيّم الزيارة.",
        image: "/images/how-it-works/visit-tracking.jpg",
      },
    ],
  },
};
