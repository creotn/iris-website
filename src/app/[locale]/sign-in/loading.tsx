import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import splitStyles from "@/components/layout/SplitLayout.module.css";
import styles from "./loading.module.css";

// The form title is clamp(2rem, 5vw, 3rem) at a 1.2 line height.
const TITLE_HEIGHT = "calc(clamp(2rem, 5vw, 3rem) * 1.2)";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${splitStyles.main}`}>
      <div className={splitStyles.panel}>
        <Skeleton height="100%" radius="sm" className={styles.panelCover} />
      </div>

      <div className={splitStyles.formSide}>
        <div className={formStyles.form}>
          <div className={formStyles.heading}>
            <Skeleton width="88px" height="10px" />
            <Skeleton width="72%" height={TITLE_HEIGHT} />
            <Skeleton width="86%" height="16px" />
          </div>

          <div className={styles.tabs}>
            <div className={`${styles.tab} ${styles.tabOn}`}>
              <Skeleton width="64px" height="18px" />
            </div>
            <div className={styles.tab}>
              <Skeleton width="112px" height="18px" />
            </div>
          </div>

          <div className={formStyles.fields}>
            <FieldSkeleton labelWidth="44px" />
            <FieldSkeleton labelWidth="72px" aside />
            <div className={styles.error} />
            <Skeleton height="58px" className={styles.submit} />
            <div className={styles.secure}>
              <Skeleton width="16px" height="16px" radius="circle" />
              <Skeleton width="58%" height="12px" />
            </div>
            <Skeleton width="64%" height="14px" />
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
      <Skeleton height="58px" />
    </div>
  );
}
