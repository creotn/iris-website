import Image from "next/image";
import Link from "next/link";
import { BRAND_BOOK_PDF } from "@/config/brand";
import { getScopedI18n } from "@/locales/server";
import styles from "./BrandBookSection.module.css";

export default async function BrandBookSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("brandBook");

  const moods = [
    { src: "mood-0-focused.png", width: 496, height: 238, label: t("moodFocused") },
    { src: "mood-1-ontheway.png", width: 552, height: 253, label: t("moodOnTheWay") },
    { src: "mood-2-details.png", width: 558, height: 253, label: t("moodDetails") },
    { src: "mood-3-clean.png", width: 546, height: 253, label: t("moodClean") },
    { src: "mood-4-finished.png", width: 552, height: 288, label: t("moodFinished") },
    { src: "mood-5-relax.png", width: 552, height: 288, label: t("moodRelax") },
  ];

  return (
    <section className={`section section-alt ${styles.section}`} id="brandbook">
      <div className="iris-pattern" />

      <div className={`container ${styles.inner} animate-in`}>
        <div className={styles.moods}>
          {moods.map((mood) => (
            <Image
              key={mood.src}
              src={`/brand/moods/${mood.src}`}
              alt={mood.label}
              title={mood.label}
              width={mood.width}
              height={mood.height}
              sizes="104px"
              className={styles.mood}
            />
          ))}
        </div>

        <span className={styles.kicker}>{t("kicker")}</span>
        <h2 className="heading-2">{t("title")}</h2>
        <p className={`body-lg ${styles.description}`}>{t("description")}</p>

        <div className={styles.actions}>
          <Link href={`/${locale}/brand`} className="btn btn-primary btn-lg">
            {t("open")}
          </Link>
          <a href={BRAND_BOOK_PDF} download className="btn btn-secondary btn-lg">
            {t("download")}
          </a>
        </div>
      </div>
    </section>
  );
}
