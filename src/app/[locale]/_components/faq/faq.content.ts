export type FaqContent = {
  label: string;
  title: string;
  items: { question: string; answer: string }[];
};

export const faqContent: Record<"ar" | "en", FaqContent> = {
  en: {
    label: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        question: "Do I need to be there?",
        answer:
          "No. When booking, choose to hand over the key yourself, leave it with the guard or reception, or leave the car unlocked.",
      },
      {
        question: "Do I need to provide water or power?",
        answer:
          "No. The technician brings all equipment and products, and we offer a waterless eco wash for light dust.",
      },
      {
        question: "How do I pay?",
        answer:
          "By card (mada, Visa, Mastercard), from your balance, from your membership washes, or in cash to the technician. Prices include VAT.",
      },
      {
        question: "Can you wash more than one car?",
        answer:
          "Yes. Add your cars to the same visit, or share it with neighbours so each pays a lower price per car.",
      },
      {
        question: "Can I gift a wash?",
        answer:
          "Yes. Send a wash or membership to any phone number, even if they don't have an account yet. Invite a friend and you both get washes.",
      },
      {
        question: "What if I cancel?",
        answer:
          "A membership wash goes back to your wallet, a balance payment goes back to your balance, and our team handles card refunds.",
      },
      {
        question: "What if I'm not happy?",
        answer:
          "Rate the visit and chat with support in the app. The before-and-after photos help us sort it out quickly.",
      },
    ],
  },
  ar: {
    label: "الأسئلة الشائعة",
    title: "أسئلة شائعة",
    items: [
      {
        question: "هل يجب أن أكون موجوداً؟",
        answer:
          "لا. عند الحجز اختر: تسليم المفتاح بنفسك، أو تركه مع الحارس أو الاستقبال، أو ترك السيارة مفتوحة.",
      },
      {
        question: "هل أحتاج إلى توفير ماء أو كهرباء؟",
        answer:
          "لا. يصل الفني بكامل معداته ومنتجاته، ولدينا غسيل بيئي بدون ماء جارٍ للغبار الخفيف.",
      },
      {
        question: "كيف أدفع؟",
        answer:
          "بالبطاقة (مدى، فيزا، ماستركارد)، أو من رصيدك، أو من غسلات عضويتك، أو نقداً للفني. الأسعار شاملة الضريبة.",
      },
      {
        question: "هل يمكن غسل أكثر من سيارة؟",
        answer:
          "نعم. أضف سياراتك إلى الزيارة نفسها، أو شاركها مع جيرانك ليدفع كل شخص سعراً أقل لسيارته.",
      },
      {
        question: "هل يمكنني إهداء غسلة؟",
        answer:
          "نعم. أرسل غسلة أو عضوية إلى أي رقم جوال، حتى لو لم يكن لدى صاحبه حساب. وعندما تدعو صديقاً، تحصلان كلاكما على غسلات.",
      },
      {
        question: "ماذا لو ألغيت الحجز؟",
        answer:
          "تعود غسلة العضوية إلى محفظتك، ويعود المبلغ المدفوع من الرصيد إلى رصيدك، ويراجع فريقنا استرداد مدفوعات البطاقة.",
      },
      {
        question: "ماذا لو لم أكن راضياً؟",
        answer:
          "قيّم الزيارة وتحدّث مع فريق الدعم من التطبيق مباشرة، وصور قبل وبعد تساعدنا على معالجة الأمر بسرعة.",
      },
    ],
  },
};
