import Image from "next/image";
import type { CSSProperties } from "react";
import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import coverage from "../_components/coverage/CoverageSection.module.css";
import cta from "../_components/cta/CtaSection.module.css";
import faq from "../_components/faq/FaqSection.module.css";
import features from "../_components/features/FeaturesSection.module.css";
import hero from "../_components/hero/HeroSection.module.css";
import how from "../_components/how-it-works/HowItWorksSection.module.css";
import pricing from "../_components/pricing/PricingSection.module.css";
import header from "../_components/shared/SectionHeader.module.css";
import styles from "./loading.module.css";

// The sections reuse their real layout classes (and ids, which carry their backgrounds),
// so the skeleton sits exactly where the content will land, at every breakpoint.
export default function Loading() {
  return (
    <SkeletonScreen>
      <div className="alternating-sections">
        <section className={hero.hero}>
          <div className={hero.media} aria-hidden="true">
            <div className={hero.overlay} />
          </div>

          <div className={`container ${hero.inner}`}>
            {/* em sizes follow the real title and description fonts. */}
            <div className={`${hero.title} ${styles.lines}`}>
              <Skeleton width="92%" height="0.8em" tone="onDark" />
              <Skeleton width="64%" height="0.8em" tone="onDark" />
            </div>
            <div className={`${hero.description} ${styles.textLines}`}>
              <Skeleton height="1em" tone="onDark" />
              <Skeleton width="86%" height="1em" tone="onDark" />
            </div>
          </div>

          <div className={hero.strip}>
            <div className={`container ${hero.stripInner}`}>
              <Image src="/brand/mascot/thumbs-up.svg" alt="" aria-hidden="true" width={143} height={116} className={hero.mascot} />
              <div className={hero.bar} style={{ "--fields": 3 } as CSSProperties}>
                {["70%", "55%", "45%"].map((w, i) => (
                  <div key={i} className={hero.field}>
                    <div className={hero.fieldText}>
                      <Skeleton width="56px" height="13px" tone="onDark" />
                      <Skeleton width={w} height="20px" tone="onDark" />
                    </div>
                  </div>
                ))}
                <Skeleton width="200px" height="64px" radius="lg" tone="onDark" className={styles.bookButton} />
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${features.section}`} id="features">
          <div className="container">
            <SectionHead />
            <ul className={features.grid}>
              {[0, 1, 2].map((i) => (
                <li key={i} className={styles.feature}>
                  <Skeleton width="48px" height="48px" radius="md" className={styles.featureIcon} />
                  <Skeleton width="62%" height="22px" />
                  <div className={styles.featureDesc}>
                    <Skeleton height="14px" />
                    <Skeleton width="72%" height="14px" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`section ${how.section}`} id="how-it-works">
          <div className="container">
            <div className={how.aside}>
              <div className={`${how.title} ${styles.lines} ${styles.howTitle}`}>
                <Skeleton width="min(520px, 100%)" height="0.85em" />
                <Skeleton width="min(380px, 72%)" height="0.85em" />
              </div>
              <Skeleton width="160px" height="54px" radius="sm" className={styles.howCta} />
            </div>

            <ol className={how.sheet}>
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className={`${how.item} ${styles.step}`}>
                  <Skeleton height="auto" className={styles.phone} />
                  <div className={how.caption}>
                    <Skeleton width={`${58 + i * 6}%`} height="20px" />
                    <div className={`${styles.stepDesc} ${styles.featureDesc}`}>
                      <Skeleton height="13px" />
                      <Skeleton width="70%" height="13px" />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <Skeleton width="180px" height="14px" className={styles.swipeHint} />
          </div>
        </section>

        <section className={`section ${pricing.section}`} id="pricing">
          <div className="container">
            <SectionHead />
            <ul className={pricing.grid}>
              {[0, 1, 2].map((i) => (
                <li key={i} className={styles.plan} data-featured={i === 2}>
                  <div className={styles.planTop}>
                    <Skeleton width="45%" height="26px" />
                    {i === 2 && <Skeleton width="84px" height="24px" radius="full" />}
                  </div>
                  <div className={`${styles.featureDesc} ${styles.planDesc}`}>
                    <Skeleton height="14px" />
                    <Skeleton width="64%" height="14px" />
                  </div>
                  <div className={styles.priceRow}>
                    <Skeleton width="38%" height="52px" />
                    <Skeleton width="26%" height="16px" />
                  </div>
                  <ul className={styles.planLines}>
                    {[62, 54, 70, 48].map((w) => (
                      <li key={w}>
                        <Skeleton width="18px" height="18px" radius="circle" />
                        <Skeleton width={`${w}%`} height="15px" />
                      </li>
                    ))}
                  </ul>
                  <div className={styles.planActions}>
                    <Skeleton height="48px" radius="md" />
                    <Skeleton width="72px" height="14px" />
                  </div>
                </li>
              ))}
            </ul>
            <Skeleton width="min(420px, 80%)" height="15px" className={styles.note} />
          </div>
        </section>

        <section className={`section ${coverage.section}`} id="coverage">
          <div className={coverage.map}>
            <Skeleton height="100%" className={styles.flat} />
          </div>
          <div className={`container ${coverage.layout}`}>
            <div className={coverage.ask}>
              <div className={coverage.head}>
                <Skeleton width="86%" height="34px" />
                <Skeleton width="70%" height="15px" />
              </div>
              <Skeleton height="52px" radius="md" />
              <ul className={coverage.districts}>
                {Array.from({ length: 9 }, (_, i) => (
                  <li key={i} className={styles.district}>
                    <Skeleton width="16px" height="16px" radius="circle" />
                    <Skeleton width={`${46 + ((i * 11) % 34)}%`} height="14px" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`section ${faq.section}`} id="faq">
          <div className="container">
            <SectionHead />
            <ul className={`${faq.wrap} ${styles.faq}`}>
              {[62, 48, 56, 40, 66, 52, 44].map((w, i) => (
                <li key={i} className={styles.faqRow}>
                  <div className={styles.faqHead}>
                    <Skeleton width={`${w}%`} height="20px" />
                    <Skeleton width="24px" height="24px" radius="circle" />
                  </div>
                  {i === 0 && (
                    <div className={`${styles.featureDesc} ${styles.faqAnswer}`}>
                      <Skeleton width="88%" height="15px" />
                      <Skeleton width="60%" height="15px" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`section ${cta.section}`}>
          <div className="container">
            <div className={cta.card}>
              <div className={cta.copy}>
                <div className={`${cta.title} ${styles.lines}`}>
                  <Skeleton width="min(520px, 92%)" height="0.85em" tone="onAccent" />
                  <Skeleton width="min(460px, 80%)" height="0.85em" tone="onAccent" />
                </div>
                <div className={`${cta.description} ${styles.textLines}`}>
                  <Skeleton width="min(440px, 100%)" height="1em" tone="onAccent" />
                </div>
                <Skeleton width="170px" height="48px" radius="sm" tone="onAccent" className={styles.ctaButton} />
              </div>
              <div className={cta.art}>
                <Skeleton width="var(--portrait)" height="var(--portrait)" radius="circle" className={styles.portrait} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </SkeletonScreen>
  );
}

/** The shared header: a two-line title and a short description, centred. */
function SectionHead() {
  return (
    <div className={header.header}>
      <div className={`${header.title} ${styles.lines} ${styles.centered}`}>
        <Skeleton width="min(720px, 92%)" height="0.85em" />
        <Skeleton width="min(420px, 60%)" height="0.85em" />
      </div>
      <div className={`body-lg ${styles.textLines} ${styles.centered}`}>
        <Skeleton width="min(640px, 90%)" height="1em" />
      </div>
    </div>
  );
}
