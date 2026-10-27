import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <SkeletonScreen>
      <div className="alternating-sections">
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <div className={styles.stack}>
                <Skeleton width="78%" height="60px" tone="onDark" />
                <Skeleton width="62%" height="60px" tone="onDark" />
              </div>
              <div className={styles.lines}>
                <Skeleton height="16px" tone="onDark" />
                <Skeleton width="94%" height="16px" tone="onDark" />
                <Skeleton width="68%" height="16px" tone="onDark" />
              </div>
              <div className={styles.row}>
                <Skeleton width="172px" height="54px" tone="onDark" />
                <Skeleton width="150px" height="54px" tone="onDark" />
              </div>
            </div>

            <div className={styles.bar}>
              {[0, 1, 2].map((i) => (
                <div key={i} className={styles.barField}>
                  <Skeleton width="44px" height="44px" radius="md" tone="onDark" />
                  <div className={styles.barText}>
                    <Skeleton width="48px" height="10px" tone="onDark" />
                    <Skeleton width="120px" height="16px" tone="onDark" />
                  </div>
                </div>
              ))}
              <Skeleton width="220px" height="64px" radius="lg" tone="onDark" className={styles.barButton} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHead lines={2} />
            <ul className={styles.features}>
              {Array.from({ length: 6 }, (_, i) => (
                <li key={i} className={styles.featureCard}>
                  <div className={styles.featureMedia}>
                    <Skeleton height="100%" radius="sm" className={styles.flat} />
                  </div>
                  <div className={styles.featureBody}>
                    <Skeleton width="48px" height="48px" radius="md" />
                    <Skeleton width="55%" height="18px" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className={`container ${styles.how}`}>
            <div className={styles.howCopy}>
              <Skeleton width="110px" height="12px" />
              <div className={styles.stack}>
                <Skeleton width="85%" height="48px" />
                <Skeleton width="62%" height="48px" />
              </div>

              <ol className={styles.steps}>
                {[true, false, false, false].map((open, i) => (
                  <li key={i} className={styles.step} data-open={open}>
                    <Skeleton width="20px" height="20px" radius="circle" />
                    <div className={styles.stepText}>
                      <Skeleton width={open ? "55%" : `${48 + i * 6}%`} height="22px" />
                      {open && <Skeleton width="85%" height="14px" />}
                    </div>
                  </li>
                ))}
              </ol>

              <Skeleton width="320px" height="58px" radius="full" />
            </div>

            <div className={styles.stage}>
              <Skeleton width="min(520px, 100%)" height="520px" radius="circle" className={styles.disc} />
              <Skeleton width="300px" height="640px" radius="lg" className={styles.phone} />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHead lines={1} />
            <ul className={styles.plans}>
              {[0, 1, 2].map((i) => (
                <li key={i} className={styles.plan} data-featured={i === 2}>
                  <Skeleton width="45%" height="24px" />
                  <Skeleton width="80%" height="14px" />
                  <Skeleton width="62%" height="58px" className={styles.price} />
                  <span className={styles.divider} />
                  <div className={styles.lines}>
                    <Skeleton width="70%" height="16px" />
                    <Skeleton width="58%" height="16px" />
                    <Skeleton width="64%" height="16px" />
                  </div>
                  <Skeleton height="48px" radius="md" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className={`container ${styles.coverage}`}>
            <div className={styles.coverageCopy}>
              <div className={styles.stack}>
                <Skeleton width="92%" height="46px" />
                <Skeleton width="40%" height="46px" />
              </div>
              <div className={styles.lines}>
                <Skeleton width="90%" height="16px" />
                <Skeleton width="60%" height="16px" />
              </div>
              <ul className={styles.areas}>
                {Array.from({ length: 9 }, (_, i) => (
                  <li key={i} className={styles.area}>
                    <Skeleton width="32px" height="32px" radius="md" />
                    <Skeleton width={`${46 + ((i * 11) % 30)}%`} height="14px" />
                  </li>
                ))}
              </ul>
            </div>
            <Skeleton height="100%" radius="lg" className={styles.map} />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <SectionHead lines={1} withDescription={false} />
            <ul className={styles.faq}>
              {[62, 48, 36, 54, 46].map((w, i) => (
                <li key={i} className={styles.faqRow} data-open={i === 0}>
                  <div className={styles.faqHead}>
                    <Skeleton width={`${w}%`} height="20px" />
                    <Skeleton width="16px" height="16px" radius="sm" />
                  </div>
                  {i === 0 && <Skeleton width="86%" height="14px" />}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`section ${styles.ctaSection}`}>
          <div className="container">
            <div className={styles.cta}>
              <div className={styles.ctaCopy}>
                <div className={styles.stack}>
                  <Skeleton width="80%" height="64px" tone="onAccent" />
                  <Skeleton width="64%" height="64px" tone="onAccent" />
                </div>
                <div className={styles.lines}>
                  <Skeleton width="90%" height="14px" tone="onAccent" />
                  <Skeleton width="72%" height="14px" tone="onAccent" />
                </div>
                <div className={styles.row}>
                  <Skeleton width="180px" height="52px" radius="full" tone="onAccent" />
                </div>
              </div>
              <Skeleton width="260px" height="260px" radius="circle" className={styles.portrait} />
            </div>
          </div>
        </section>
      </div>
    </SkeletonScreen>
  );
}

function SectionHead({ lines, withDescription = true }: { lines: 1 | 2; withDescription?: boolean }) {
  return (
    <div className={styles.head}>
      <Skeleton width="80px" height="12px" />
      <div className={styles.headTitle}>
        <Skeleton width={lines === 2 ? "min(520px, 80%)" : "min(560px, 86%)"} height="44px" />
        {lines === 2 && <Skeleton width="min(360px, 56%)" height="44px" />}
      </div>
      {withDescription && <Skeleton width="min(440px, 80%)" height="16px" />}
    </div>
  );
}
