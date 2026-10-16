import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.page}`}>
      <div className={styles.copy}>
        <Skeleton width="85%" height="48px" />
        <Skeleton width="65%" height="18px" />
        <Skeleton width="420px" height="84px" radius="md" className={styles.tryCard} />
      </div>

      <div className={styles.demo}>
        <Skeleton width="440px" height="48px" radius="lg" />
        <Skeleton width="282px" height="525px" radius="lg" />
      </div>
    </SkeletonScreen>
  );
}
