import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.stage}>
      <SkeletonScreen className={`container ${styles.hero}`}>
        <div className={styles.text}>
          <div className={styles.stack}>
            <Skeleton width="85%" height="60px" />
            <Skeleton width="55%" height="60px" />
          </div>
          <div className={styles.stack}>
            <Skeleton height="18px" />
            <Skeleton width="70%" height="18px" />
          </div>
          <Skeleton width="190px" height="63px" />
          <Skeleton width="157px" height="52px" />
        </div>

        <div className={styles.ticket}>
          <Skeleton height="393px" radius="lg" />
        </div>
      </SkeletonScreen>
    </div>
  );
}
