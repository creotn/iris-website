import { CONTACT } from "../_components/contact.config";
import type { LegalContent } from "../_components/legal.types";

export const privacyContent: Record<"ar" | "en", LegalContent> = {
  en: {
    description: "How IRIS collects, uses and protects your personal data, and the rights you have over it.",
    label: "Legal",
    title: "Privacy Policy",
    lead: "Your car, your address and your time are personal. This policy explains what we collect, why we collect it, who sees it and the choices you have.",
    tocLabel: "On this page",
    sections: [
      {
        id: "who-we-are",
        title: "Who we are",
        body: [
          "IRIS Mobile Car Wash (“IRIS”, “we”, “us”) provides a mobile car wash service through this website and our mobile apps. We decide how and why your personal data is used for the service, so we are the party responsible for it.",
          "This policy applies to everyone who visits the site, creates an account, books a wash or contacts us. It follows the Saudi Personal Data Protection Law (PDPL) and its regulations.",
        ],
      },
      {
        id: "what-we-collect",
        title: "What we collect",
        body: [
          "We collect only what we need to run the service:",
          {
            list: [
              "Account details: your name, mobile number, email address and password (stored securely, never in plain text).",
              "Vehicle details: make, model, year, colour, type and plate number.",
              "Location: the address you save or pin for a wash, and your pro's position while they are on the way.",
              "Booking and payment records: services chosen, times, prices, payment status, wallet balance and memberships.",
              "Photos: before-and-after photos taken of your car during a wash.",
              "Messages: what you send to our support team.",
              "Technical data: device and browser type, language, light or dark theme preference and basic logs that keep the service secure and reliable.",
            ],
          },
          "We never see or store your full card number. Card payments are entered on our payment provider’s secure form.",
        ],
      },
      {
        id: "how-we-use-it",
        title: "How we use your data",
        body: [
          {
            list: [
              "To book, carry out and track your wash, and to send you the confirmations and arrival updates you expect.",
              "To take payments, apply discounts, manage your wallet and memberships and issue receipts.",
              "To give you support, including free re-washes when something is not right.",
              "To keep IRIS safe: preventing fraud, misuse and abuse, and protecting our pros and customers.",
              "To understand how the service is used so we can improve quality, coverage and prices.",
              "To meet our legal and accounting obligations.",
            ],
          },
        ],
      },
      {
        id: "legal-basis",
        title: "Why we are allowed to use it",
        body: [
          "We use your data because it is needed to provide the service you asked for, because the law requires it, because you gave your consent where consent is needed (for example, to use your precise location), and because we have a legitimate interest in running, securing and improving IRIS that does not override your rights.",
          "Where we rely on your consent, you can withdraw it at any time. Withdrawing does not affect what we did before.",
        ],
      },
      {
        id: "sharing",
        title: "Who we share it with",
        body: [
          "We do not sell your personal data. We share it only when it is necessary:",
          {
            list: [
              "The pro assigned to your booking sees your name, vehicle, address and job details so they can do the work.",
              "Our payment provider (Moyasar) processes card payments on our behalf.",
              "Service providers that help us run IRIS, such as hosting, messaging (SMS and email) and maps. They may only use your data to provide their service to us.",
              "Authorities, courts or regulators, when the law requires it.",
            ],
          },
          "If IRIS is ever merged with or acquired by another company, your data may move with the service, under the same protections.",
        ],
      },
      {
        id: "location-maps",
        title: "Location and maps",
        body: [
          "We use your location to find your address, check that we cover your area, send the right pro and show you their arrival. You choose what to share, and you can turn location access off in your device settings.",
          "The maps on this website are provided by OpenStreetMap contributors. Loading a map, or searching for a place, may send the area being viewed or your search text to a map service.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies and local storage",
        body: [
          "We use a small number of essential cookies and local-storage items: to keep you signed in, secure your session and remember your language and light or dark theme. At the time of writing we do not use advertising cookies.",
          "You can clear these in your browser at any time. If you block them, parts of the site, such as signing in, may stop working.",
        ],
      },
      {
        id: "retention",
        title: "How long we keep it",
        body: [
          "We keep your data for as long as your account is active and for as long as we need it to handle bookings, accounting and legal requirements. Photos and booking records are kept so we can resolve quality questions and disputes.",
          "You can ask us to close your account and delete your data. Some records, such as invoices, we must keep for the period the law requires.",
        ],
      },
      {
        id: "security",
        title: "How we protect it",
        body: [
          "We use encryption in transit, access controls and trusted hosting providers, and we limit internal access to the people who need it. No system is completely secure, so we also monitor for problems and act quickly if we find one.",
          "Please keep your password private and tell us straight away if you think your account has been used without your permission.",
        ],
      },
      {
        id: "your-rights",
        title: "Your rights",
        body: [
          "Under the PDPL you have the right to:",
          {
            list: [
              "Know how your data is collected and used (this policy).",
              "Access your data and get a copy of it.",
              "Correct data that is wrong or out of date.",
              "Ask us to delete your data, where the law allows.",
              "Withdraw your consent at any time.",
            ],
          },
          "To use any of these rights, contact us using the details below. We will answer as soon as we can. If you are not happy with our response, you can complain to the Saudi Data and AI Authority (SDAIA).",
        ],
      },
      {
        id: "children",
        title: "Children",
        body: [
          "IRIS is for adults. We do not knowingly collect data from anyone under 18. If you believe a child has given us their data, tell us and we will delete it.",
        ],
      },
      {
        id: "changes",
        title: "Changes to this policy",
        body: [
          "We may update this policy when our service or the law changes. For important changes we will let you know in the app or by email.",
        ],
      },
    ],
    questions: {
      title: "Questions about your data?",
      text: "Write to us and a real person will help.",
      email: CONTACT.email,
    },
  },
  ar: {
    description: "كيف تجمع IRIS بياناتك الشخصية وتستخدمها وتحميها، والحقوق التي تملكها عليها.",
    label: "قانوني",
    title: "سياسة الخصوصية",
    lead: "سيارتك وعنوانك ووقتك أمور شخصية. توضّح هذه السياسة ما نجمعه ولماذا، ومن يطّلع عليه، وما الخيارات المتاحة لك.",
    tocLabel: "في هذه الصفحة",
    sections: [
      {
        id: "who-we-are",
        title: "من نحن",
        body: [
          "إيريس لغسيل السيارات المتنقل («IRIS» أو «نحن») تقدّم خدمة غسيل سيارات متنقلة عبر هذا الموقع وتطبيقاتنا. نحن من يحدّد كيف ولماذا تُستخدم بياناتك الشخصية في الخدمة، ولذلك نتحمّل مسؤوليتها.",
          "تنطبق هذه السياسة على كل من يزور الموقع أو ينشئ حساباً أو يحجز غسلة أو يتواصل معنا، وهي متوافقة مع نظام حماية البيانات الشخصية في المملكة العربية السعودية ولوائحه.",
        ],
      },
      {
        id: "what-we-collect",
        title: "ما الذي نجمعه",
        body: [
          "نجمع فقط ما نحتاجه لتشغيل الخدمة:",
          {
            list: [
              "بيانات الحساب: اسمك ورقم جوالك وبريدك الإلكتروني وكلمة المرور (تُحفظ بشكل آمن ولا تُحفظ كنص عادي).",
              "بيانات المركبة: الماركة والطراز والسنة واللون والنوع ورقم اللوحة.",
              "الموقع: العنوان الذي تحفظه أو تحدّده للغسلة، وموقع المحترف أثناء توجّهه إليك.",
              "سجلات الحجز والدفع: الخدمات المختارة والمواعيد والأسعار وحالة الدفع ورصيد المحفظة والعضويات.",
              "الصور: صور قبل وبعد تُلتقط لسيارتك أثناء الغسلة.",
              "الرسائل: ما ترسله إلى فريق الدعم.",
              "البيانات التقنية: نوع الجهاز والمتصفح واللغة وتفضيل الوضع الفاتح أو الداكن وسجلات أساسية تحافظ على أمان الخدمة وموثوقيتها.",
            ],
          },
          "لا نطّلع على رقم بطاقتك الكامل ولا نخزّنه، إذ تُدخل بيانات البطاقة في نموذج الدفع الآمن لمزوّد الدفع.",
        ],
      },
      {
        id: "how-we-use-it",
        title: "كيف نستخدم بياناتك",
        body: [
          {
            list: [
              "لحجز غسلتك وتنفيذها ومتابعتها، وإرسال التأكيدات وتحديثات الوصول التي تتوقعها.",
              "لإتمام المدفوعات وتطبيق الخصومات وإدارة محفظتك وعضوياتك وإصدار الإيصالات.",
              "لتقديم الدعم، بما في ذلك إعادة الغسل مجاناً عندما لا تكون النتيجة مرضية.",
              "للحفاظ على أمان IRIS ومنع الاحتيال وإساءة الاستخدام وحماية المحترفين والعملاء.",
              "لفهم كيفية استخدام الخدمة وتحسين الجودة والتغطية والأسعار.",
              "للوفاء بالتزاماتنا القانونية والمحاسبية.",
            ],
          },
        ],
      },
      {
        id: "legal-basis",
        title: "سبب السماح لنا باستخدامها",
        body: [
          "نستخدم بياناتك لأنها لازمة لتقديم الخدمة التي طلبتها، ولأن النظام يوجب ذلك، ولأنك وافقت حيث تلزم الموافقة (مثل استخدام موقعك الدقيق)، ولأن لنا مصلحة مشروعة في تشغيل IRIS وتأمينها وتحسينها لا تتعارض مع حقوقك.",
          "حين نعتمد على موافقتك يمكنك سحبها في أي وقت، ولا يؤثر سحبها على ما تم قبله.",
        ],
      },
      {
        id: "sharing",
        title: "مع من نشاركها",
        body: [
          "لا نبيع بياناتك الشخصية. نشاركها فقط عند الحاجة:",
          {
            list: [
              "يرى المحترف المسند إلى حجزك اسمك ومركبتك وعنوانك وتفاصيل العمل ليتمكن من أدائه.",
              "يعالج مزوّد الدفع لدينا (مويسر) مدفوعات البطاقات نيابةً عنا.",
              "مزوّدو الخدمات الذين يساعدوننا في تشغيل IRIS، مثل الاستضافة والرسائل (الرسائل النصية والبريد) والخرائط، ولا يجوز لهم استخدام بياناتك إلا لتقديم خدمتهم لنا.",
              "الجهات الرسمية والمحاكم والجهات التنظيمية عندما يوجب النظام ذلك.",
            ],
          },
          "إذا اندمجت IRIS يوماً مع شركة أخرى أو استحوذت عليها شركة أخرى، فقد تنتقل بياناتك مع الخدمة وبالحماية نفسها.",
        ],
      },
      {
        id: "location-maps",
        title: "الموقع والخرائط",
        body: [
          "نستخدم موقعك للعثور على عنوانك والتأكد من تغطيتنا لمنطقتك وإرسال المحترف المناسب وعرض وقت وصوله. أنت تختار ما تشاركه، ويمكنك إيقاف الوصول إلى الموقع من إعدادات جهازك.",
          "الخرائط في هذا الموقع مقدّمة من مساهمي OpenStreetMap. وقد يؤدي تحميل خريطة أو البحث عن مكان إلى إرسال المنطقة المعروضة أو نص بحثك إلى خدمة الخرائط.",
        ],
      },
      {
        id: "cookies",
        title: "ملفات تعريف الارتباط والتخزين المحلي",
        body: [
          "نستخدم عدداً قليلاً من ملفات تعريف الارتباط وعناصر التخزين المحلي الضرورية: لإبقائك مسجّل الدخول وتأمين جلستك وتذكّر لغتك ووضعك الفاتح أو الداكن. وحتى وقت كتابة هذه السياسة لا نستخدم ملفات تعريف ارتباط إعلانية.",
          "يمكنك حذفها من متصفحك في أي وقت. وإذا منعتها فقد تتوقف بعض أجزاء الموقع عن العمل، مثل تسجيل الدخول.",
        ],
      },
      {
        id: "retention",
        title: "مدة الاحتفاظ بها",
        body: [
          "نحتفظ ببياناتك ما دام حسابك نشطاً وما دمنا بحاجة إليها لمعالجة الحجوزات والمحاسبة والمتطلبات النظامية. ونحتفظ بالصور وسجلات الحجز لنتمكن من حل أسئلة الجودة والنزاعات.",
          "يمكنك أن تطلب إغلاق حسابك وحذف بياناتك. وهناك سجلات، كالفواتير، يلزمنا الاحتفاظ بها للمدة التي يحددها النظام.",
        ],
      },
      {
        id: "security",
        title: "كيف نحميها",
        body: [
          "نستخدم التشفير أثناء النقل وضوابط الوصول ومزوّدي استضافة موثوقين، ونقصر الوصول الداخلي على من يحتاجه. ولا يوجد نظام آمن تماماً، لذا نراقب المشكلات ونتصرّف بسرعة إن وجدنا أياً منها.",
          "يرجى إبقاء كلمة مرورك سرية، وإبلاغنا فوراً إذا ظننت أن حسابك استُخدم دون إذنك.",
        ],
      },
      {
        id: "your-rights",
        title: "حقوقك",
        body: [
          "بموجب نظام حماية البيانات الشخصية لك الحق في:",
          {
            list: [
              "معرفة كيف تُجمع بياناتك وتُستخدم (وهذه السياسة).",
              "الوصول إلى بياناتك والحصول على نسخة منها.",
              "تصحيح البيانات الخاطئة أو القديمة.",
              "طلب حذف بياناتك متى أجاز النظام ذلك.",
              "سحب موافقتك في أي وقت.",
            ],
          },
          "لممارسة أي من هذه الحقوق تواصل معنا عبر البيانات أدناه، وسنرد في أقرب وقت. وإذا لم يرضك ردّنا فيمكنك تقديم شكوى إلى الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).",
        ],
      },
      {
        id: "children",
        title: "الأطفال",
        body: [
          "IRIS مخصصة للبالغين، ولا نجمع عمداً بيانات من هم دون 18 عاماً. وإذا ظننت أن طفلاً قدّم لنا بياناته فأخبرنا وسنحذفها.",
        ],
      },
      {
        id: "changes",
        title: "التعديلات على هذه السياسة",
        body: [
          "قد نحدّث هذه السياسة عندما تتغير خدمتنا أو النظام. وفي التغييرات المهمة سنُعلمك داخل التطبيق أو عبر البريد الإلكتروني.",
        ],
      },
    ],
    questions: {
      title: "لديك أسئلة عن بياناتك؟",
      text: "راسلنا وسيساعدك شخص حقيقي.",
      email: CONTACT.email,
    },
  },
};
