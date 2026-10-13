import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getScopedI18n } from "@/locales/server";
import { CustomerHomeScreen, ProDashboardScreen } from "./MockupScreens";
import styles from "./HeroSection.module.css";

export default async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("hero");

  const stats = [
    { value: 4, label: t("statPackages") },
    { value: 3, label: t("statTracks") },
    { value: 18, unit: t("statWeeksUnit"), label: t("statLaunch") },
  ];

  return (
    <section className={styles.hero} id="hero">
      <div className="grid-bg" />
      <div className="iris-pattern" />
      <div className={`glow-orb ${styles.orb1}`} />
      <div className={`glow-orb ${styles.orb2}`} />

      <div className={`container ${styles.inner}`}>
        <div className={`${styles.content} animate-in`}>
          <div className={`badge badge-accent ${styles.badge}`}>
            <span className={styles.dot} />
            <span>{t("badge")}</span>
          </div>

          <h1 className={`heading-1 ${styles.title}`}>
            {t("titleLine1")}
            <br />
            <span className="gradient-text">{t("titleLine2")}</span>
          </h1>

          <p className={styles.description}>{t("description")}</p>

          <div className={styles.actions}>
            <Link href={`/${locale}/sign-in`} className="btn btn-primary btn-lg">
              {t("primaryCta")}
            </Link>
            <a href="#apps" className="btn btn-secondary btn-lg">
              {t("secondaryCta")}
            </a>
          </div>

          <div className={styles.stats}>
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={styles.stat}
                style={{ "--target": stat.value, "--i": index } as CSSProperties}
              >
                <div className={styles.statValue}>
                  <span className={styles.counter} aria-hidden="true" />
                  <span className={styles.srOnly}>{stat.value}</span>
                  {stat.unit && <span className={styles.statUnit}>{stat.unit}</span>}
                </div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.visual} animate-in animate-delay-2`}>
          <Image
            src="/brand/iris-mascot.png"
            alt={t("mascotAlt")}
            width={490}
            height={895}
            priority
            sizes="128px"
            className={styles.mascot}
          />
          <div className={styles.phones}>
            <CustomerHomeScreen />
            <div className={styles.phoneOffset}>
              <ProDashboardScreen delay={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
