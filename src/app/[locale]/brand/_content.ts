// Long-form copy for the brand book. Kept beside the page rather than in locales/{ar,en}.ts
// because those files ship to the browser as the client dictionary; this is read server-side only.

const ar = {
  meta: {
    title: "كتيّب العلامة والمنصة",
    description:
      "دليل هوية ومنصة IRIS الكامل — للمستثمرين والشركاء. Brand & Platform Book v1.0",
  },
  cover: {
    pill: "كتيّب العلامة والمنصة · الإصدار 1.0",
    line1: "لا نغسل فقط.",
    line2Before: "نحن ",
    line2Accent: "IRIS",
    line2After: ".",
    slogan: "عناية فاخرة، من الداخل والخارج — مدعومة بالذكاء الاصطناعي",
    sub: "مغسلة سيارات متنقلة فاخرة، مدعومة بمنصة رقمية وذكاء اصطناعي. هوية مبنية على شخصية لطيفة وبروتوكول صارم.",
    metaWash: "غسيل سيارات متنقل",
    metaKsa: "· مُصمّم للسوق السعودي",
    mascotAlt: "شخصية IRIS",
  },
  contents: {
    kicker: "المحتوى",
    title: "عشرون فصلاً، ثلاثة أجزاء.",
    items: [
      "الفكرة",
      "الشخصية",
      "المزاجات الستة",
      "الشعار",
      "الألوان",
      "الخطوط",
      "النقشة",
      "النبرة",
      "السوق",
      "المنصة",
      "الخدمات",
      "التطبيق واللوحة",
      "الفنّيون",
      "شركاء الأعمال",
      "طبقة الذكاء",
      "البنية التقنية",
      "الجدول الزمني",
      "الميزة التنافسية",
      "التطبيقات",
      "لنبنِ IRIS",
    ],
  },
  parts: {
    brand: {
      title: "البراند",
      text: "الفكرة، الشخصية، واللغة البصرية — الجزء الذي يشعر به العميل قبل أن يقرأ كلمة واحدة.",
    },
    platform: {
      title: "المنصة",
      text: "من الشخصية إلى التقنية — منظومة رقمية متكاملة تُحوّل العناية إلى تجربة قابلة للتوسّع، مدعومة بالذكاء الاصطناعي.",
    },
    world: {
      title: "في الواقع",
      text: "حيث تحطّ الهوية — من المركبة إلى العبوة — والدعوة إلى بنائها.",
    },
  },
  idea: {
    kicker: "جوهر العلامة",
    title: "علامة بريميوم بروح.",
    lead: "شخصية لطيفة تصنع التفاعل، وشعار فاخر يحمل الجدية. التوازن هو القاعدة: الفخامة لا تعني الجمود، واللطافة لا تعني الطفولية. للعلامة وجهان يعملان معاً بانضباط — أحدهما يبني العلاقة، والآخر يحمل الثقة.",
    cards: [
      {
        pill: "الشخصية",
        title: "حيث يُصنع التفاعل",
        text: "السوشيال، الإشعارات، الملصقات، الهدايا، وحالات الطلب. هنا تعيش شخصية IRIS وتبني العلاقة والمرح.",
      },
      {
        pill: "الشعار",
        title: "حيث يُدفع المال",
        text: "الفاتورة، الدفع، التواصل الرسمي وB2B. هنا يحضر الشعار الفاخر وحده — جدية، وضوح، ثقة.",
      },
    ],
  },
  character: {
    kicker: "الشخصية",
    title: "تعرّف على IRIS — كائن العناية.",
    lead: "شخصية لطيفة بروح متوازنة — تفضولية، دقيقة، ودودة. تُجسّد وعد العلامة: «نحن لا نغسل فقط». تعيش في لحظات التفاعل لا في لحظات الدفع.",
    traits: [
      "العينان الواسعتان — انتباه دائم للتفاصيل؛ رمز العناية والدقّة.",
      "زهرة الإيرِس البنفسجية — تاج الشخصية على الرأس؛ مصدر الاسم واللون الأساسي.",
      "القصّات الحادّة — حوافٌ زاويّة مشتقّة من الشعار؛ نفس الحمض النووي البصري.",
    ],
    pills: ["تفضولية", "دقيقة", "ودودة", "متوازنة"],
  },
  moods: {
    kicker: "المزاجات الستة",
    title: "ستة مزاجات = رحلة طلب كاملة.",
    lead: "نظام تعبيري موحّد يربط كل مرحلة من رحلة الطلب بمزاج. لكل حالة في التطبيق مزاجٌ مقابل ونصّ إشعار.",
    items: [
      {
        name: "مُركّز",
        state: "حالة التطبيق · شاشات التحميل والانتظار",
        notification: "نُجهّز طلبك بأدقّ التفاصيل…",
      },
      {
        name: "في الطريق",
        state: "حالة التطبيق · تتبّع الفني والوصول",
        notification: "الفني في الطريق إليك — يصل خلال ١٢ دقيقة",
      },
      {
        name: "التفاصيل",
        state: "حالة التطبيق · مراجعة الخدمة والإضافات",
        notification: "أضف لمسة أخيرة؟ تلميع + عطر IRIS",
      },
      {
        name: "نظيف",
        state: "حالة التطبيق · اكتمال التلميع واللمعان",
        notification: "تمّ التنظيف ✦ سيارتك تلمع الآن",
      },
      {
        name: "منجز",
        state: "حالة التطبيق · تأكيد إتمام الطلب",
        notification: "اكتمل الطلب — نتمنّى لك قيادة مشرقة",
      },
      {
        name: "استرخاء",
        state: "حالة التطبيق · التقييم والمكافآت",
        notification: "قيّم تجربتك واكسب نقاطاً",
      },
    ],
    doTitle: "استخدم الشخصية",
    doText:
      "في السوشيال · الإشعارات · حالات الطلب · الملصقات · الهدايا · لحظات الترحيب والمكافأة.",
    dontTitle: "لا تستخدمها",
    dontText:
      "في الفاتورة · شاشة الدفع · المستندات الرسمية · تواصل B2B. هناك الشعار وحده.",
  },
  logo: {
    kicker: "الشعار",
    title: "شعار مبني على القصّ.",
    lead: "الفراغات الحادة داخل الحروف هي مصدر اللغة البصرية كلها.",
    onLight: "الأساسي · على فاتح",
    onDark: "معكوس · على داكن",
    construction: {
      title: "البناء",
      text: "القصّات القُطرية في حروف I·R·I·S هي البصمة. حافظ على زواياها — لا تُنعّمها ولا تملأها.",
    },
    clearSpace: {
      title: "الهامش الفارغ",
      text: "اترك هامشاً فارغاً لا يقلّ عن ارتفاع حرف الشعار (X) من كل الجهات.",
    },
    minSize: {
      title: "الحد الأدنى",
      text: "لا تستخدمه أصغر — لضمان وضوح القصّات والكلمة.",
    },
    misuseTitle: "سوء الاستخدام — ممنوع",
    misuse: ["تغيير الألوان", "تشويه النِسب", "إدارة الشعار", "تباين منخفض"],
  },
  color: {
    kicker: "نظام الألوان",
    title: "البنفسجي الملكي يقود؛ والمحايدات الباردة تحمل المساحة.",
    names: [
      "البنفسجي الملكي",
      "البنفسجي الداكن",
      "اللافندري الناعم",
      "أبيض",
      "فاتح",
      "رمادي فاتح",
      "رمادي",
      "داكن",
    ],
    usageKicker: "انضباط الاستخدام",
    usageText:
      "الفاتح والأبيض يحملان التخطيط؛ البنفسجي الملكي يقود التفاعل؛ البنفسجي الداكن يثبّت؛ اللافندري والرماديات تُساند.",
  },
  type: {
    kicker: "الخطوط",
    title: "SK Quadratica للشعار، Roboto لكل شيء، وتجوّل للعربية.",
    displayRole: "عرض / الشعار — SK Quadratica",
    displayNote: "مرخّص — للشعار والعرض فقط، لا كنصّ.",
    bodyRole: "نصوص / الواجهة — Roboto",
    arabicRole: "العربية — تجوّل",
    arabicName: "تجوّل",
    scaleKicker: "مقياس الخطوط",
    scaleH2: "عنوان قسم H2 · 32",
    scaleBody: "نص أساسي · 16 — Roboto / تجوّل، مريح للقراءة.",
    pairingKicker: "الاقتران",
    pairingText:
      "يمنح SK Quadratica الشعارَ طابعه الهندسي الحاد. ويتولّى Roboto كامل نصوص الواجهة والمحتوى باللاتينية، بينما يعكسه تجوّل في العربية — نظيف، عصري، وواضح في اللغتين.",
  },
  pattern: {
    kicker: "النقشة",
    title: "النقشة مشتقّة من قصّات الحروف: خطوط قُطرية حادّة بإيقاع ثابت.",
    onDark: "الأساسي · على داكن",
    onLight: "على فاتح",
    onViolet: "على بنفسجي",
    cards: [
      { title: "الزاوية", text: "ثابتة عند 135° — توازي القصّة الأساسية في الشعار." },
      { title: "الإيقاع", text: "تباعد منتظم؛ خفيف كخلفية، أوضح كعنصر بطل." },
      { title: "الاستخدام", text: "العبوات، الخلفيات، الفواصل — لا خلف النصوص المهمة." },
    ],
  },
  voice: {
    kicker: "نبرة العلامة",
    title: "واثقة، دقيقة، ودودة. جُمل قصيرة تتكلم عن العناية لا عن الغسيل.",
  },
  market: {
    kicker: "التحديات وفرصة السوق",
    title: "الغسيل التقليدي يُعاني — والسوق السعودي جاهز للتحوّل الرقمي.",
    stats: [
      "سيارة مسجّلة في المملكة",
      "انتشار الهواتف الذكية",
      "نمو سنوي لسوق الغسيل",
      "رؤية المملكة للتحوّل الرقمي",
    ],
    painKicker: "أربع نقاط ألم في النموذج التقليدي",
    pains: [
      { title: "▪ دفع محدود", text: "الاعتماد على النقد يُبعد العملاء الرقميين." },
      { title: "★ جودة غير موحّدة", text: "غياب التقييم الفوري يُفضي لخدمة متذبذبة." },
      { title: "◎ صعوبة الوصول", text: "التنقّل لمراكز الخدمة يهدر الوقت والوقود." },
      { title: "◷ طوابير الانتظار", text: "ساعات في المحطات التقليدية تُعطّل يوم العميل." },
    ],
  },
  platform: {
    kicker: "منصة Iris",
    title: "منظومة رقمية متكاملة — خمسة مكوّنات، بيئة واحدة.",
    components: [
      { title: "📱 تطبيق الجوال", text: "واجهة العميل — حجز، تتبّع، دفع." },
      { title: "🌐 الموقع الإلكتروني", text: "واجهة العلامة والتسويق." },
      { title: "📊 لوحة التحكم", text: "إدارة وتحليلات لحظية." },
      { title: "⚙ واجهة البرمجة", text: "قلب المنطق والخدمات." },
      { title: "🗄 قاعدة البيانات", text: "مصدر الحقيقة الموحّد." },
    ],
  },
  services: {
    kicker: "الخدمات والباقات",
    title: "باقات مرنة، بروتوكول موحّد — جودة ثابتة في كل غسلة.",
    currency: "ريال",
    bestValue: "الأوفر",
    packages: [
      { name: "غسلة مفردة", term: "/ غسلة · فوري" },
      { name: "باقة 3 غسلات", term: "/ غسلة · شهر" },
      { name: "باقة 6 غسلات", term: "/ غسلة · 3 أشهر" },
      { name: "باقة 12 غسلة", term: "/ غسلة · 6 أشهر" },
    ],
    average: "متوسط السعر المرجّح ≈ 44 ريال / غسلة",
    protocolKicker: "✓ بروتوكول الخدمة الموحّد",
    protocol: [
      {
        title: "المواد",
        text: "مواد كيميائية عالية الجودة، مناشف مايكروفايبر مخصصة بعلامة IRIS™.",
      },
      { title: "الغسيل", text: "شطف خارجي، تنظيف داخلي شامل + شفط، تجفيف احترافي." },
      { title: "التلميع", text: "واكس خارجي، طبقة نانو للزجاج والجلد — خدمة قيمة مضافة." },
      { title: "التقييم", text: "تقييم فوري + عميل خفي أسبوعياً + مؤشرات جودة مباشرة." },
    ],
    future: "التوسّع المستقبلي: تلميع متقدّم · طبقات نانو · إكسسوارات IRIS™.",
  },
  app: {
    kicker: "التطبيق ولوحة التحكم",
    title: "المحوران الرئيسيان للمنصة — حيث تتحوّل المزاجات الستة إلى حالات حقيقية.",
    dashboardStats: ["طلب اليوم", "فنّي نشط", "وسط الاستجابة", "تقييم عام"],
    dashboardText:
      "— إدارة المستخدمين: عملاء، فنّيون، شركاء، مسؤولون · إدارة الطلبات: توزيع لحظي، تتبّع الحالة، سجل كامل · التحليلات: الأداء، الحجوزات، إحصائيات المناطق · لوحة الذكاء: توزيع ذكي، توقع الطلب، تنبيهات الجودة.",
    mobileFeatures: [
      { title: "حجز بالموقع الجغرافي", text: "احجز خدمة في أي مكان بدقّة GPS." },
      { title: "تتبّع الفني مباشرة", text: "خريطة حية من الإرسال حتى الوصول." },
      { title: "إهداء وإحالات", text: "أرسل رصيداً واكسب مكافآت." },
      { title: "دفع إلكتروني متكامل", text: "Apple Pay · STC Pay · الدفع الآجل." },
      { title: "تقييم الفني", text: "تقييم فوري بعد كل خدمة." },
    ],
    note: "كل إشعار وحالة طلب في التطبيق يحملان أحد المزاجات الستة — الشخصية هي لغة الواجهة العاطفية.",
  },
  tech: {
    kicker: "نموذج الفنّيين",
    title: "ثلاثة مسارات — فريق داخلي + مستقلّون موثوقون + موظفو الشركاء.",
    tracks: [
      {
        pill: "داخلي",
        title: "فنّي داخلي",
        text: "يُضاف من قِبَل المسؤول. إنشاء الحساب مع تعيين المنطقة والملف الكامل · وصول فوري من اليوم الأول بدون قائمة انتظار · ورديّات ثابتة + إرسال عند الطلب · KPIs: التقييم، نسبة الإنجاز، وقت الاستجابة.",
      },
      {
        pill: "مستقل",
        title: "فنّي مستقل",
        text: "تسجيل ذاتي — مستقلّون وأصحاب أعمال صغيرة. 1 التسجيل (رفع الهوية الوطنية والشهادات عبر التطبيق) · 2 المراجعة (موافقة المسؤول بعد التحقق) · 3 التأهيل (اختبار معايير الجودة والسلامة) · 4 الانطلاق (قبول الطلبات بالعمولة).",
      },
      {
        pill: "شريك",
        title: "موظف شريك",
        text: "تابع لشركة شريكة — أسطول، فندق، جهة حكومية. مرتبط بـ company_id ويعمل ضمن عقد الشركة · الشركة الشريكة تُدير موظفيها · ملتزم ببروتوكول IRIS وإجراءاته · نفس نظام الـ KPIs — مرئي للشريك والمسؤول.",
      },
    ],
  },
  b2b: {
    kicker: "شركاء الأعمال",
    title: "الشركات والأساطيل والجهات الحكومية — ضمن منصة Iris بعقود مخصصة.",
    segments: [
      { title: "🚚 أساطيل ومركبات", text: "شركات التوصيل، التأجير، الحافلات المدرسية." },
      { title: "🏨 فنادق ومجمعات", text: "فنادق، مراكز تجارية، منتجعات سياحية." },
      { title: "🏛 جهات حكومية", text: "وزارات، بلديات، أجهزة أمنية." },
    ],
    howTitle: "كيف يعمل النموذج؟",
    how: [
      "الشركة تُبرم العقد مع IRIS.",
      "تُفعّل الحساب وتُعيّن فنّيين.",
      "تنفيذ الخدمة (داخلي أو شريك) — كل ذلك ببروتوكول Iris الموحّد.",
    ],
    benefitsTitle: "مزايا الشريك",
    benefits:
      "✓ فاتورة موحّدة شهرية للأسطول بالكامل · ✓ لوحة تحكم مخصصة لمتابعة أسطولها · ✓ أولوية مضمونة في الجدولة · ✓ إحصائيات أداء الفنّيين لكل مركبة · ✓ موظفو الشريك يعملون ببروتوكول IRIS · ✓ تقارير جودة شهرية مفصّلة.",
  },
  ai: {
    kicker: "طبقة الذكاء الاصطناعي",
    title: "الذكاء الاصطناعي يحلّ مشاكل تشغيلية حقيقية — لا منافس يملك هذا.",
    problemLabel: "المشكلة:",
    solutionLabel: "الحل:",
    solutions: [
      {
        title: "التوزيع الذكي",
        problem: "تأخر عامل واحد يُحرّك سلسلة تأخيرات.",
        solution:
          "نموذج ML يُعيّن الفني الأنسب لحظياً بناءً على الموقع، التقييم، الحِمل الحالي، وحركة المرور.",
      },
      {
        title: "توقّع الطلب",
        problem: "تكدّس الطلبات في نوافذ زمنية ضيقة.",
        solution:
          "يتوقع الطلب جغرافياً وزمنياً — يُسبق وضع الفنّيين في المناطق الصحيحة قبل ساعات.",
      },
      {
        title: "تقييم الجودة",
        problem: "بعض العمال يغسلون بطريقتهم دون البروتوكول.",
        solution:
          "يرصد تلقائياً الفنّيين منخفضي التقييم ويُشغّل زيارة ميدانية مفاجئة من المشرف.",
      },
    ],
    plugKicker: "أين يندمج الذكاء في المنصة؟",
    plugs: [
      { title: "تطبيق العميل", text: "«أقرب فنّي في منطقتك خلال 20 دقيقة»." },
      { title: "محرك الإرسال", text: "توزيع لحظي يُحسّن الكفاءة الجغرافية." },
      { title: "لوحة التحكم", text: "تنبيهات استباقية لتراجع الجودة." },
      { title: "تقارير الشركاء", text: "تحليل أداء الأسطول مقارنة بالسوق." },
    ],
  },
  arch: {
    kicker: "البنية التقنية",
    title: "معيارية، قابلة للتوسّع، آمنة — ومُجهَّزة للإنتاج.",
    layers: [
      "طبقة العميل",
      "بوابة الـ API · NestJS",
      "طبقة الذكاء",
      "طبقة الخدمات",
      "طبقة البيانات",
    ],
    tables: "الجداول",
    api: "واجهة البرمجة",
  },
  roadmap: {
    kicker: "الجدول الزمني للتطوير",
    title: "إعادة الاستخدام تُقلّص المدة — نحو 55% من البنية جاهزة للتكييف.",
    lead: "توفير نحو 18 أسبوعاً إضافياً من التطوير عبر تكييف المكوّنات من المشاريع الحالية.",
    sprints: [
      {
        weeks: "أسابيع 1–3",
        text: "إعداد المشروع وترحيل المكوّنات — البيئة، تكييف API، CI/CD، ترحيل المصادقة.",
      },
      {
        weeks: "أسابيع 4–6",
        text: "الحجز الأساسي وكتالوج الباقات — تدفّق الحجز، الباقات الأربع، المواعيد والتوزيع الجغرافي.",
      },
      {
        weeks: "أسابيع 7–9",
        text: "نموذج الفنّيين (3 مسارات) + الشركاء — داخلي + مستقل + شريك، company_id، KPI، لوحة الشريك.",
      },
      {
        weeks: "أسابيع 10–12",
        text: "المدفوعات والمحفظة الإلكترونية — Apple Pay + STC Pay، الدفع الآجل، المحفظة، الإهداء.",
      },
      {
        weeks: "أسابيع 13–15",
        text: "الذكاء الاصطناعي والتتبّع المباشر — Smart Dispatch، Demand Forecast، GPS WebSocket، Firebase.",
      },
      {
        weeks: "أسابيع 16–18",
        text: "لوحة التحكم، الموقع، ضمان الجودة — تكييف لوحة التحكم، موقع Next.js، اختبارات، نشر تجريبي.",
      },
    ],
    summary:
      "18 أسبوعاً إجمالاً · 6 سبرنتات × 3 أسابيع · الفريق: مطوّران + قائد تقني + مهندس جودة · منهجية Agile Scrum",
  },
  edge: {
    kicker: "الميزة التنافسية",
    title: "ما يجعل Iris الخيار الأمثل في السوق السعودي.",
    capability: "الميزة",
    traditional: "تقليدي",
    competitors: "منافسون",
    partial: "جزئية",
    limited: "محدودة",
    rows: [
      "تخصّص حقيقي في غسيل السيارات",
      "خدمة من الباب للباب",
      "بروتوكول موحّد — نفس النتيجة دائماً",
      "باقات مسبقة تُعزّز الولاء",
      "شركاء أعمال B2B — إدارة الأساطيل",
      "ذكاء اصطناعي — توزيع + توقّع طلب",
      "STC Pay والدفع الآجل",
      "تجربة عربية مُحسّنة للسوق السعودي",
      "بنية قابلة للتوسّع — متعددة المدن",
    ],
  },
  applications: {
    kicker: "التطبيقات",
    title: "الهوية على أرض الواقع — من المركبة إلى العبوة.",
    uniformChip: "الزيّ",
    items: [
      { name: "كسوة المركبة", detail: "تغليف العربة — أسود + بنفسجي + قصّات 135°" },
      { name: "زيّ الفنّي", detail: "بولو بنفسجي + كاب، شارة اسم mono" },
      { name: "مناشف المايكروفايبر", detail: "مناشف IRIS™ — جزء من البروتوكول" },
      { name: "عبوات المواد", detail: "المواد والطبقات — ملصقات mono" },
      { name: "العبوة والأغطية", detail: "أغطية المقاعد، علب العدّة، عبوات الهدايا" },
      { name: "ملصقات السوشيال", detail: "المزاجات الستة كملصقات وتفاعلات" },
    ],
  },
  close: {
    pill: "جاهزون؟",
    title: "جاهزون لبناء Iris؟",
    lead: "منصة تقنية متكاملة تُحدث ثورة في غسيل السيارات بالمملكة — بالذكاء الاصطناعي، الراحة، البروتوكول الموحّد، والتحوّل الرقمي الكامل.",
    stats: ["أسبوعاً للإطلاق", "مسارات فنّيين", "باقات خدمة", "مزاجات للشخصية"],
    download: "تحميل الكتيّب (PDF)",
    back: "العودة للموقع",
  },
};

