import Image from "next/image";
import { getScopedI18n } from "@/locales/server";
import { fetchBookableServices } from "@/api/PricingAPI";
import HeroBookingBar from "./HeroBookingBar";
import HeroVideo from "./HeroVideo";
import styles from "./HeroSection.module.css";

const formatAmount = (value: string | number) => {
  const n = Number(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

export default async function HeroSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("hero");
  const services = await fetchBookableServices();

  const fields = [
    ...(services.length > 0
      ? [
          {
            id: "package",
            label: t("packageLabel"),
            options: services.map((service) => ({
              value: service.pubkey,
              label: service.title?.[locale] ?? service.title?.ar ?? service.title?.en ?? "",
              price: t("priceValue", { price: formatAmount(service.indicativePriceAfterTax ?? 0) }),
            })),
          },
        ]
      : []),
    {
      id: "when",
      label: t("whenLabel"),
      options: [
        { value: "now", label: t("whenNow") },
        { value: "later", label: t("whenLater") },
      ],
    },
  ];

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.media} aria-hidden="true">
        <HeroVideo />
        <div className={styles.overlay} />
      </div>

      <div className={`container ${styles.inner}`}>
        <h1 className={styles.title}>
          {t("titleStart")} <span className={styles.titleEnd}>{t("titleEnd")}</span>
        </h1>
        <p className={styles.description}>{t("description")}</p>
      </div>

      {/* The booking strip is glued to the bottom edge of the hero. */}
      <div className={styles.strip}>
        <div className={`container ${styles.stripInner}`}>
          <Image src="/brand/mascot/thumbs-up.svg" alt="" aria-hidden="true" width={143} height={116} className={styles.mascot} />
          <HeroBookingBar
            bookHref={`/${locale}/book/wash`}
            bookLabel={t("bookNow")}
            groupLabel={t("bookingBarLabel")}
            priceLabel={t("priceLabel")}
            fields={fields}
          />
        </div>
      </div>
    </section>
  );
}
