"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import { useScopedI18n } from "@/locales/client";
import styles from "./Skeleton.module.css";

type Radius = "sm" | "md" | "lg" | "full" | "circle";

export function Skeleton({
  width = "100%",
  height,
  radius = "md",
  tone = "default",
  className,
}: {
  width?: string;
  height: string;
  radius?: Radius;
  tone?: "default" | "onDark" | "onAccent";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={clsx(styles.block, tone !== "default" && styles[tone], className)}
      style={{
        inlineSize: width,
        blockSize: height,
        borderRadius: radius === "circle" ? "50%" : `var(--radius-${radius})`,
      }}
    />
  );
}

export function SkeletonScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const t = useScopedI18n("loading");

  return (
    <div role="status" aria-busy="true" className={clsx(styles.screen, className)}>
      <span className={styles.srOnly}>{t("label")}</span>
      {children}
    </div>
  );
}
