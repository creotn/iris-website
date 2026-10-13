import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import styles from "./page.module.css";
import skeleton from "./loading.module.css";

const MOODS = 6;

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <div className={styles.card}>
        <div className={skeleton.visual}>
          <Skeleton width="180px" height="12px" />
          <Skeleton width="60%" height="40px" />
          <Skeleton width="80%" height="16px" />
          <div className={skeleton.moods}>
            {Array.from({ length: MOODS }, (_, index) => (
              <Skeleton key={index} height="64px" />
            ))}
          </div>
        </div>
        <div className={styles.formPanel}>
          <Skeleton width="80px" height="40px" />
          <div className={formStyles.form}>
            <Skeleton width="45%" height="36px" />
            <Skeleton width="65%" height="14px" />
            <Skeleton height="46px" />
            <Skeleton height="46px" />
            <Skeleton height="48px" />
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}
