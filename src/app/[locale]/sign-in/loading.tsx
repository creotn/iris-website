import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import authStyles from "@/components/layout/AuthLayout.module.css";
import styles from "./loading.module.css";

// The card title is 28px at a 1.15 line height.
const TITLE_HEIGHT = "calc(28px * 1.15)";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${authStyles.main}`}>
      <div className={authStyles.shell}>
        <div className={authStyles.stage} />
        <div className={authStyles.card}>
          <div className={formStyles.form}>
            <div className={formStyles.heading}>
              <Skeleton width="40%" height={TITLE_HEIGHT} />
              <Skeleton width="86%" height="16px" />
            </div>

            <div className={formStyles.fields}>
              <FieldSkeleton labelWidth="44px" />
              <FieldSkeleton labelWidth="72px" aside />
              <Skeleton height="48px" className={styles.submit} />
            </div>

            <div className={formStyles.switch}>
              <Skeleton width="60%" height="14px" className={styles.switchLine} />
            </div>
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}

function FieldSkeleton({ labelWidth, aside = false }: { labelWidth: string; aside?: boolean }) {
  return (
    <div className={formStyles.field}>
      <div className={styles.labelRow}>
        <Skeleton width={labelWidth} height="14px" />
        {aside && <Skeleton width="104px" height="12px" />}
      </div>
      <Skeleton height="46px" />
    </div>
  );
}
