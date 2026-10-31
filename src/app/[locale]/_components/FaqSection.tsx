import { IconChevronDown } from "@tabler/icons-react";
import type { HomeContent } from "../(home)/_content";
import SectionHeader from "./SectionHeader";
import styles from "./FaqSection.module.css";

export default function FaqSection({ c }: { c: HomeContent["faq"] }) {
  return (
    <section className="section section-alt" id="faq">
      <div className={`container ${styles.layout}`}>
        <SectionHeader title={c.title} />

        <div>
          {c.items.map((item) => (
            <details key={item.question} className={styles.item} name="faq">
              <summary className={styles.question}>
                {item.question}
                <IconChevronDown className={styles.chevron} size={20} stroke={2} aria-hidden />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
