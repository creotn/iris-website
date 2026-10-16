import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "@/components/account/Account.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <div className={styles.page}>
        <Skeleton width="120px" height="20px" />
        <Skeleton width="55%" height="36px" />
        <div className={styles.detailGrid}>
          <Skeleton height="360px" radius="lg" />
          <div className={styles.column}>
            <Skeleton height="200px" radius="lg" />
            <Skeleton height="180px" radius="lg" />
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}
