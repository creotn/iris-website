import { IconCheck } from "@tabler/icons-react";
import styles from "./Wash.module.css";

/** The step rail. Once the booking is `complete`, every step is ticked and the last one turns green. */
export default function Stepper({ steps, current, complete = false }: { steps: string[]; current: number; complete?: boolean }) {
  return (
    <ol className={styles.stepper6} aria-label={steps[Math.min(current, steps.length) - 1]}>
      {steps.map((label, index) => {
        const number = index + 1;
        const done = complete || number < current;
        const state = done
          ? `${styles.stepDone} ${complete && number === steps.length ? styles.stepSuccess : ""}`
          : number === current
            ? styles.stepNow
            : "";
        return (
          <li key={label} className={`${styles.stepItem} ${state}`} aria-current={number === current ? "step" : undefined}>
            <span className={styles.stepDot}>{done ? <IconCheck size={18} stroke={2.5} aria-hidden /> : number}</span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
