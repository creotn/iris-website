import clsx from "clsx";
import { ReactNode } from "react";
import styles from "./PhoneMockup.module.css";

export default function PhoneMockup({
  children,
  delay = 0,
  duration = 4,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
}) {
  return (
    <div
      className={clsx(styles.phone, styles.float)}
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
      aria-hidden
    >
      <div className={styles.screen}>
        <div className={styles.statusBar}>
          <span>9:41</span>
          <span>●●● ▐█▌</span>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
