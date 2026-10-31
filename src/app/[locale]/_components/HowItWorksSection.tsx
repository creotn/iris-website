import Image from "next/image";
import type { HomeContent } from "../(home)/_content";
import styles from "./HowItWorksSection.module.css";

export default function HowItWorksSection({ c }: { c: HomeContent["how"] }) {
  return (
    <section className={`section ${styles.band}`} id="how-it-works">
      <div className="container">
        <h2 className={`heading-2 ${styles.heading}`}>{c.title}</h2>

        <ol className={styles.steps}>
          {c.steps.map((step) => (
            <li key={step.art} className={styles.step}>
              <div className={styles.art}>
                <Image
                  src={`/brand/mascot/${step.art}.svg`}
                  alt=""
                  width={170}
                  height={118}
                  className={styles.mascot}
                />
              </div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.text}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
