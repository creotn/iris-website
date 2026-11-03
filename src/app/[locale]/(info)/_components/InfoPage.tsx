import styles from "./InfoPage.module.css";

export function InfoHero({ label, title, lead }: { label: string; title: string; lead: string }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.heroInner}`}>
        <span className={`label ${styles.heroLabel}`}>{label}</span>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroLead}>{lead}</p>
      </div>
    </section>
  );
}
