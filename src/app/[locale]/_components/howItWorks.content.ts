export type HowItWorksContent = {
  label: string;
  title: string;
  cta: string;
  steps: { title: string; desc: string; image: string }[];
};

export const howItWorksContent: Record<"ar" | "en", HowItWorksContent> = {
  en: {
    label: "How it works",
    title: "From tap to spotless\nin four moves.",
    cta: "Book your first wash",
    steps: [
      {
        title: "Drop a pin",
        desc: "Search your district, enter an address or use your current location — then pin where the car is.",
        image: "/images/how-it-works/visit-place.png",
      },
      {
        title: "Pay your way",
        desc: "Card (mada, Visa, Mastercard), wallet or cash at the visit. Pay online and save 10%.",
        image: "/images/how-it-works/payment-card.jpg",
      },
      {
        title: "Track your visit",
        desc: "Follow it live: finding a technician, on the way, arrived, washing, done.",
        image: "/images/how-it-works/visit-tracking.jpg",
      },
      {
        title: "Make it a membership",
        desc: "Pick a 1, 3 or 12-month IRIS membership and make washing part of your routine.",
        image: "/images/how-it-works/membership.jpg",
      },
    ],
  },
  ar: {
    label: "كيف يعمل",
    title: "من لمسة إلى لمعان\nفي أربع خطوات.",
    cta: "احجز أول غسلة",
    steps: [
      {
        title: "حدّد موقعك",
        desc: "ابحث عن حيّك أو أدخل العنوان أو استخدم موقعك الحالي، ثم ضع الدبوس حيث توجد سيارتك.",
        image: "/images/how-it-works/visit-place.png",
      },
      {
        title: "ادفع بطريقتك",
        desc: "بالبطاقة (مدى، فيزا، ماستركارد) أو من المحفظة أو نقداً عند الزيارة. وفّر 10% عند الدفع أونلاين.",
        image: "/images/how-it-works/payment-card.jpg",
      },
      {
        title: "تابع زيارتك",
        desc: "تابعها مباشرة: البحث عن فني، في الطريق، وصل، جارٍ الغسيل، انتهت.",
        image: "/images/how-it-works/visit-tracking.jpg",
      },
      {
        title: "اجعلها عضوية",
        desc: "اختر عضوية IRIS لشهر أو 3 أشهر أو 12 شهراً، واجعل الغسيل جزءاً من روتينك.",
        image: "/images/how-it-works/membership.jpg",
      },
    ],
  },
};
