"use client";

import { useEffect } from "react";
import type { CardPayment } from "@/api/BookingAPI";
import { useCurrentLocale } from "@/locales/client";
import styles from "./Wash.module.css";

const MOYASAR_VERSION = "1.14.0";
const BASE = `https://cdn.moyasar.com/mpf/${MOYASAR_VERSION}`;
const ELEMENT = ".mysr-form";

type MoyasarGlobal = { init: (config: Record<string, unknown>) => void };
const moyasar = () => (window as unknown as { Moyasar?: MoyasarGlobal }).Moyasar;

function loadAssets(): Promise<void> {
  if (!document.querySelector("link[data-moyasar]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${BASE}/moyasar.css`;
    link.dataset.moyasar = "";
    document.head.append(link);
  }
  if (moyasar()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-moyasar]");
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("moyasar_script_failed")), { once: true });
    if (!existing) {
      script.src = `${BASE}/moyasar.js`;
      script.dataset.moyasar = "";
      document.head.append(script);
    }
  });
}

export default function MoyasarForm({
  payment,
  callbackUrl,
  onCompleted,
  onLoadFailed,
}: {
  payment: CardPayment;
  callbackUrl: string;
  onCompleted: (moyasarPaymentId: string) => void;
  onLoadFailed: () => void;
}) {
  const locale = useCurrentLocale();

  useEffect(() => {
    let active = true;
    const container = document.querySelector(ELEMENT);

    loadAssets()
      .then(() => {
        if (!active) return;
        const { amount, currency, description, publishable_api_key, methods, supported_networks, metadata } = payment.moyasar;
        moyasar()?.init({
          element: ELEMENT,
          amount,
          currency,
          description,
          publishable_api_key,
          methods,
          supported_networks,
          metadata,
          language: locale,
          callback_url: callbackUrl,
          ...(payment.givenId ? { given_id: payment.givenId } : {}),
          on_completed: (completed: { id: string }) => {
            onCompleted(completed.id);
            return Promise.resolve();
          },
        });
      })
      .catch(() => active && onLoadFailed());

    return () => {
      active = false;
      if (container) container.innerHTML = "";
    };
  }, [payment, callbackUrl, locale, onCompleted, onLoadFailed]);

  return <div className={`mysr-form ${styles.moyasar}`} dir="ltr" />;
}
