import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className={`${styles.header} animate-in`}>
      <span className={`label ${styles.label}`}>{label}</span>
      <h2 className={`heading-2 ${styles.title}`}>{title}</h2>
      {description && <p className="body-lg">{description}</p>}
    </div>
  );
}
