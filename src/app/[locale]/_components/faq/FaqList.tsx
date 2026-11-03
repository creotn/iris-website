"use client";

import { useId, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { FaqContent } from "./faq.content";
import styles from "./FaqSection.module.css";

export default function FaqList({ items }: { items: FaqContent["items"] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  // Arrow keys, Home and End move between the questions, as in the WAI-ARIA accordion pattern.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const triggers = Array.from(
      e.currentTarget.closest("ul")?.querySelectorAll<HTMLButtonElement>("button[data-faq]") ?? [],
    );
    const at = triggers.indexOf(e.currentTarget);
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? triggers.length - 1 : (at + (e.key === "ArrowDown" ? 1 : -1) + triggers.length) % triggers.length;
    e.preventDefault();
    triggers[next]?.focus();
  };

  return (
    <ul className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.question} className={styles.item} data-open={isOpen} style={{ "--i": i } as CSSProperties}>
            <h3 className={styles.heading}>
              <button
                type="button"
                data-faq
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${i}`}
                id={`${baseId}-${i}-btn`}
                onClick={() => setOpen(isOpen ? null : i)}
                onKeyDown={onKeyDown}
              >
                <span className={styles.question}>{item.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>

            <div id={`${baseId}-${i}`} className={styles.panel} role="region" aria-labelledby={`${baseId}-${i}-btn`}>
              <div className={styles.panelInner}>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
