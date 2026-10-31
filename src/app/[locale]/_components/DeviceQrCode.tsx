"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import clsx from "clsx";
import { detectPlatform, type StorePlatform } from "@/lib/downloadLink";
import styles from "./DownloadSection.module.css";

export interface QrVariant {
  code: ReactNode;
  caption: string;
  href?: string;
}

const subscribe = () => () => {};

/**
 * The page is static, so the server can't vary it by user agent: it renders every code and this leaf
 * picks one in the browser. The server-rendered markup holds the fallback.
 */
export default function DeviceQrCode({
  fallback,
  stores,
}: {
  fallback: QrVariant;
  stores: Partial<Record<StorePlatform, QrVariant>>;
}) {
  const platform = useSyncExternalStore(
    subscribe,
    () => detectPlatform(navigator.userAgent, navigator.maxTouchPoints),
    () => null,
  );
  const { code, caption, href } = (platform && stores[platform]) || fallback;

  const content = (
    <>
      {code}
      <span className={styles.scanLine} aria-hidden="true" />
    </>
  );

  return (
    <>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.qr}>
          {content}
        </a>
      ) : (
        <div className={styles.qr}>{content}</div>
      )}
      <p className={clsx("body-sm", styles.caption)}>{caption}</p>
    </>
  );
}
