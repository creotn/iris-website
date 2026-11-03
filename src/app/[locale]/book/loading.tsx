import { SkeletonScreen } from "@/components/skeleton/Skeleton";
import StepSkeleton from "@/components/booking/wash/StepSkeleton";
import pageStyles from "./book.module.css";

export default function Loading() {
  return (
    <SkeletonScreen className={`container ${pageStyles.main}`}>
      <StepSkeleton />
    </SkeletonScreen>
  );
}
