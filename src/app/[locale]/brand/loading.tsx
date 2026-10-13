import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "./loading.module.css";

const TOC_ITEMS = 8;

export default function Loading() {
  return (
    <SkeletonScreen>
      <div className={styles.cover}>
        <div className={styles.coverText}>
          <Skeleton width="160px" height="84px" />
          <Skeleton width="280px" height="28px" radius="full" />
          <div className={styles.stack}>
            <Skeleton width="85%" height="72px" />
            <Skeleton width="55%" height="72px" />
          </div>
          <Skeleton width="60%" height="20px" />
          <div className={styles.lines}>
            <Skeleton width="90%" height="16px" />
            <Skeleton width="75%" height="16px" />
          </div>
          <div className={styles.row}>
            <Skeleton width="120px" height="14px" />
            <Skeleton width="140px" height="14px" />
            <Skeleton width="90px" height="14px" />
            <Skeleton width="130px" height="14px" />
          </div>
        </div>
        <Skeleton width="260px" height="480px" radius="lg" className={styles.mascot} />
      </div>

      <div className={styles.contents}>
        <Skeleton width="90px" height="14px" />
        <Skeleton width="45%" height="40px" />
        <div className={styles.toc}>
          {Array.from({ length: TOC_ITEMS }, (_, index) => (
            <Skeleton key={index} height="48px" />
          ))}
        </div>
      </div>
    </SkeletonScreen>
  );
}
