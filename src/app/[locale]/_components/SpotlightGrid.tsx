"use client";

import type { PointerEvent, ReactNode } from "react";

export default function SpotlightGrid({ className, children }: { className: string; children: ReactNode }) {
  function onPointerMove(e: PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <ul className={className} onPointerMove={onPointerMove}>
      {children}
    </ul>
  );
}
