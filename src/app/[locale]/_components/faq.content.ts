export type FaqContent = {
  label: string;
  title: string;
  items: { question: string; answer: string }[];
};

export const faqContent: Record<"ar" | "en", FaqContent> = {
  en: {
    label: "FAQ",
    title: "Questions? We have answers",
    items: [
      {
        question: "Do I need to provide water or electricity?",
        answer:
          "No. Our pros arrive fully equipped with waterless solutions and their own power — just share your location.",
      },
      {
        question: "Where can you wash my car?",
        answer:
          "At your home, office or any parking spot inside our service areas. Drop a pin when you book and we'll confirm coverage instantly.",
      },
      {
        question: "How do I pay?",
        answer:
          "Pay in the app or on the website by card, from your IRIS wallet balance, or in cash once the wash is done. Prices include VAT.",
      },
      {
        question: "Can I reschedule or cancel?",
        answer:
          "Yes. You can change the time or cancel from your account before your pro is on the way, at no cost.",
      },
      {
        question: "What if I am not satisfied?",
        answer:
          "Tell us within 24 hours and we'll send a pro back to fix it for free. Every wash ends with before and after photos as proof.",
      },
    ],
  },
  ar: {
    label: "الأسئلة الشائعة",
    title: "أسئلة؟ لدينا الإجابات",
    items: [
      {
        question: "هل أحتاج إلى توفير الماء أو الكهرباء؟",
        answer:
          "لا. يصل محترفونا بكامل معداتهم وحلول الغسيل بلا ماء ومصدر طاقتهم الخاص — فقط شاركنا موقعك.",
      },
      {
        question: "أين يمكنكم غسل سيارتي؟",
        answer:
          "في بيتك أو مكتبك أو أي موقف داخل مناطق خدمتنا. حدّد موقعك عند الحجز وسنؤكد التغطية فوراً.",
      },
      {
        question: "كيف أدفع؟",
        answer:
          "ادفع من التطبيق أو الموقع بالبطاقة، أو من رصيد محفظة IRIS، أو نقداً بعد انتهاء الغسلة. الأسعار شاملة الضريبة.",
      },
      {
        question: "هل يمكنني تغيير الموعد أو الإلغاء؟",
        answer:
          "نعم. يمكنك تغيير الوقت أو الإلغاء من حسابك قبل أن ينطلق المحترف إليك، دون أي تكلفة.",
      },
      {
        question: "ماذا لو لم أكن راضياً؟",
        answer:
          "أخبرنا خلال 24 ساعة وسنرسل محترفاً لإصلاح الأمر مجاناً. وتنتهي كل غسلة بصور قبل وبعد كإثبات.",
      },
    ],
  },
};
