import { Skeleton, SkeletonScreen } from "@/components/skeleton/Skeleton";
import { LiveOrdersSkeleton, ProfileSkeleton } from "@/components/account/AccountSkeletons";
import styles from "@/components/account/Account.module.css";

// Live orders, history, cars, address and the wallet; only live, cars and the wallet show a count.
const MENU_WIDTHS = ["58%", "44%", "36%", "48%", "40%"];

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${styles.main}`}>
      <div className={`${styles.page} ${styles.shell}`}>
        <aside className={styles.side}>
          <ProfileSkeleton />

          <Skeleton height="48px" radius="md" />

          <div className={styles.sideNav}>
            {MENU_WIDTHS.map((width, i) => (
              <div key={i} className={styles.sideItem}>
                <Skeleton width={width} height="14px" />
                {i !== 1 && i !== 3 && <Skeleton width="28px" height="12px" />}
              </div>
            ))}
          </div>
        </aside>

        <div className={styles.mainCol}>
          <div className={styles.mainHead}>
            <Skeleton width="200px" height="34px" />
            <Skeleton width="110px" height="14px" />
          </div>

          <LiveOrdersSkeleton />
        </div>
      </div>
    </SkeletonScreen>
  );
}
