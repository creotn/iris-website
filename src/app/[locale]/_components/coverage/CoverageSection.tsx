import { areas, coverageContent } from "./coverage.content";
import CoverageShowcase from "./CoverageShowcase";

export default function CoverageSection({ locale }: { locale: Locale }) {
  return (
    <section className="section" id="coverage">
      <div className="container">
        <CoverageShowcase locale={locale} areas={areas} content={coverageContent[locale]} />
      </div>
    </section>
  );
}
