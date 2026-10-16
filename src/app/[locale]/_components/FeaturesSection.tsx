import {
  IconChartBar,
  IconCreditCard,
  IconDeviceMobile,
  IconLeaf,
  IconMapPin,
  IconStar,
} from "@tabler/icons-react";
import { getScopedI18n } from "@/locales/server";
import SectionHeader from "./SectionHeader";
import styles from "./FeaturesSection.module.css";

export default async function FeaturesSection() {
  const t = await getScopedI18n("features");

  const features = [
    { Icon: IconDeviceMobile, title: t("bookTitle"), desc: t("bookDesc") },
    { Icon: IconMapPin, title: t("trackingTitle"), desc: t("trackingDesc") },
    { Icon: IconStar, title: t("prosTitle"), desc: t("prosDesc") },
    { Icon: IconCreditCard, title: t("paymentsTitle"), desc: t("paymentsDesc") },
    { Icon: IconChartBar, title: t("earningsTitle"), desc: t("earningsDesc") },
    { Icon: IconLeaf, title: t("ecoTitle"), desc: t("ecoDesc") },
  ];

  return (
    <section className="section" id="features">
      <div className="container">
        <SectionHeader
          label={t("label")}
          title={t("title")}
          description={t("description")}
        />

        <div className={styles.grid}>
          {features.map(({ Icon, title, desc }, index) => (
            <div
              key={title}
              className={`card card-glow animate-in animate-delay-${(index % 3) + 1}`}
            >
              <div className={styles.icon}>
                <Icon size={24} stroke={1.75} />
              </div>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.desc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
