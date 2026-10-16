import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "@/components/account/Account.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <div className={styles.page}>
        <Skeleton height="220px" radius="lg" />
        <div className={styles.tiles}>
          <Skeleton height="74px" radius="lg" />
          <Skeleton height="74px" radius="lg" />
          <Skeleton height="74px" radius="lg" />
        </div>
        <Skeleton width="180px" height="28px" />
        <div className={styles.liveGrid}>
          <Skeleton height="230px" radius="lg" />
          <Skeleton height="230px" radius="lg" />
        </div>
      </div>
    </SkeletonScreen>
  );
}
