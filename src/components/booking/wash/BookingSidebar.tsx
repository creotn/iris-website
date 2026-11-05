import { IconCar, IconCheck, IconCircleCheck, IconCreditCard, IconDroplet, IconMapPin } from "@tabler/icons-react";
import styles from "./Wash.module.css";

// One icon per step: car, location, service, review & pay, confirmation.
const ICONS = [IconCar, IconMapPin, IconDroplet, IconCreditCard, IconCircleCheck];

/**
 * The desktop step rail: a slim card of step icons, each with a short name under it. The full step
 * name is the item's accessible label and tooltip. With `onStep`, a finished step is a button that goes
 * back to it (desktop has no Back button; the rail is the way back). Phones get the horizontal `Stepper` instead
 * (see `flowMobile` / `flowSide` in Wash.module.css).
 */
export default function BookingSidebar({
  steps,
  short,
  current,
  complete = false,
  onStep,
}: {
  steps: string[];
  short: string[];
  current: number;
  complete?: boolean;
  onStep?: (step: number) => void;
}) {
  return (
    <aside className={styles.flowSide}>
      <ol className={styles.sideRail} aria-label={steps[Math.min(current, steps.length) - 1]}>
        {steps.map((label, index) => {
          const number = index + 1;
          const done = complete || number < current;
          const Icon = ICONS[index] ?? IconCar;
          const state = done
            ? `${styles.stepDone} ${complete && number === steps.length ? styles.stepSuccess : ""}`
            : number === current
              ? styles.stepNow
              : "";
          const content = (
            <>
              <span className={styles.sideDot}>{done ? <IconCheck size={18} stroke={2.5} aria-hidden /> : <Icon size={20} stroke={1.75} aria-hidden />}</span>
              <span className={styles.sideLabel} aria-hidden>
                {short[index]}
              </span>
            </>
          );
          const reachable = onStep && !complete && number < current;
          return (
            <li key={label} className={`${styles.sideItem} ${state}`} aria-current={number === current ? "step" : undefined}>
              {reachable ? (
                <button type="button" className={styles.sideBtn} aria-label={label} title={label} onClick={() => onStep?.(number)}>
                  {content}
                </button>
              ) : (
                <span className={styles.sideBtn} title={label}>
                  <span className={styles.srOnly}>{label}</span>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
