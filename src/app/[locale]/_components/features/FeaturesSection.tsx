import type { CSSProperties } from "react";
import { getScopedI18n } from "@/locales/server";
import { features } from "./features.content";
import SectionHeader from "../shared/SectionHeader";
import styles from "./FeaturesSection.module.css";

export default async function FeaturesSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("features");

  return (
    <section className={`section ${styles.section}`} id="features">
      <div className="container">
        <SectionHeader title={t("title")} description={t("description")} />

        <ul className={styles.grid}>
          {features.map(({ icon: Icon, title, desc }, index) => (
            <li key={title.en} className={styles.cell} style={{ "--i": index } as CSSProperties}>
              <span className={styles.icon} aria-hidden="true">
                <Icon size={44} stroke={1.5} />
              </span>
              <h3 className={styles.title}>{title[locale]}</h3>
              {desc && <p className={styles.desc}>{desc[locale]}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
