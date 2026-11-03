import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import heroStyles from "./_components/InfoPage.module.css";
import docStyles from "./_components/LegalDocument.module.css";
import styles from "./loading.module.css";

// Privacy has 12 sections and terms 15; the table of contents shows a screenful of them.
const TOC_WIDTHS = [72, 58, 66, 80, 54, 70, 62, 76, 60, 68];

export default function Loading() {
  return (
    <SkeletonScreen>
      <div className="alternating-sections">
        <section className={heroStyles.hero}>
          <div className={`container ${heroStyles.heroInner}`}>
            <Skeleton width="56px" height="12px" />
            <Skeleton width="min(420px, 80%)" height="clamp(2.6rem, 5.8vw, 4.3rem)" className={styles.title} />
            <div className={styles.lines}>
              <Skeleton width="min(640px, 100%)" height="18px" />
              <Skeleton width="min(560px, 92%)" height="18px" />
              <Skeleton width="min(300px, 54%)" height="18px" />
            </div>
          </div>
        </section>

        <section className={`section ${docStyles.body}`}>
          <div className={`container ${docStyles.layout}`}>
            <div className={styles.toc}>
              <Skeleton width="96px" height="11px" className={styles.tocLabel} />
              <ul className={styles.tocList}>
                {TOC_WIDTHS.map((w, i) => (
                  <li key={i} className={styles.tocItem}>
                    <Skeleton width="16px" height="11px" className={styles.tocNumber} />
                    <Skeleton width={`${w}%`} height="14px" />
                  </li>
                ))}
              </ul>
            </div>

            <div className={docStyles.article}>
              {[0, 1, 2].map((i) => (
                <div key={i} className={docStyles.part}>
                  <div className={styles.partHead}>
                    <Skeleton width="22px" height="14px" />
                    <Skeleton width={`min(${[260, 220, 300][i]}px, 70%)`} height="28px" />
                  </div>
                  <div className={styles.lines}>
                    <Skeleton height="16px" />
                    <Skeleton width="96%" height="16px" />
                    <Skeleton width="88%" height="16px" />
                    <Skeleton width="58%" height="16px" />
                  </div>
                  {i === 1 && (
                    <ul className={styles.list}>
                      {[82, 64, 74].map((w) => (
                        <li key={w} className={styles.listItem}>
                          <Skeleton width="8px" height="8px" radius="circle" />
                          <Skeleton width={`${w}%`} height="16px" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </SkeletonScreen>
  );
}
