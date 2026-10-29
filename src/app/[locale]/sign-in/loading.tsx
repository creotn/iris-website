import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import styles from "@/components/layout/SplitLayout.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <div className={formStyles.form}>
        <Skeleton width="55%" height="48px" />
        <Skeleton width="70%" height="16px" />
        <Skeleton height="40px" />
        <Skeleton height="58px" />
        <Skeleton height="58px" />
        <Skeleton height="62px" />
      </div>
    </SkeletonScreen>
  );
}
