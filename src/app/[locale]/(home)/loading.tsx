import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.hero}`}>
      <div className={styles.text}>
        <Skeleton width="240px" height="30px" radius="full" />
        <div className={styles.stack}>
          <Skeleton width="80%" height="56px" />
          <Skeleton width="55%" height="56px" />
        </div>
        <div className={styles.lines}>
          <Skeleton height="16px" />
          <Skeleton width="92%" height="16px" />
          <Skeleton width="70%" height="16px" />
        </div>
        <div className={styles.row}>
          <Skeleton width="170px" height="58px" />
          <Skeleton width="190px" height="58px" />
        </div>
        <Skeleton width="360px" height="96px" radius="lg" />
      </div>

      <div className={styles.phones}>
        <Skeleton width="280px" height="580px" radius="lg" />
        <Skeleton width="280px" height="580px" radius="lg" className={styles.offset} />
      </div>
    </SkeletonScreen>
  );
}
