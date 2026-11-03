export type Area = { name: { en: string; ar: string }; lat: number; lng: number };

export const areas: Area[] = [
  { name: { en: "Al Olaya", ar: "العليا" }, lat: 24.6955, lng: 46.685 },
  { name: { en: "Al Malqa", ar: "الملقا" }, lat: 24.813, lng: 46.6 },
  { name: { en: "Al Yasmin", ar: "الياسمين" }, lat: 24.823, lng: 46.638 },
  { name: { en: "Hittin", ar: "حطين" }, lat: 24.77, lng: 46.59 },
  { name: { en: "Al Nakheel", ar: "النخيل" }, lat: 24.748, lng: 46.627 },
  { name: { en: "Al Sahafa", ar: "الصحافة" }, lat: 24.8, lng: 46.637 },
  { name: { en: "King Fahd", ar: "الملك فهد" }, lat: 24.737, lng: 46.66 },
  { name: { en: "Al Wurud", ar: "الورود" }, lat: 24.711, lng: 46.683 },
  { name: { en: "Diplomatic Quarter", ar: "الحي الدبلوماسي" }, lat: 24.687, lng: 46.624 },
];

export type CoverageContent = {
  title: string;
  titleAccent: string;
  description: string;
  mapLabel: string;
  question: string;
  subtitle: string;
  inputLabel: string;
  placeholder: string;
  hint: string;
  yes: string;
  yesText: string;
  book: string;
  no: string;
  noText: string;
};

export const coverageContent: Record<"ar" | "en", CoverageContent> = {
  en: {
    title: "We come to you across",
    titleAccent: "Riyadh",
    description: "Tap any district to see it on the map. Check that your district is covered before you book, and we keep adding districts.",
    mapLabel: "Map of the Riyadh neighbourhoods we serve",
    question: "Do we cover your district?",
    subtitle: "We keep adding districts across Riyadh.",
    inputLabel: "Your district",
    placeholder: "Type your district",
    hint: "Type your district, or pick it from the list.",
    yes: "Yes,",
    yesText: "we come to {name}.",
    book: "Book a wash",
    no: "Not yet.",
    noText: "We keep adding districts, so check again soon."
  },
  ar: {
    title: "نأتي إليك في",
    titleAccent: "الرياض",
    description: "اضغط على أي حي لتراه على الخريطة. تأكد من أن حيّك ضمن مناطق خدمتنا قبل الحجز، ونضيف أحياء جديدة باستمرار.",
    mapLabel: "خريطة أحياء الرياض التي نخدمها",
    question: "هل نصل إلى حيّك؟",
    subtitle: "نضيف أحياء جديدة في الرياض باستمرار.",
    inputLabel: "حيّك",
    placeholder: "اكتب اسم حيّك",
    hint: "اكتب اسم حيّك أو اختره من القائمة.",
    yes: "نعم،",
    yesText: "نأتي إليك في {name}.",
    book: "احجز غسلة",
    no: "ليس بعد.",
    noText: "نضيف أحياء جديدة باستمرار، تحقّق مرة أخرى قريباً."
  }
};
