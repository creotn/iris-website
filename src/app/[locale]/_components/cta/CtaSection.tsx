import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ctaContent, ctaImage } from "./cta.content";
import styles from "./CtaSection.module.css";

export default function CtaSection({ locale }: { locale: Locale }) {
  const { title, description, primary } = ctaContent[locale];
  const lines = title.split("\n");

  return (
    <section className={`section ${styles.section}`} id="get-started">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.bg} aria-hidden="true">
            <div className={styles.waves}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={styles.wave} style={{ "--w": i } as CSSProperties} />
              ))}
            </div>
            <span className={styles.sheen} />
          </div>

          <div className={styles.copy}>
            <h2 className={styles.title}>
              {lines.map((line, i) => (
                <span key={line} className={styles.line} style={{ "--l": i } as CSSProperties}>
                  {line}
                </span>
              ))}
            </h2>
            <p className={styles.description}>{description}</p>

            <div className={styles.actions}>
              <Link href={`/${locale}/book/wash`} className={styles.primary}>
                {primary}
                <svg className={styles.arrow} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          <div className={styles.art}>
            <div className={styles.portrait}>
              <Image src={ctaImage} alt="" width={260} height={260} sizes="260px" className={styles.portraitImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
