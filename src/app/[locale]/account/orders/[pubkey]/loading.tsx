import { SkeletonScreen } from "@/components/skeleton/Skeleton";
import { OrderDetailSkeleton } from "@/components/account/AccountSkeletons";
import styles from "@/components/account/Account.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <OrderDetailSkeleton />
    </SkeletonScreen>
  );
}
