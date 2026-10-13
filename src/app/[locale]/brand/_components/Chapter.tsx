import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./BrandBook.module.css";

export function Chapter({
  id,
  num,
  kicker,
  title,
  lead,
  alt = false,
  children,
}: {
  id: string;
  num: string;
  kicker: string;
  title: string;
  lead?: string;
  alt?: boolean;
  children?: ReactNode;
}) {
  return (
    <section id={id} className={clsx(styles.section, alt && styles.sectionAlt)}>
      <div className={styles.wrap}>
        <div className={styles.kicker}>
          <span className={styles.num}>{num}</span>
          <span>{kicker}</span>
        </div>
        <h2 className={styles.title}>{title}</h2>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function PartDivider({
  id,
  number,
  title,
  text,
}: {
  id: string;
  number: string;
  title: string;
  text: string;
}) {
  return (
    <section id={id} className={styles.part}>
      <div className="iris-pattern-strong" />
      <div className={styles.wrap}>
        <div className={styles.partNumber}>{number}</div>
        <h2 className={styles.partTitle}>{title}</h2>
        <p className={styles.partText}>{text}</p>
      </div>
    </section>
  );
}
