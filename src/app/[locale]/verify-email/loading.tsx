import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import formStyles from "@/components/forms/SignInForm.module.css";
import authStyles from "@/components/layout/AuthLayout.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${authStyles.main}`}>
      <div className={authStyles.shell}>
        <div className={authStyles.stage} />
        <div className={authStyles.card}>
          <div className={formStyles.form}>
            <div className={formStyles.heading}>
              <Skeleton width="60%" height="calc(28px * 1.15)" />
              <Skeleton width="86%" height="16px" />
            </div>
            <Skeleton height="48px" />
          </div>
        </div>
      </div>
    </SkeletonScreen>
  );
}
