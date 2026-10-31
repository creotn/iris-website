import { IconCheck, IconMapPin } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { HomeContent } from "../(home)/_content";
import StoreBadges from "./StoreBadges";
import styles from "./HeroSection.module.css";

export default function HeroSection({
  locale,
  c,
}: {
  locale: Locale;
  c: HomeContent["hero"];
}) {
  return (
    <section className={styles.hero}>
      <div className="iris-pattern" />

      <div className={`container ${styles.inner}`}>
        <div>
          <h1 className={`heading-1 ${styles.title}`}>{c.title}</h1>
          <p className={styles.lead}>{c.lead}</p>

          <div className={styles.actions}>
            <Link href={`/${locale}/book/wash`} className="btn btn-light btn-lg">
              {c.cta}
            </Link>
            <p className={styles.area}>
              <IconMapPin size={18} stroke={1.75} aria-hidden />
              {c.area}
            </p>
          </div>

          <StoreBadges locale={locale} />
        </div>

        <div className={styles.visual}>
          <Image
            src="/brand/mascot/peek.svg"
            alt=""
            width={151}
            height={94}
            loading="eager"
            className={styles.mascot}
          />
          <section className={styles.ticket} aria-label={c.ticket.label}>
            <p className={styles.service}>{c.ticket.service}</p>
            <ol className={styles.stages}>
              {c.ticket.stages.map((stage, index) => (
                <li
                  key={stage}
                  className={styles.stage}
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className={styles.dot} aria-hidden>
                    <IconCheck size={14} stroke={3} />
                  </span>
                  {stage}
                </li>
              ))}
            </ol>
            <p className={styles.note}>{c.ticket.note}</p>
          </section>
        </div>
      </div>
    </section>
  );
}
