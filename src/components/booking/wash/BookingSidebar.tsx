import { IconCheck } from "@tabler/icons-react";
import styles from "./Wash.module.css";

/**
 * The desktop step rail: a slim column of numbered dots. Each step's name is its title/aria-label.
 * Phones get the compact horizontal `Stepper` instead (see `flowMobile` / `flowSide` in Wash.module.css).
 */
export default function BookingSidebar({ steps, current, complete = false }: { steps: string[]; current: number; complete?: boolean }) {
  return (
    <aside className={styles.flowSide}>
      <ol className={styles.sideRail} aria-label={steps[Math.min(current, steps.length) - 1]}>
        {steps.map((label, index) => {
          const number = index + 1;
          const done = complete || number < current;
          const state = done
            ? `${styles.stepDone} ${complete && number === steps.length ? styles.stepSuccess : ""}`
            : number === current
              ? styles.stepNow
              : "";
          return (
            <li key={label} className={`${styles.sideItem} ${state}`} aria-current={number === current ? "step" : undefined} aria-label={label} title={label}>
              <span className={styles.sideDot}>{done ? <IconCheck size={17} stroke={2.5} aria-hidden /> : number}</span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
