import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <SkeletonScreen>
      <div className="alternating-sections">
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <Skeleton width="90px" height="12px" />
            <div className={styles.stack}>
              <Skeleton width="min(640px, 90%)" height="52px" />
              <Skeleton width="min(420px, 62%)" height="52px" />
            </div>
            <div className={styles.lines}>
              <Skeleton width="min(620px, 100%)" height="16px" />
              <Skeleton width="min(520px, 84%)" height="16px" />
            </div>
          </div>
        </section>

        <section className="section">
          <div className={`container ${styles.body}`}>
            <ul className={styles.toc}>
              {Array.from({ length: 7 }, (_, i) => (
                <li key={i}>
                  <Skeleton width={`${58 + ((i * 13) % 34)}%`} height="14px" />
                </li>
              ))}
            </ul>

            <div className={styles.article}>
              {[0, 1, 2].map((i) => (
                <div key={i} className={styles.part}>
                  <Skeleton width="min(360px, 70%)" height="28px" />
                  <div className={styles.lines}>
                    <Skeleton height="14px" />
                    <Skeleton width="96%" height="14px" />
                    <Skeleton width="88%" height="14px" />
                    <Skeleton width="58%" height="14px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SkeletonScreen>
  );
}
