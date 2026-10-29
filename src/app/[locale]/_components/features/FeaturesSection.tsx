import Image from "next/image";
import type { CSSProperties } from "react";
import { getScopedI18n } from "@/locales/server";
import { features } from "./features.content";
import SectionHeader from "../shared/SectionHeader";
import SpotlightGrid from "../shared/SpotlightGrid";
import styles from "./FeaturesSection.module.css";

export default async function FeaturesSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("features");

  return (
    <section className={`section ${styles.section}`} id="features">
      <div className={styles.glow} aria-hidden="true" />
      <div className="container">
        <SectionHeader label={t("label")} title={t("title")} description={t("description")} />

        <SpotlightGrid className={styles.grid}>
          {features.map(({ icon: Icon, image, title, desc }, index) => (
            <li
              key={image}
              className={styles.card}
              data-spotlight
              style={{ "--i": index % 3 } as CSSProperties}
            >
              <div className={styles.media}>
                <span className={styles.index} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.parallax}>
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                    className={styles.image}
                  />
                </div>
              </div>

              <div className={styles.body}>
                <span className={styles.icon} aria-hidden="true">
                  <Icon size={22} stroke={1.75} />
                </span>
                <h3 className={styles.title}>{title[locale]}</h3>
                {desc && <p className={styles.desc}>{desc[locale]}</p>}
              </div>
            </li>
          ))}
        </SpotlightGrid>
      </div>
    </section>
  );
}
