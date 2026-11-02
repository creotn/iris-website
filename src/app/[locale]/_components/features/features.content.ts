import {
  IconCreditCard,
  IconUsers,
  IconWallet,
  type Icon,
} from "@tabler/icons-react";

export type Feature = {
  icon: Icon;
  title: { ar: string; en: string };
  desc?: { ar: string; en: string };
};

export const features: Feature[] = [
  {
    icon: IconCreditCard,
    title: { en: "Clear pricing by car size", ar: "سعر واضح حسب حجم سيارتك" },
    desc: { en: "Pick sedan, SUV or van and see the final price, VAT included, before you confirm.", ar: "اختر سيدان أو دفع رباعي أو فان، وشاهد السعر النهائي شاملاً الضريبة قبل التأكيد." },
  },
  {
    icon: IconUsers,
    title: { en: "Several cars, one visit", ar: "أكثر من سيارة، زيارة واحدة" },
    desc: { en: "Add the family's cars to the same visit, or share it with neighbours for a lower price per car.", ar: "أضف سيارات العائلة إلى الزيارة نفسها، أو شاركها مع جيرانك بسعر أقل للسيارة." },
  },
  {
    icon: IconWallet,
    title: { en: "Wallet, memberships and gifts", ar: "المحفظة والعضويات والهدايا" },
    desc: { en: "Top up your balance, take a membership, or gift a wash to any phone number.", ar: "اشحن رصيدك أو اشترك في عضوية، أو أهدِ غسلة لأي رقم جوال." },
  },
];
