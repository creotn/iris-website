export type HomeContent = {
  meta: { title: string; description: string };
  hero: {
    title: string;
    lead: string;
    cta: string;
    area: string;
    ticket: { label: string; service: string; stages: string[]; note: string };
  };
  services: {
    title: string;
    lead: string;
    from: string;
    vat: string;
    noPrice: string;
    comingSoon: string;
    book: string;
    items: { pubkey: string; title: string; includes: string; duration: string }[];
  };
  how: {
    title: string;
    steps: { art: string; title: string; text: string }[];
  };
  why: {
    title: string;
    lead: string;
    reasons: { title: string; text: string }[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  closing: { title: string; lead: string; cta: string };
};

// Prices come from the catalog by pubkey; listing services here keeps internal ones off the page.
const INTERIOR_EXTERIOR = "07ad87ee-4087-43be-b6df-7db6b5965032";
const DEEP_CLEANING = "6f413981-a929-4442-b641-6f7eb7357195";

export const homeContent: Record<Locale, HomeContent> = {
  ar: {
    meta: {
      title: "IRIS | غسيل سيارات متنقل يصل إليك في الرياض",
      description:
        "احجز غسيل سيارتك مع IRIS في الرياض. يأتي الفني المدرَّب بمعداته ومنتجاته إلى مكان سيارتك، وتعرف السعر قبل التأكيد، وتتابع زيارتك مرحلة بمرحلة.",
    },
    hero: {
      title: "العناية بسيارتك تصل إليك.",
      lead: "اختر الخدمة، وحدّد مكان سيارتك وموعدك، ويأتي فني IRIS المدرَّب بمعداته ومنتجاته.",
      cta: "احجز غسلتك",
      area: "متاحون الآن في الرياض",
      ticket: {
        label: "مراحل الزيارة",
        service: "غسيل داخلي وخارجي",
        stages: [
          "تم تعيين الفني",
          "الفني في الطريق",
          "وصل الفني",
          "بدأ الغسيل",
          "انتهى الغسيل",
        ],
        note: "تابع كل مرحلة من حسابك أو من تطبيق iPhone.",
      },
    },
    services: {
      title: "الخدمات والأسعار",
      lead: "تعرف السعر الكامل قبل أن تؤكد الحجز.",
      from: "يبدأ من",
      vat: "شامل الضريبة",
      noPrice: "يظهر السعر قبل تأكيد الحجز",
      comingSoon: "قريبًا",
      book: "احجز",
      items: [
        {
          pubkey: INTERIOR_EXTERIOR,
          title: "غسيل داخلي وخارجي",
          includes:
            "تنظيف الأسطح، وشفط المقاعد والأرضيات، وغسيل الهيكل والجنوط والزجاج، وتلميع الإطارات.",
          duration: "45–50 دقيقة",
        },
        {
          pubkey: DEEP_CLEANING,
          title: "تنظيف عميق",
          includes:
            "عناية شاملة بالمقاعد والأرضيات والسقف والتفاصيل الداخلية، ومعالجة البقع، وغسيل الهيكل الخارجي بالبخار.",
          duration: "ساعتان إلى ثلاث ساعات",
        },
      ],
    },
    how: {
      title: "من الحجز إلى سيارة نظيفة",
      steps: [
        {
          art: "search",
          title: "احجز في خطوات",
          text: "أضف سيارتك ومكانها، ثم اختر الخدمة، وحدّد الوقت من المواعيد المتاحة في منطقتك.",
        },
        {
          art: "dash",
          title: "يأتي الفني إليك",
          text: "يصل بمعداته ومنتجاته. سلّمه المفتاح بنفسك، أو اتركه مع الحارس، أو اترك السيارة مفتوحة.",
        },
        {
          art: "sparkle",
          title: "نعتني بالتفاصيل",
          text: "تابع الغسلة مرحلة بمرحلة من بدايتها إلى نهايتها.",
        },
        {
          art: "thumbs-up",
          title: "استلم سيارتك نظيفة",
          text: "قيّم الخدمة بعد انتهائها. وفي تطبيق iPhone يمكنك إعادة الحجز بضغطة واحدة.",
        },
      ],
    },
    why: {
      title: "شخصية لطيفة، وبروتوكول صارم.",
      lead: "الفرق يظهر في التفاصيل.",
      reasons: [
        {
          title: "فني مدرَّب ومجهَّز بالكامل",
          text: "يأتي فني IRIS بمعداته ومنتجاته المتميزة، ويعمل وفق معايير IRIS.",
        },
        {
          title: "تعرف أين وصلت زيارتك",
          text: "اعرف متى تم تعيين الفني، ومتى أصبح في الطريق، ومتى وصل، ومتى بدأ الغسيل وانتهى.",
        },
        {
          title: "سعر واضح قبل الدفع",
          text: "ترى السعر كاملًا مع الضريبة قبل أن تؤكد الحجز.",
        },
        {
          title: "ادفع كما يناسبك",
          text: "بمدى أو فيزا أو ماستركارد، أو من محفظتك. وإذا ألغيت حجزًا دفعته من المحفظة، يعود مبلغه إلى رصيدك تلقائيًا.",
        },
      ],
    },
    faq: {
      title: "قبل أن تحجز",
      items: [
        {
          question: "أين تتوفر الخدمة؟",
          answer:
            "في الرياض حاليًا. عندما تحدد مكان سيارتك نخبرك هل يقع ضمن مناطق الخدمة أم لا، قبل أن تدفع.",
        },
        {
          question: "هل يجب أن أبقى مع السيارة؟",
          answer:
            "لا. عند الحجز اختر ما يناسبك: تسليم المفتاح بنفسك، أو تركه مع الحارس، أو ترك السيارة مفتوحة.",
        },
        {
          question: "هل أحتاج إلى التطبيق لأحجز؟",
          answer: "لا. يمكنك الحجز من هذا الموقع بعد إنشاء حساب، أو من تطبيق IRIS على iPhone.",
        },
        {
          question: "هل يمكنني إلغاء الحجز؟",
          answer: "نعم، الإلغاء مجاني إلى أن يصبح الفني في الطريق إليك.",
        },
      ],
    },
    closing: {
      title: "لا نغسل فقط. نحن IRIS.",
      lead: "وفي تطبيق iPhone أيضًا: عضوية تشمل عددًا من الغسلات، وإهداء غسلة إلى من تحب عبر رقم جواله، ومحادثة مباشرة مع فريق الدعم.",
      cta: "احجز غسلتك",
    },
  },
  en: {
    meta: {
      title: "IRIS | Mobile car wash that comes to you in Riyadh",
      description:
        "Book a car wash with IRIS in Riyadh. A trained technician comes to your car with their own equipment and products. See the price before you confirm and follow each stage of the visit.",
    },
    hero: {
      title: "Car care that comes to you.",
      lead: "Choose a service, set your car's location and a time, and a trained IRIS technician arrives with their own equipment and products.",
      cta: "Book your wash",
      area: "Now serving Riyadh",
      ticket: {
        label: "Stages of a visit",
        service: "Interior & exterior wash",
        stages: [
          "Technician assigned",
          "On the way",
          "Arrived",
          "Wash started",
          "Wash finished",
        ],
        note: "Follow every stage from your account or the iPhone app.",
      },
    },
    services: {
      title: "Services and prices",
      lead: "You see the full price before you confirm.",
      from: "From",
      vat: "incl. VAT",
      noPrice: "Price shown before you confirm",
      comingSoon: "Coming soon",
      book: "Book",
      items: [
        {
          pubkey: INTERIOR_EXTERIOR,
          title: "Interior & exterior wash",
          includes:
            "Surfaces cleaned, seats and floors vacuumed, body, rims and glass washed, and tires shined.",
          duration: "45–50 minutes",
        },
        {
          pubkey: DEEP_CLEANING,
          title: "Deep cleaning",
          includes:
            "Full care for seats, floors, ceiling and interior details, stain treatment, and a steam wash of the body.",
          duration: "Two to three hours",
        },
      ],
    },
    how: {
      title: "From booking to a clean car",
      steps: [
        {
          art: "search",
          title: "Book in a few steps",
          text: "Add your car and its location, then choose a service and an available time in your area.",
        },
        {
          art: "dash",
          title: "Your technician comes to you",
          text: "They bring their own equipment and products. Hand over the key, leave it with the guard, or leave the car unlocked.",
        },
        {
          art: "sparkle",
          title: "We take care of the details",
          text: "Follow the wash stage by stage, from start to finish.",
        },
        {
          art: "thumbs-up",
          title: "Get your car back clean",
          text: "Rate the service when it's done. In the iPhone app, you can rebook in one tap.",
        },
      ],
    },
    why: {
      title: "A gentle character, a strict protocol.",
      lead: "The difference shows in the details.",
      reasons: [
        {
          title: "A trained technician, fully equipped",
          text: "Your IRIS technician brings their own equipment and premium products, and works to the IRIS standard.",
        },
        {
          title: "Know where your visit stands",
          text: "See when a technician is assigned, is on the way and has arrived, and when the wash starts and finishes.",
        },
        {
          title: "A clear price before you pay",
          text: "You see the full price and VAT before you confirm.",
        },
        {
          title: "Pay the way that suits you",
          text: "Mada, Visa or Mastercard, or your wallet. Cancel a booking paid from your wallet and the amount returns to your balance automatically.",
        },
      ],
    },
    faq: {
      title: "Before you book",
      items: [
        {
          question: "Where is IRIS available?",
          answer:
            "In Riyadh for now. When you set your car's location we tell you whether it's covered, before you pay.",
        },
        {
          question: "Do I need to stay with the car?",
          answer:
            "No. When you book, choose what suits you: hand over the key yourself, leave it with the guard, or leave the car unlocked.",
        },
        {
          question: "Do I need the app to book?",
          answer: "No. You can book on this website once you create an account, or in the IRIS app on iPhone.",
        },
        {
          question: "Can I cancel my booking?",
          answer: "Yes. Cancellation is free until your technician is on the way.",
        },
      ],
    },
    closing: {
      title: "We don't just wash. We IRIS.",
      lead: "Also in the iPhone app: a membership that includes a set number of washes, gifting a wash to anyone using their mobile number, and live chat with our support team.",
      cta: "Book your wash",
    },
  },
};
