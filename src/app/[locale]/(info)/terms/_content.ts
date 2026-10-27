import { CONTACT } from "../_components/contact.config";
import type { LegalContent } from "../_components/legal.types";

export const termsContent: Record<"ar" | "en", LegalContent> = {
  en: {
    description: "The terms for using IRIS: bookings, prices, payments, cancellations and our re-wash promise.",
    label: "Legal",
    title: "Terms of Service",
    lead: "These are the simple rules for using IRIS. They explain how bookings, payments and our promise work, so there are no surprises for you or for our pros.",
    tocLabel: "On this page",
    sections: [
      {
        id: "about",
        title: "About these terms",
        body: [
          "By using the IRIS website or apps, creating an account or booking a wash, you agree to these terms and to our Privacy Policy. If you do not agree, please do not use the service.",
          "“IRIS”, “we” and “us” mean IRIS Mobile Car Wash. “You” means the person using the service or booking on someone’s behalf.",
        ],
      },
      {
        id: "service",
        title: "The service",
        body: [
          "IRIS provides mobile car washing and car-care services at the place you choose, inside our service areas. We use vetted and trained pros who bring their own equipment.",
          "Availability depends on your address, the time you pick and pro availability. We may decline or reschedule a booking when we cannot serve it safely or on time, and we will tell you as early as we can.",
        ],
      },
      {
        id: "account",
        title: "Your account",
        body: [
          {
            list: [
              "Give accurate details and keep them up to date.",
              "Keep your password private. You are responsible for what happens on your account.",
              "You must be at least 18 and able to enter into a contract.",
              "We may suspend or close an account that is used for fraud, abuse or against these terms.",
            ],
          },
        ],
      },
      {
        id: "bookings",
        title: "Making a booking",
        body: [
          "Choose your services, your car and a time, and confirm your address. Your booking is confirmed once you see the confirmation in the app or on the website.",
          "Someone must be able to give our pro access to the car at the booked time and place. The size and condition of the vehicle can change the price and the time needed, so please choose the right vehicle type.",
        ],
      },
      {
        id: "prices-payment",
        title: "Prices and payment",
        body: [
          "Prices are in Saudi riyals and include VAT unless we say otherwise. The price you see before you confirm is the price you pay for what you selected.",
          "You can pay by card, from your IRIS wallet balance, or in cash where it is offered. Card payments are handled by our payment provider on a secure form. If a payment fails, the booking may not be confirmed.",
        ],
      },
      {
        id: "memberships",
        title: "Wallet and memberships",
        body: [
          "A membership gives you a set number of washes that you can use within a set period. The washes, the validity, how many cars it covers and the price of extra washes are shown on the plan when you buy it.",
          "Unused washes expire at the end of the validity period. Unless the law says otherwise or we tell you differently at purchase, memberships and wallet top-ups are not refundable once bought.",
        ],
      },
      {
        id: "changes-cancellations",
        title: "Changes and cancellations",
        body: [
          "You can reschedule or cancel from your account at no cost until your pro is on the way. After that, we may charge a reasonable fee to cover the pro’s time and travel.",
          "If we have to cancel or reschedule, you will not be charged, and any payment you made will be returned or kept as credit.",
        ],
      },
      {
        id: "promise",
        title: "Our re-wash promise",
        body: [
          "If you are not satisfied with a wash, tell us within 24 hours through your account or by contacting us, and we will send a pro back to put it right at no cost.",
          "The promise covers the quality of the work we did. It does not cover damage or marks that were already there, or conditions a wash cannot remove, such as deep scratches, paint damage or permanent stains.",
        ],
      },
      {
        id: "photos",
        title: "Photos of your car",
        body: [
          "Our pros take before-and-after photos of your car. They are saved in your account as a record of the job and used for quality checks and to resolve questions. We handle them as described in our Privacy Policy.",
        ],
      },
      {
        id: "your-responsibilities",
        title: "Your responsibilities",
        body: [
          {
            list: [
              "Remove valuables and personal items from the car before we arrive.",
              "Make sure the location is safe and legal for us to work in.",
              "Treat our pros with respect. We may end a booking if the pro is put at risk.",
              "Tell us about any existing damage or special care your car needs.",
            ],
          },
        ],
      },
      {
        id: "liability",
        title: "Insurance and liability",
        body: [
          "Your car is covered by insurance during the wash. If you think we have damaged it, tell us straight away and send photos, and we will deal with the claim under that cover.",
          "As far as the law allows, we are not liable for indirect or consequential losses, and our total liability for a booking is limited to the amount you paid for it. Nothing in these terms limits any right you have by law that cannot be limited.",
        ],
      },
      {
        id: "acceptable-use",
        title: "Acceptable use",
        body: [
          "Please do not misuse the platform: no fraud, fake bookings, scraping, attempts to break or overload the service, or use of it for anything unlawful. We may block access if this happens.",
        ],
      },
      {
        id: "ip",
        title: "Our content",
        body: [
          "The IRIS name, logo, designs and content belong to us or our licensors. You may use the website and apps for their intended purpose, but you may not copy or reuse our content without permission.",
        ],
      },
      {
        id: "changes",
        title: "Changes to these terms",
        body: [
          "We may update these terms from time to time. For important changes, we will let you know. If you keep using IRIS after a change, you accept the updated terms.",
        ],
      },
      {
        id: "law",
        title: "Governing law",
        body: [
          "These terms are governed by the laws of the Kingdom of Saudi Arabia. Any dispute we cannot settle together will be handled by the competent courts in Riyadh.",
        ],
      },
    ],
    questions: {
      title: "Questions about these terms?",
      text: "We are happy to explain anything that is unclear.",
      email: CONTACT.email,
    },
  },
  ar: {
    description: "شروط استخدام IRIS: الحجوزات والأسعار والمدفوعات والإلغاء ووعدنا بإعادة الغسل.",
    label: "قانوني",
    title: "شروط الخدمة",
    lead: "هذه قواعد بسيطة لاستخدام IRIS. توضّح كيف تعمل الحجوزات والمدفوعات ووعدنا، حتى لا تكون هناك مفاجآت لك أو لمحترفينا.",
    tocLabel: "في هذه الصفحة",
    sections: [
      {
        id: "about",
        title: "عن هذه الشروط",
        body: [
          "باستخدامك موقع IRIS أو تطبيقاتها أو إنشائك حساباً أو حجزك غسلة فإنك توافق على هذه الشروط وعلى سياسة الخصوصية. وإذا لم توافق فنرجو عدم استخدام الخدمة.",
          "«IRIS» و«نحن» يعنيان إيريس لغسيل السيارات المتنقل، و«أنت» يعني الشخص الذي يستخدم الخدمة أو يحجز نيابةً عن غيره.",
        ],
      },
      {
        id: "service",
        title: "الخدمة",
        body: [
          "تقدّم IRIS خدمات غسيل السيارات والعناية بها متنقلةً في المكان الذي تختاره داخل مناطق خدمتنا. نستعين بمحترفين موثّقين ومدرَّبين يحضرون معداتهم الخاصة.",
          "يعتمد التوفر على عنوانك والوقت الذي تختاره وتفرّغ المحترفين. وقد نعتذر عن حجز أو نعيد جدولته إذا تعذّر تنفيذه بأمان أو في وقته، وسنخبرك بذلك في أقرب وقت.",
        ],
      },
      {
        id: "account",
        title: "حسابك",
        body: [
          {
            list: [
              "قدّم بيانات صحيحة وحافظ على تحديثها.",
              "حافظ على سرية كلمة مرورك، وأنت مسؤول عما يحدث في حسابك.",
              "يجب ألا يقل عمرك عن 18 عاماً وأن تكون قادراً على إبرام عقد.",
              "قد نوقف أو نغلق حساباً يُستخدم في الاحتيال أو الإساءة أو بما يخالف هذه الشروط.",
            ],
          },
        ],
      },
      {
        id: "bookings",
        title: "إجراء الحجز",
        body: [
          "اختر خدماتك وسيارتك والموعد وأكّد عنوانك. يُعدّ حجزك مؤكداً عندما ترى رسالة التأكيد في التطبيق أو الموقع.",
          "يجب أن يتمكن شخص ما من تمكين محترفنا من الوصول إلى السيارة في الوقت والمكان المحجوزين. وقد يغيّر حجم المركبة وحالتها السعر والوقت اللازم، لذا يرجى اختيار نوع المركبة الصحيح.",
        ],
      },
      {
        id: "prices-payment",
        title: "الأسعار والدفع",
        body: [
          "الأسعار بالريال السعودي وتشمل ضريبة القيمة المضافة ما لم نذكر خلاف ذلك. والسعر الذي تراه قبل التأكيد هو ما تدفعه مقابل ما اخترته.",
          "يمكنك الدفع بالبطاقة أو من رصيد محفظة IRIS أو نقداً حيثما كان ذلك متاحاً. وتُعالَج مدفوعات البطاقات عبر مزوّد الدفع لدينا في نموذج آمن. وإذا فشلت عملية الدفع فقد لا يتأكد الحجز.",
        ],
      },
      {
        id: "memberships",
        title: "المحفظة والعضويات",
        body: [
          "تمنحك العضوية عدداً محدداً من الغسلات تستخدمها خلال مدة محددة. وتظهر الغسلات والمدة وعدد السيارات المشمولة وسعر الغسلات الإضافية على الباقة عند الشراء.",
          "تنتهي الغسلات غير المستخدمة بانتهاء مدة الصلاحية. وما لم يقضِ النظام بخلاف ذلك أو نُبلغك عند الشراء، فلا تُسترد العضويات ولا شحنات المحفظة بعد شرائها.",
        ],
      },
      {
        id: "changes-cancellations",
        title: "التعديل والإلغاء",
        body: [
          "يمكنك تغيير الموعد أو الإلغاء من حسابك دون أي تكلفة حتى ينطلق المحترف إليك. وبعد ذلك قد نفرض رسماً معقولاً لتغطية وقت المحترف وتنقّله.",
          "إذا اضطررنا إلى الإلغاء أو إعادة الجدولة فلن تتحمّل أي رسوم، وسيُعاد أي مبلغ دفعته أو يُحفظ لك رصيداً.",
        ],
      },
      {
        id: "promise",
        title: "وعدنا بإعادة الغسل",
        body: [
          "إذا لم تكن راضياً عن الغسلة فأخبرنا خلال 24 ساعة عبر حسابك أو بالتواصل معنا، وسنرسل محترفاً لإصلاح الأمر دون أي تكلفة.",
          "يشمل الوعد جودة العمل الذي أنجزناه. ولا يشمل الأضرار أو العلامات الموجودة مسبقاً، ولا الحالات التي لا يزيلها الغسيل مثل الخدوش العميقة وتلف الطلاء والبقع الدائمة.",
        ],
      },
      {
        id: "photos",
        title: "صور سيارتك",
        body: [
          "يلتقط محترفونا صور قبل وبعد لسيارتك. تُحفظ في حسابك كسجل للعمل وتُستخدم في مراجعة الجودة وحل الاستفسارات. ونتعامل معها كما هو موضّح في سياسة الخصوصية.",
        ],
      },
      {
        id: "your-responsibilities",
        title: "مسؤولياتك",
        body: [
          {
            list: [
              "أخرج الأشياء الثمينة والأغراض الشخصية من السيارة قبل وصولنا.",
              "تأكد أن الموقع آمن ومسموح لنا بالعمل فيه.",
              "عامل محترفينا باحترام. وقد ننهي الحجز إذا تعرّض المحترف للخطر.",
              "أخبرنا بأي أضرار موجودة مسبقاً أو عناية خاصة تحتاجها سيارتك.",
            ],
          },
        ],
      },
      {
        id: "liability",
        title: "التأمين والمسؤولية",
        body: [
          "سيارتك مغطاة بالتأمين أثناء الغسلة. وإذا ظننت أننا تسبّبنا في ضرر لها فأخبرنا فوراً وأرسل صوراً، وسنتعامل مع المطالبة ضمن هذه التغطية.",
          "وبالقدر الذي يسمح به النظام، لا نتحمّل الخسائر غير المباشرة أو التبعية، وتقتصر مسؤوليتنا الإجمالية عن أي حجز على المبلغ الذي دفعته مقابله. ولا شيء في هذه الشروط يحدّ من أي حق لك بموجب النظام لا يجوز تقييده.",
        ],
      },
      {
        id: "acceptable-use",
        title: "الاستخدام المقبول",
        body: [
          "نرجو عدم إساءة استخدام المنصة: لا احتيال ولا حجوزات وهمية ولا استخراج بيانات آلياً ولا محاولات لتعطيل الخدمة أو إرهاقها ولا استخدامها في أي أمر مخالف للنظام. وقد نحجب الوصول عند حدوث ذلك.",
        ],
      },
      {
        id: "ip",
        title: "محتوانا",
        body: [
          "اسم IRIS وشعارها وتصاميمها ومحتواها ملك لنا أو لمرخّصينا. يمكنك استخدام الموقع والتطبيقات للغرض المخصص لها، ولا يجوز نسخ محتوانا أو إعادة استخدامه دون إذن.",
        ],
      },
      {
        id: "changes",
        title: "تعديل هذه الشروط",
        body: [
          "قد نحدّث هذه الشروط من حين لآخر. وسنُعلمك بالتغييرات المهمة. واستمرارك في استخدام IRIS بعد التعديل يعني قبولك للشروط المحدّثة.",
        ],
      },
      {
        id: "law",
        title: "النظام الحاكم",
        body: [
          "تخضع هذه الشروط لأنظمة المملكة العربية السعودية. وأي نزاع لا نستطيع حلّه معاً تنظره المحاكم المختصة في مدينة الرياض.",
        ],
      },
    ],
    questions: {
      title: "لديك أسئلة عن هذه الشروط؟",
      text: "يسعدنا توضيح أي أمر غير واضح.",
      email: CONTACT.email,
    },
  },
};
