import { getScopedI18n } from "@/locales/server";
import SectionHeader from "./SectionHeader";
import styles from "./HowItWorksSection.module.css";

export default async function HowItWorksSection() {
  const t = await getScopedI18n("howItWorks");

  const steps = [
    { title: t("step1Title"), desc: t("step1Desc") },
    { title: t("step2Title"), desc: t("step2Desc") },
    { title: t("step3Title"), desc: t("step3Desc") },
    { title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <section className="section section-alt" id="how-it-works">
      <div className="container">
        <SectionHeader label={t("label")} title={t("title")} />

        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={`${styles.step} animate-in animate-delay-${index + 1}`}
            >
              <div className={styles.number}>{index + 1}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
