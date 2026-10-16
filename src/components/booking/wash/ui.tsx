import type { ButtonHTMLAttributes, ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";
import formStyles from "@/components/forms/SignInForm.module.css";
import styles from "./Wash.module.css";

export function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={formStyles.heading}>
      <h1 className={formStyles.title}>{title}</h1>
      {subtitle && <p className={formStyles.subtitle}>{subtitle}</p>}
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
