import type { HomeContent } from "../(home)/_content";
import SectionHeader from "./SectionHeader";
import styles from "./WhySection.module.css";

export default function WhySection({ c }: { c: HomeContent["why"] }) {
  return (
    <section className="section" id="why-iris">
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <SectionHeader title={c.title} description={c.lead} />
        </div>

        <dl>
          {c.reasons.map((reason) => (
            <div key={reason.title} className={styles.reason}>
              <dt className={styles.title}>{reason.title}</dt>
              <dd className={styles.text}>{reason.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
