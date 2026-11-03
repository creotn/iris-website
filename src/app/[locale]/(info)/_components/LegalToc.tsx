"use client";

import { useEffect, useState } from "react";
import styles from "./LegalDocument.module.css";

type Item = { id: string; title: string };

export default function LegalToc({ label, items }: { label: string; items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = items.find((item) => visible.has(item.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={styles.toc} aria-label={label}>
      <p className={styles.tocLabel}>{label}</p>
      <ol className={styles.tocList}>
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.tocLink} aria-current={item.id === active ? "location" : undefined}>
              <span className={styles.tocNumber}>{String(i + 1).padStart(2, "0")}</span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
