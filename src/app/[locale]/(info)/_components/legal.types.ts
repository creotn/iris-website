export type LegalBlock = string | { list: string[] };

export type LegalSection = { id: string; title: string; body: LegalBlock[] };

export type LegalContent = {
  description: string;
  label: string;
  title: string;
  lead: string;
  tocLabel: string;
  sections: LegalSection[];
  questions: { title: string; text: string; email: string };
};
