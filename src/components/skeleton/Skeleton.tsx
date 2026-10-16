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

/**
 * Wraps a page-shaped skeleton and announces the loading state to assistive technology. A client
 * component on purpose: a `loading.tsx` is prerendered with its page, before any `setStaticParamsLocale`
 * could run, so the label comes from the layout's i18n provider instead of the server lookup.
 */
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
