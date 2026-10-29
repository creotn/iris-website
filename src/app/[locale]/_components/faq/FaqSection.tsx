import { faqContent } from "./faq.content";
import FaqList from "./FaqList";
import SectionHeader from "../shared/SectionHeader";
import styles from "./FaqSection.module.css";

export default function FaqSection({ locale }: { locale: Locale }) {
  const { label, title, items } = faqContent[locale];

  return (
    <section className="section" id="faq">
      <div className="container">
        <SectionHeader label={label} title={title} />
        <div className={styles.wrap}>
          <FaqList items={items} />
        </div>
      </div>
    </section>
  );
}
