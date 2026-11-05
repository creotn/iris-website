import { IconArrowLeft } from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import styles from "./Wash.module.css";

/**
 * The phone header, on one line: Back (from step 2), one thin bar per step (finished steps and the
 * current one filled), then "1/5 · name". Desktop uses the `BookingSidebar` rail instead.
 */
export default function Stepper({
  steps,
  current,
  complete = false,
  onBack,
}: {
  steps: string[];
  current: number;
  complete?: boolean;
  onBack?: () => void;
}) {
  const t = useScopedI18n("wash");
  const now = Math.min(current, steps.length);
  return (
    <div className={styles.mStep}>
      {onBack && (
        <button type="button" className={styles.mStepBack} onClick={onBack} aria-label={t("back")}>
          <IconArrowLeft className={styles.mStepBackIcon} size={18} stroke={2} aria-hidden />
        </button>
      )}
      <ol className={styles.mStepBars} aria-hidden>
        {steps.map((label, index) => (
          <li key={label} className={complete || index + 1 <= current ? styles.mStepOn : undefined} />
        ))}
      </ol>
      <span className={styles.mStepLabel}>
        <span className={styles.srOnly}>{t("step", { current: now, total: steps.length })}</span>
        <span aria-hidden>
          {now}/{steps.length}
        </span>{" "}
        · {steps[now - 1]}
      </span>
    </div>
  );
}
