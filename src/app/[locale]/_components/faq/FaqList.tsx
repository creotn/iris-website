"use client";

import { useId, useState, type CSSProperties } from "react";
import type { FaqContent } from "./faq.content";
import styles from "./FaqSection.module.css";

export default function FaqList({ items }: { items: FaqContent["items"] }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <ul className={styles.list}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.question} className={styles.item} data-open={isOpen} style={{ "--i": i } as CSSProperties}>
            <h3 className={styles.heading}>
              <button
                type="button"
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={`${baseId}-${i}`}
                id={`${baseId}-${i}-btn`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={styles.question}>{item.question}</span>
                <span className={styles.icon} aria-hidden="true">
                  <i />
                  <i />
                </span>
              </button>
            </h3>

            <div id={`${baseId}-${i}`} className={styles.panel} role="region" aria-labelledby={`${baseId}-${i}-btn`}>
              <p className={styles.answer}>{item.answer}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
