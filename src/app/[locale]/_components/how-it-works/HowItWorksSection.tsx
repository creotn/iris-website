import { howItWorksContent } from "./howItWorks.content";
import HowItWorksShowcase from "./HowItWorksShowcase";
import styles from "./HowItWorksSection.module.css";

export default function HowItWorksSection({ locale }: { locale: Locale }) {
  return (
    <section className={`section ${styles.section}`} id="how-it-works">
      <HowItWorksShowcase content={howItWorksContent[locale]} bookHref={`/${locale}/book/wash`} />
    </section>
  );
}
