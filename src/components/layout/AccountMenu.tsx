"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCar, IconLogout, IconUser, IconUserCircle } from "@tabler/icons-react";
import { signOut } from "@/api/AuthAPI";
import styles from "./AccountMenu.module.css";

export type AccountMenuLabels = { menu: string; book: string; account: string; signOut: string };

/** The signed-in header control: a round icon button (styled like the theme toggle) opening a menu. */
export default function AccountMenu({ locale, labels }: { locale: Locale; labels: AccountMenuLabels }) {
  const router = useRouter();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // While open: move focus into the menu, and close on a press anywhere outside it.
  useEffect(() => {
    if (!open) return;
    rootRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") return close();
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = [...(rootRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])];
    const step = event.key === "ArrowDown" ? 1 : -1;
    const index = items.indexOf(document.activeElement as HTMLElement);
    items[(index + step + items.length) % items.length]?.focus();
  };

  const onSignOut = async () => {
    setOpen(false);
    await signOut();
    router.replace(`/${locale}`);
    router.refresh();
  };

  return (
    <div ref={rootRef} className={styles.root} onKeyDown={open ? onKeyDown : undefined}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        aria-label={labels.menu}
        title={labels.menu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
      >
        <IconUser size={18} stroke={2} />
      </button>

      {open && (
        <div id={menuId} role="menu" aria-label={labels.menu} className={styles.menu}>
          <Link
            href={`/${locale}/book/wash`}
            role="menuitem"
            className={`${styles.item} ${styles.primary}`}
            onClick={() => setOpen(false)}
          >
            <IconCar size={18} stroke={2} />
            {labels.book}
          </Link>
          <Link
            href={`/${locale}/account`}
            role="menuitem"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            <IconUserCircle size={18} stroke={2} />
            {labels.account}
          </Link>
          <div className={styles.separator} role="separator" />
          <button type="button" role="menuitem" className={`${styles.item} ${styles.danger}`} onClick={onSignOut}>
            <IconLogout size={18} stroke={2} />
            {labels.signOut}
          </button>
        </div>
      )}
    </div>
  );
}
