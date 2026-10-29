import { IconCheck } from "@tabler/icons-react";
import styles from "./Wash.module.css";

export default function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className={styles.stepper6} aria-label={steps[Math.min(current, steps.length) - 1]}>
      {steps.map((label, index) => {
        const number = index + 1;
        const state = number < current ? styles.stepDone : number === current ? styles.stepNow : "";
        return (
          <li key={label} className={`${styles.stepItem} ${state}`} aria-current={number === current ? "step" : undefined}>
            <span className={styles.stepDot}>{number < current ? <IconCheck size={18} stroke={2.5} aria-hidden /> : number}</span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
