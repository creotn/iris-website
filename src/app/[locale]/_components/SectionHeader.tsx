import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className={styles.header}>
      <h2 className={`heading-2 ${styles.title}`}>{title}</h2>
      {description && <p className="body-lg">{description}</p>}
    </div>
  );
}