type BrandBookContent = typeof ar;

const en: BrandBookContent = {
  meta: {
    title: "Brand & Platform Book",
    description:
      "The complete IRIS identity & platform guide — for investors and partners. Brand & Platform Book v1.0",
  },
  cover: {
    pill: "Brand & Platform Book · v1.0",
    line1: "We don't just wash.",
    line2Before: "We ",
    line2Accent: "IRIS.",
    line2After: "",
    slogan: "Premium Care, Inside & Out — AI-Powered",
    sub: "A premium mobile car wash, powered by a digital platform and AI. An identity built on a gentle character and a strict protocol.",
    metaWash: "Mobile Car Wash",
    metaKsa: "· Built for the Saudi market",
    mascotAlt: "IRIS mascot",
  },
  contents: {
    kicker: "Contents",
    title: "Twenty chapters, three parts.",
    items: [
      "The Idea",
      "The Character",
      "The Six Moods",
      "The Logo",
      "Color",
      "Typography",
      "Pattern",
      "Voice",
      "Market",
      "Platform",
      "Services",
      "App & Dashboard",
      "Technicians",
      "B2B",
      "AI Layer",
      "Architecture",
      "Roadmap",
      "Competitive Edge",
      "Applications",
      "Build IRIS",
    ],
  },
  parts: {
    brand: {
      title: "The Brand",
      text: "The idea, the character, and the visual language — the part the customer feels before they read a single word.",
    },
    platform: {
      title: "The Platform",
      text: "From character to technology — an integrated digital ecosystem that turns care into a scalable experience, powered by AI.",
    },
    world: {
      title: "In the World",
      text: "Where the identity lands — from the vehicle to the packaging — and the invitation to build it.",
    },
  },
  idea: {
    kicker: "The Idea",
    title: "A premium brand with a soul.",
    lead: "A gentle character creates the interaction; a premium logo carries the seriousness. Balance is the rule: luxury is not coldness, and warmth is not childishness. The brand has two faces that work together with discipline — one builds the relationship, the other carries the trust.",
    cards: [
      {
        pill: "The Character",
        title: "Where interaction is made",
        text: "Social, notifications, stickers, gifts, and order states. This is where the IRIS character lives and builds the relationship and the fun.",
      },
      {
        pill: "The Logo",
        title: "Where money is paid",
        text: "Invoicing, payment, official communication and B2B. Here the premium logo stands alone — seriousness, clarity, trust.",
      },
    ],
  },
  character: {
    kicker: "The Character",
    title: "Meet IRIS — the creature of care.",
    lead: "A gentle, balanced personality — curious, precise, friendly. It embodies the brand promise: ‘we don't just wash’. It lives in moments of interaction, not moments of payment.",
    traits: [
      "Wide eyes — constant attention to detail; a symbol of care and precision.",
      "The purple iris bloom — the crown on its head; source of the name and the primary color.",
      "Sharp cuts — angular edges derived from the logo; the same visual DNA.",
    ],
    pills: ["Curious", "Precise", "Friendly", "Balanced"],
  },
  moods: {
    kicker: "The Six Moods",
    title: "Six moods = one complete order journey.",
    lead: "A unified expressive system that ties every stage of the order to a mood. Each app state has a matching mood and notification voice.",
    items: [
      {
        name: "Focused",
        state: "App state · Loading & waiting screens",
        notification: "Preparing your order to the finest detail…",
      },
      {
        name: "On the way",
        state: "App state · Live tracking & arrival",
        notification: "Your technician is on the way — arriving in 12 min",
      },
      {
        name: "Details",
        state: "App state · Service review & add-ons",
        notification: "One last touch? Polish + IRIS scent",
      },
      {
        name: "Clean",
        state: "App state · Polishing complete & shine",
        notification: "Cleaned ✦ your car is shining now",
      },
      {
        name: "Finished",
        state: "App state · Order completion",
        notification: "Order complete — wishing you a bright drive",
      },
      {
        name: "Relax",
        state: "App state · Rating & rewards",
        notification: "Rate your experience and earn points",
      },
    ],
    doTitle: "Use the character",
    doText:
      "In social, notifications, order states, stickers, gifts, and welcome & reward moments.",
    dontTitle: "Don't use it",
    dontText:
      "In the invoice, payment screen, official documents, or B2B communication. There, the logo stands alone.",
  },
  logo: {
    kicker: "The Logo",
    title: "A logo built on the cut.",
    lead: "The sharp negative spaces inside the letters are the source of the entire visual language.",
    onLight: "Primary · on light",
    onDark: "Reversed · on dark",
    construction: {
      title: "Construction",
      text: "The diagonal cuts inside I·R·I·S are the signature. Keep their angles — never soften or fill them.",
    },
    clearSpace: {
      title: "Clear space",
      text: "Leave clear space of at least one cap-height (X) on all sides.",
    },
    minSize: {
      title: "Minimum size",
      text: "Never smaller — to keep the cuts and wordmark legible.",
    },
    misuseTitle: "Misuse — forbidden",
    misuse: ["recolor", "distort proportions", "rotate", "low contrast"],
  },
  color: {
    kicker: "Color",
    title: "Royal Lavender leads; cool neutrals carry the space.",
    names: [
      "Royal Lavender",
      "Deep Purple",
      "Soft Lavender",
      "White",
      "Light",
      "light Gray",
      "Gray",
      "Dark",
    ],
    usageKicker: "Usage discipline",
    usageText:
      "Light and white carry the layout; Royal Lavender leads interaction; Deep Purple anchors; Soft Lavender and the grays support.",
  },
  type: {
    kicker: "Typography",
    title: "SK Quadratica for the logo, Roboto for everything, Tajawal for Arabic.",
    displayRole: "Display / Logo — SK Quadratica",
    displayNote: "Licensed — logo & display only, never body text.",
    bodyRole: "Body / UI — Roboto",
    arabicRole: "Arabic — Tajawal",
    arabicName: "تجوّل",
    scaleKicker: "Type scale",
    scaleH2: "Section title H2 · 32",
    scaleBody: "Body · 16 — Roboto / Tajawal, comfortable reading.",
    pairingKicker: "The pairing",
    pairingText:
      "SK Quadratica gives the logo its sharp geometric character. Roboto handles all interface and body text in Latin; Tajawal mirrors it in Arabic — clean, modern, and highly legible across both languages.",
  },
  pattern: {
    kicker: "Pattern",
    title: "A pattern derived from the letter cuts: sharp diagonals at a steady rhythm.",
    onDark: "Primary · on dark",
    onLight: "On light",
    onViolet: "On violet",
    cards: [
      { title: "The angle", text: "Fixed at 135° — parallel to the primary cut in the logo." },
      { title: "The rhythm", text: "Even spacing; light as a background, bolder as a hero element." },
      { title: "Usage", text: "Packaging, backgrounds, dividers — never behind important text." },
    ],
  },
  voice: {
    kicker: "Voice & Tone",
    title: "Confident, precise, friendly. Short sentences about care, not washing.",
  },
  market: {
    kicker: "Market & Opportunity",
    title: "Traditional washing is struggling — and the Saudi market is ready to go digital.",
    stats: [
      "Registered cars in the Kingdom",
      "Smartphone penetration",
      "Annual wash-market growth",
      "Vision — digital transformation",
    ],
    painKicker: "Four pain points in the traditional model",
    pains: [
      { title: "▪ Limited payment", text: "Cash dependence pushes away digital customers." },
      { title: "★ Inconsistent quality", text: "No instant rating leads to fluctuating service." },
      { title: "◎ Hard to access", text: "Driving to service centers wastes time and fuel." },
      { title: "◷ Waiting queues", text: "Hours at traditional stations disrupt the customer's day." },
    ],
  },
  platform: {
    kicker: "The IRIS Platform",
    title: "An integrated digital ecosystem — five components, one environment.",
    components: [
      { title: "📱 Mobile App", text: "Customer interface — booking, tracking, payment." },
      { title: "🌐 Website", text: "Brand & marketing front." },
      { title: "📊 Dashboard", text: "Real-time management & analytics." },
      { title: "⚙ API", text: "The heart of logic and services." },
      { title: "🗄 Database", text: "The unified source of truth." },
    ],
  },
  services: {
    kicker: "Services & Packages",
    title: "Flexible packages, one protocol — consistent quality in every wash.",
    currency: "SAR",
    bestValue: "BEST VALUE",
    packages: [
      { name: "Single wash", term: "/ wash · instant" },
      { name: "3-wash pack", term: "/ wash · 1 month" },
      { name: "6-wash pack", term: "/ wash · 3 months" },
      { name: "12-wash pack", term: "/ wash · 6 months" },
    ],
    average: "Weighted average ≈ 44 SAR / wash",
    protocolKicker: "✓ The unified service protocol",
    protocol: [
      {
        title: "Materials",
        text: "High-quality chemicals; dedicated IRIS™ microfiber towels.",
      },
      { title: "Wash", text: "Exterior rinse, full interior cleaning + vacuum, professional drying." },
      { title: "Polish", text: "Exterior wax, nano layer for glass and leather — a value-add service." },
      { title: "Rating", text: "Instant rating + weekly mystery shopper + live quality metrics." },
    ],
    future: "Future expansion: advanced polishing · nano coatings · IRIS™ accessories.",
  },
  app: {
    kicker: "App & Dashboard",
    title: "The two main surfaces — where the six moods become real states.",
    dashboardStats: ["Orders today", "Active techs", "Avg response", "Overall rating"],
    dashboardText:
      "— User management: customers, technicians, partners, admins · Order management: live dispatch, status tracking, full history · Analytics: performance, bookings, regional stats · AI panel: smart dispatch, demand forecast, quality alerts.",
    mobileFeatures: [
      { title: "Geo booking", text: "book anywhere with GPS precision." },
      { title: "Live tracking", text: "a live map from dispatch to arrival." },
      { title: "Gifting & referrals", text: "send credit and earn rewards." },
      { title: "Integrated e-payment", text: "Apple Pay · STC Pay · deferred payment." },
      { title: "Technician rating", text: "instant rating after each service." },
    ],
    note: "Every notification and order state carries one of the six moods — the character is the emotional UI language.",
  },
  tech: {
    kicker: "Technician Model",
    title: "Three tracks — an internal team, trusted freelancers, and partner staff.",
    tracks: [
      {
        pill: "Internal",
        title: "Internal technician",
        text: "Added by the admin. Account created with region & full profile · instant access from day one — no waiting list · fixed shifts + on-demand dispatch · KPIs: rating, completion rate, response time.",
      },
      {
        pill: "External",
        title: "Independent technician",
        text: "Self-registration — freelancers and small businesses. 1 Register (national ID + certificates via the app) · 2 Review (admin approval after verification) · 3 Qualify (quality & safety test) · 4 Go live (accept orders on commission).",
      },
      {
        pill: "Partner",
        title: "Partner employee",
        text: "Belongs to a partner company — fleet, hotel, government body. Linked by company_id, works under the company contract · the partner manages its own staff · bound to the IRIS protocol & standards · same KPI system — visible to partner and admin.",
      },
    ],
  },
  b2b: {
    kicker: "Business Partners",
    title: "Companies, fleets and government — inside the IRIS platform on custom contracts.",
    segments: [
      { title: "🚚 Fleets & vehicles", text: "Delivery companies, rentals, school buses." },
      { title: "🏨 Hotels & complexes", text: "Hotels, malls, tourist resorts." },
      { title: "🏛 Government bodies", text: "Ministries, municipalities, security agencies." },
    ],
    howTitle: "How the model works",
    how: [
      "The company signs a contract with IRIS.",
      "Activate the account and assign technicians.",
      "Service is delivered (internal or partner) — all under the unified IRIS protocol.",
    ],
    benefitsTitle: "Partner benefits",
    benefits:
      "✓ One unified monthly invoice for the whole fleet · ✓ a dedicated dashboard to follow its fleet · ✓ guaranteed scheduling priority · ✓ per-vehicle technician performance stats · ✓ partner staff work under the IRIS protocol · ✓ detailed monthly quality reports.",
  },
  ai: {
    kicker: "AI Layer",
    title: "AI solves real operational problems — no competitor has this.",
    problemLabel: "Problem:",
    solutionLabel: "Solution:",
    solutions: [
      {
        title: "Smart dispatch",
        problem: "one late worker triggers a chain of delays.",
        solution:
          "an ML model assigns the best technician in real time based on location, rating, current load, and traffic.",
      },
      {
        title: "Demand forecasting",
        problem: "orders cluster into narrow time windows.",
        solution:
          "predicts demand by geography and time — pre-positioning technicians in the right areas hours ahead.",
      },
      {
        title: "Quality scoring",
        problem: "some workers wash their own way, off-protocol.",
        solution:
          "automatically flags low-rated technicians and triggers a surprise supervisor field visit.",
      },
    ],
    plugKicker: "Where AI plugs into the platform",
    plugs: [
      { title: "Customer app", text: "‘Nearest technician in your area within 20 minutes.’" },
      { title: "Dispatch engine", text: "Real-time distribution that optimizes geographic efficiency." },
      { title: "Dashboard", text: "Proactive alerts for quality drops." },
      { title: "Partner reports", text: "Fleet performance analysis vs the market." },
    ],
  },
  arch: {
    kicker: "Technical Architecture",
    title: "Modular, scalable, secure — and production-ready.",
    layers: [
      "Client layer",
      "API gateway · NestJS",
      "AI layer",
      "Services layer",
      "Data layer",
    ],
    tables: "tables",
    api: "API",
  },
  roadmap: {
    kicker: "Development Roadmap",
    title: "Reuse cuts the timeline — ~55% of the infrastructure is ready to adapt.",
    lead: "Saving ~18 extra weeks of development by adapting components from existing projects.",
    sprints: [
      {
        weeks: "wk 1–3",
        text: "Project setup & component migration — environment, API adaptation, CI/CD, auth migration.",
      },
      {
        weeks: "wk 4–6",
        text: "Core booking & package catalog — booking flow, the four packages, scheduling & geo-dispatch.",
      },
      {
        weeks: "wk 7–9",
        text: "Technician model (3 tracks) + partners — internal/external/partner, company_id, KPIs, partner dashboard.",
      },
      {
        weeks: "wk 10–12",
        text: "Payments & e-wallet — Apple Pay + STC Pay, deferred payment, wallet, gifting.",
      },
      {
        weeks: "wk 13–15",
        text: "AI & live tracking — Smart Dispatch, Demand Forecast, GPS WebSocket, Firebase.",
      },
      {
        weeks: "wk 16–18",
        text: "Dashboard, website, QA — dashboard adaptation, Next.js site, tests, pilot deployment.",
      },
    ],
    summary:
      "18 weeks total · 6 sprints × 3 weeks · Team: 2 devs + tech lead + QA engineer · Agile Scrum",
  },
  edge: {
    kicker: "Competitive Edge",
    title: "What makes IRIS the optimal choice in the Saudi market.",
    capability: "Capability",
    traditional: "Traditional",
    competitors: "Competitors",
    partial: "partial",
    limited: "limited",
    rows: [
      "True car-wash specialization",
      "Door-to-door service",
      "Unified protocol — same result every time",
      "Prepaid packages that build loyalty",
      "B2B — fleet management",
      "AI — dispatch + demand forecast",
      "STC Pay & deferred payment",
      "Arabic experience tuned for the Saudi market",
      "Scalable, multi-city architecture",
    ],
  },
  applications: {
    kicker: "Applications",
    title: "The identity on the ground — from the vehicle to the packaging.",
    uniformChip: "Uniform",
    items: [
      { name: "Vehicle livery", detail: "Van wrap — ink + violet + 135° cuts" },
      { name: "Technician uniform", detail: "Violet polo + cap, mono name tag" },
      { name: "Microfiber towels", detail: "Branded IRIS™ towels — part of the protocol" },
      { name: "Product bottles", detail: "Chemicals & coatings — mono labels" },
      { name: "Packaging & covers", detail: "Seat covers, kit boxes, gift packs" },
      { name: "Social stickers", detail: "The six moods as stickers & reactions" },
    ],
  },
  close: {
    pill: "Ready?",
    title: "Ready to build IRIS?",
    lead: "An integrated tech platform that revolutionizes car washing in the Kingdom — with AI, convenience, a unified protocol, and full digital transformation.",
    stats: ["weeks to launch", "technician tracks", "service packages", "character moods"],
    download: "Download the Book (PDF)",
    back: "Back to site",
  },
};

export type { BrandBookContent };

export function getBrandBookContent(locale: Locale): BrandBookContent {
  return locale === "en" ? en : ar;
}
