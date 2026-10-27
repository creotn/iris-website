"use client";

import { IconArrowUp } from "@tabler/icons-react";
import { MASCOT_EVENT, type MascotEventDetail } from "./footer.content";
import styles from "./Footer.module.css";

const tell = (detail: MascotEventDetail) => window.dispatchEvent(new CustomEvent<MascotEventDetail>(MASCOT_EVENT, { detail }));

export default function FooterBackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.top}
      aria-label={label}
      title={label}
      onPointerEnter={(e) => e.pointerType === "mouse" && tell({ pose: "dash" })}
      onClick={() => {
        tell({ pose: "dash", fly: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <span className={styles.topArrow} aria-hidden="true">
        <IconArrowUp size={20} stroke={2.25} />
      </span>
    </button>
  );
}
