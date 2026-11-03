import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import styles from "../sign-in/loading.module.css";

const TITLE_HEIGHT = "calc(clamp(2rem, 5vw, 3rem) * 1.2)";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.centered}`}>
      <div className={formStyles.form}>
        <div className={formStyles.heading}>
          <Skeleton width="62%" height={TITLE_HEIGHT} />
          <Skeleton width="84%" height="16px" />
        </div>

        <div className={formStyles.fields}>
          <div className={formStyles.field}>
            <Skeleton width="44px" height="14px" />
            <Skeleton height="58px" />
          </div>
          <div className={styles.error} />
          <Skeleton height="58px" className={styles.submit} />
        </div>

        <Skeleton width="132px" height="16px" className={styles.ghost} />
      </div>
    </SkeletonScreen>
  );
}
