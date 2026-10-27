"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import styles from "./Header.module.css";

const DESKTOP_QUERY = "(min-width: 1025px)";

export default function MobileMenu({
  labels,
  children,
}: {
  labels: { open: string; close: string; menu: string };
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => query.matches && dialogRef.current?.close();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.closest("a")) dialogRef.current?.close();
  };

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        onClick={show}
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <IconMenu2 size={20} stroke={2} />
      </button>

      <dialog
        id="mobile-menu"
        ref={dialogRef}
        className={styles.drawer}
        aria-label={labels.menu}
        onClose={() => setOpen(false)}
        onClick={onClick}
      >
        <div className={styles.drawerPanel}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.close}
          >
            <IconX size={20} stroke={2} />
          </button>
          {children}
        </div>
      </dialog>
    </>
  );
}
