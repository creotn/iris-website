import clsx from "clsx";
import Link from "next/link";
import { getScopedI18n } from "@/locales/server";
import { BookWashScreen, EarningsScreen } from "./MockupScreens";
import SectionHeader from "./SectionHeader";
import styles from "./AppsSection.module.css";

export default async function AppsSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("apps");

  const showcases = [
    {
      badge: t("customerBadge"),
      badgeClass: "badge-accent",
      title: t("customerTitle"),
      desc: t("customerDesc"),
      points: [
        t("customerPoint1"),
        t("customerPoint2"),
        t("customerPoint3"),
        t("customerPoint4"),
      ],
      screen: <BookWashScreen duration={5} />,
      cta: { href: `/${locale}/customer`, label: t("viewCustomer") },
      reverse: false,
    },
    {
      badge: t("proBadge"),
      badgeClass: "badge-success",
      title: t("proTitle"),
      desc: t("proDesc"),
      points: [t("proPoint1"), t("proPoint2"), t("proPoint3"), t("proPoint4")],
      screen: <EarningsScreen delay={0.5} duration={5} />,
      cta: null,
      reverse: true,
    },
  ];

  return (
    <section className="section" id="apps">
      <div className="container">
        <SectionHeader
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />

        {showcases.map((showcase) => (
          <div
            key={showcase.title}
            className={clsx(
              styles.showcase,
              showcase.reverse && styles.reverse,
              "animate-in",
            )}
          >
            <div className={styles.content}>
              <span className={`badge ${showcase.badgeClass}`}>
                {showcase.badge}
              </span>
              <h3 className={`heading-3 ${styles.title}`}>{showcase.title}</h3>
              <p className="body-md">{showcase.desc}</p>
              <ul className={styles.points}>
                {showcase.points.map((point) => (
                  <li key={point}>
                    <span className={styles.check}>✓</span>
                    <span className={styles.pointText}>{point}</span>
                  </li>
                ))}
              </ul>
              {showcase.cta && (
                <Link href={showcase.cta.href} className={`btn btn-primary ${styles.cta}`}>
                  {showcase.cta.label}
                </Link>
              )}
            </div>
            <div className={styles.visual}>{showcase.screen}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
