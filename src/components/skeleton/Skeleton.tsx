import clsx from "clsx";
import type { ReactNode } from "react";
import { getScopedI18n } from "@/locales/server";
import styles from "./Skeleton.module.css";

type Radius = "sm" | "md" | "lg" | "full" | "circle";

export function Skeleton({
  width = "100%",
  height,
  radius = "md",
  className,
}: {
  width?: string;
  height: string;
  radius?: Radius;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={clsx(styles.block, className)}
      style={{
        inlineSize: width,
        blockSize: height,
        borderRadius: radius === "circle" ? "50%" : `var(--radius-${radius})`,
      }}
    />
  );
}

/** Wraps a page-shaped skeleton and announces the loading state to assistive technology. */
export async function SkeletonScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const t = await getScopedI18n("loading");

  return (
    <div role="status" aria-busy="true" className={clsx(styles.screen, className)}>
      <span className={styles.srOnly}>{t("label")}</span>
      {children}
    </div>
  );
}
