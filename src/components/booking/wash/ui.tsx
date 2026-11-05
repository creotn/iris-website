import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import formStyles from "@/components/forms/SignInForm.module.css";
import { useScopedI18n } from "@/locales/client";
import styles from "./Wash.module.css";

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={formStyles.heading}>
      <h1 className={formStyles.title}>{title}</h1>
      {subtitle && <p className={formStyles.subtitle}>{subtitle}</p>}
    </div>
  );
}

/** How many steps the booking has: car, location, service, review & pay, confirmation. */
export const STEP_TOTAL = 5;
const STEP_KEYS = ["stepCar", "stepLocation", "stepService", "stepReview", "stepDone"] as const;

/** Every step opens the same way: "Step N of 5 · name — next: …", the title, the subtitle, and optionally something on the side. */
export function StepHeading({ step, title, subtitle, aside }: { step: number; title: string; subtitle?: string; aside?: ReactNode }) {
  const t = useScopedI18n("wash");
  return (
    <div className={styles.stepHead}>
      <div>
        <p className={styles.eyebrowStep}>
          {t("step", { current: step, total: STEP_TOTAL })} · {t(STEP_KEYS[step - 1])}
          {step < STEP_TOTAL && <span className={styles.eyebrowNext}> — {t("nextUp", { name: t(STEP_KEYS[step]) })}</span>}
        </p>
        <Heading title={title} subtitle={subtitle} />
      </div>
      {aside}
    </div>
  );
}

/** Every step closes the same way: a line, what was chosen so far (or a hint), and the button to go on. */
export function StepFooter({ label, value, hint, children }: { label: string; value?: ReactNode; hint: string; children: ReactNode }) {
  return (
    <div className={styles.stepFooter}>
      <span className={styles.stepSummary} role="status">
        <small>{label}</small>
        {value ? <b dir="auto">{value}</b> : <span>{hint}</span>}
      </span>
      {children}
    </div>
  );
}

export function Cta({ children, arrow = true, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { arrow?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={formStyles.submit}
      style={{ opacity: props.disabled ? 0.5 : 1, cursor: props.disabled ? "not-allowed" : "pointer" }}
    >
      {children}
      {arrow && <IconArrowRight className={formStyles.arrow} size={18} stroke={2} aria-hidden />}
    </button>
  );
}

export function Ghost(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={formStyles.ghost} />;
}

export function Line({ label, value, strong, tone }: { label: ReactNode; value: ReactNode; strong?: boolean; tone?: "negative" }) {
  return (
    <div className={`${styles.line} ${strong ? styles.total : ""}`}>
      <span>{label}</span>
      <span className={tone === "negative" ? styles.negative : undefined}>{value}</span>
    </div>
  );
}

export function Banner({ children, tone, icon }: { children: ReactNode; tone?: "ok" | "warn"; icon?: ReactNode }) {
  return (
    <div
      className={`${styles.banner} ${tone === "ok" ? styles.bannerOk : tone === "warn" ? styles.bannerWarn : ""}`}
      role={tone === "warn" ? "alert" : undefined}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}
