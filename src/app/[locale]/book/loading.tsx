import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import styles from "./book.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <div className={formStyles.form}>
        <Skeleton height="28px" />
        <Skeleton height="4px" radius="full" />
        <Skeleton width="55%" height="40px" />
        <Skeleton width="70%" height="16px" />
        <Skeleton height="58px" />
        <Skeleton height="58px" />
        <Skeleton height="62px" />
      </div>
    </SkeletonScreen>
  );
}
