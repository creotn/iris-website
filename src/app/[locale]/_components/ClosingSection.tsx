import Image from "next/image";
import Link from "next/link";
import type { HomeContent } from "../(home)/_content";
import StoreBadges from "./StoreBadges";
import styles from "./ClosingSection.module.css";

export default function ClosingSection({
  locale,
  c,
}: {
  locale: Locale;
  c: HomeContent["closing"];
}) {
  return (
    <section className="section">
      <div className="container">
        <div className={styles.panel}>
          <Image
            src="/brand/mascot/chill.svg"
            alt=""
            width={167}
            height={106}
            className={styles.mascot}
          />
          <h2 className={`heading-2 ${styles.title}`}>{c.title}</h2>
          <p className={styles.lead}>{c.lead}</p>
          <div className={styles.actions}>
            <Link href={`/${locale}/book/wash`} className="btn btn-light btn-lg">
              {c.cta}
            </Link>
            <StoreBadges locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
