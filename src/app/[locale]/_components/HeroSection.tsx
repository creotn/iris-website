import Link from "next/link";
import { getScopedI18n } from "@/locales/server";
import HeroBookingBar from "./HeroBookingBar";
import styles from "./HeroSection.module.css";

const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const pinIcon = (
  <svg {...iconProps}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const sparkIcon = (
  <svg {...iconProps}>
    <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    <path d="M19 17v4m-2-2h4" />
  </svg>
);
const clockIcon = (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export default async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("hero");

  const fields = [
    {
      id: "where",
      label: t("whereLabel"),
      icon: pinIcon,
      options: [
        { value: "olaya", label: t("areaOlaya") },
        { value: "malqa", label: t("areaMalqa") },
        { value: "narjis", label: t("areaNarjis") },
        { value: "yasmin", label: t("areaYasmin") },
      ],
    },
    {
      id: "package",
      label: t("packageLabel"),
      icon: sparkIcon,
      options: [
        { value: "express", label: t("packageExpress") },
        { value: "premium", label: t("packagePremium") },
        { value: "detail", label: t("packageDetail") },
      ],
    },
    {
      id: "when",
      label: t("whenLabel"),
      icon: clockIcon,
      options: [
        { value: "today", label: t("whenToday") },
        { value: "tomorrow", label: t("whenTomorrow") },
        { value: "weekend", label: t("whenWeekend") },
      ],
    },
  ];

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.media} aria-hidden="true">
        <video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlayBase} />
        <div className={styles.overlayTint} />
        <div className={styles.overlayShade} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={`${styles.line} ${styles.line1}`}>{t("titleLine1")}</span>
            <span className={`${styles.line} ${styles.line2}`}>{t("titleLine2")}</span>
          </h1>

          <p className={styles.description}>{t("description")}</p>

          <div className={styles.actions}>
            <Link href={`/${locale}/book/wash`} className={styles.primaryBtn}>
              {t("primaryCta")}
            </Link>
            <a href="#pricing" className={styles.ghostBtn}>
              {t("secondaryCta")}
            </a>
          </div>
        </div>

        <div className={styles.barWrap}>
          <HeroBookingBar bookHref={`/${locale}/book/wash`} bookLabel={t("bookNow")} fields={fields} />
        </div>
      </div>
    </section>
  );
}
