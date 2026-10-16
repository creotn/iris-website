"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconX } from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import styles from "./Account.module.css";

/**
 * A native modal `<dialog>`: the browser traps focus, closes it on Escape and restores focus after.
 * The content only mounts while open, so every opening starts with a fresh form.
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const t = useScopedI18n("account");
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
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      // A click on the dialog element itself, not its body, is a click on the backdrop.
      onClick={(event) => event.target === ref.current && onClose()}
    >
      {open && (
        <div className={styles.dialogBody}>
          <div className={styles.dialogHead}>
            <div>
              <h2 id={titleId} className={styles.dialogTitle}>
                {title}
              </h2>
              {description && <p className={styles.dialogText}>{description}</p>}
            </div>
            <button type="button" className={styles.iconBtn} onClick={onClose} aria-label={t("close")}>
              <IconX size={18} stroke={2} aria-hidden />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
