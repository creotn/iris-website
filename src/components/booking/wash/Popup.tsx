"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconX } from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import styles from "./Wash.module.css";

/** The booking flow's modal: a centred card on desktop, a bottom sheet on phones. */
export default function Popup({
  open,
  onClose,
  title,
  subtitle,
  size = "sm",
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: "sm" | "md";
  children: ReactNode;
}) {
  const ta = useScopedI18n("account");
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={`${styles.popup} ${size === "md" ? styles.popupMd : ""}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
    >
      {open && (
        <div className={styles.popBody}>
          <button type="button" className={styles.popClose} onClick={onClose} aria-label={ta("close")}>
            <IconX size={20} stroke={2} aria-hidden />
          </button>

          <div className={styles.popHead}>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>

          {children}
        </div>
      )}
    </dialog>
  );
}
