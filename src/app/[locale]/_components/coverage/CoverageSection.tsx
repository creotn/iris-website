import { areas, coverageContent } from "./coverage.content";
import CoverageShowcase from "./CoverageShowcase";
import styles from "./CoverageSection.module.css";

export default function CoverageSection({ locale }: { locale: Locale }) {
  return (
    <section className={`section ${styles.section}`} id="coverage">
      <CoverageShowcase locale={locale} areas={areas} content={coverageContent[locale]} />
    </section>
  );
}
