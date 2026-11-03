export type HowItWorksContent = {
  label: string;
  title: string;
  intro: string;
  cta: string;
  /** Shown under the swipeable row of screens on phones and tablets. */
  swipeHint: string;
  steps: { title: string; desc: string; image: string }[];
};


export const howItWorksContent: Record<"ar" | "en", HowItWorksContent> = {
  en: {
    label: "How it works",
    title: "Four steps\nto a spotless car.",
    intro: "Every screen here is the real app. Tap one to see what happens at that step.",
    cta: "Book a wash",
    swipeHint: "Swipe to see all four steps",
    steps: [
      {
        title: "Pin your car",
        desc: "Search the address or use your location, then choose how the technician gets the key.",
        image: "/images/how-it-works/visit-place.png",
      },
      {
        title: "Choose a service and time",
        desc: "Pick your car size, service, add-ons and scent level, then book now or for later.",
        image: "/images/how-it-works/membership.jpg",
      },
      {
        title: "Pay your way",
        desc: "Pay by card, balance, membership washes, or cash to the technician.",
        image: "/images/how-it-works/payment-card.jpg",
      },
      {
        title: "Track and receive",
        desc: "Track the technician live, get before-and-after photos, and rate the visit.",
        image: "/images/how-it-works/visit-tracking.jpg",
      },
    ],
  },
  ar: {
    label: "كيف يعمل",
    title: "أربع خطوات\nوسيارتك لامعة.",
    intro: "كل شاشة هنا من التطبيق نفسه. اضغط على أي منها لترى ما يحدث في تلك الخطوة.",
    cta: "احجز غسلة",
    swipeHint: "اسحب لترى الخطوات الأربع",
    steps: [
      {
        title: "حدّد موقع سيارتك",
        desc: "ابحث عن العنوان أو استخدم موقعك، ثم حدّد كيف سيحصل الفني على المفتاح.",
        image: "/images/how-it-works/visit-place.png",
      },
      {
        title: "اختر الخدمة والوقت",
        desc: "حدّد حجم سيارتك والخدمة والإضافات ودرجة العطر، ثم احجز الآن أو لاحقاً.",
        image: "/images/how-it-works/membership.jpg",
      },
      {
        title: "ادفع بطريقتك",
        desc: "ادفع بالبطاقة، أو من رصيدك، أو بغسلات عضويتك، أو نقداً للفني.",
        image: "/images/how-it-works/payment-card.jpg",
      },
      {
        title: "تابع واستلم",
        desc: "تابع الفني مباشرة، واستلم صور قبل وبعد، ثم قيّم الزيارة.",
        image: "/images/how-it-works/visit-tracking.jpg",
      },
    ],
  },
};
