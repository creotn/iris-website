"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import styles from "./HeroSection.module.css";

type Option = { value: string; label: string; price?: string };

type Field = {
  id: string;
  label: string;
  options: Option[];
};

type Props = {
  bookHref: string;
  bookLabel: string;
  groupLabel: string;
  priceLabel: string;
  fields: Field[];
};

function Dropdown({ field, value, onChange }: { field: Field; value: string; onChange: (value: string) => void }) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = Math.max(0, field.options.findIndex((o) => o.value === value));
  const [highlight, setHighlight] = useState(selected);
  const current = field.options[selected];

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const show = () => {
    setHighlight(selected);
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(field.options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const last = field.options.length - 1;
    if (e.key === "Escape") return setOpen(false);
    if (e.key === "Tab") return setOpen(false);
    if (!["ArrowDown", "ArrowUp", "Enter", " ", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    if (!open) return show();
    if (e.key === "ArrowDown") setHighlight((h) => Math.min(h + 1, last));
    else if (e.key === "ArrowUp") setHighlight((h) => Math.max(h - 1, 0));
    else if (e.key === "Home") setHighlight(0);
    else if (e.key === "End") setHighlight(last);
    else choose(highlight);
  };

  return (
    <div ref={rootRef} className={styles.field} data-open={open}>
      <button
        type="button"
        className={styles.trigger}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${baseId}-list`}
        aria-activedescendant={open ? `${baseId}-${highlight}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
      >
        <span className={styles.fieldText}>
          <span className={styles.fieldLabel}>{field.label}</span>
          <span className={styles.fieldValue}>{current.label}</span>
        </span>
        <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul id={`${baseId}-list`} role="listbox" aria-label={field.label} className={styles.menu}>
          {field.options.map((o, i) => (
            <li
              key={o.value}
              id={`${baseId}-${i}`}
              role="option"
              aria-selected={i === selected}
              data-highlight={i === highlight}
              className={styles.option}
              onPointerEnter={() => setHighlight(i)}
              onClick={() => choose(i)}
            >
              <span>{o.label}</span>
              {i === selected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function HeroBookingBar({ bookHref, bookLabel, groupLabel, priceLabel, fields }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, f.options[0].value])),
  );

  // The price of the chosen service, shown in its own column.
  const priced = fields.find((f) => f.options.some((o) => o.price));
  const price = priced?.options.find((o) => o.value === values[priced.id])?.price;

  return (
    <>
      <div
        className={styles.bar}
        role="group"
        aria-label={groupLabel}
        style={{ "--fields": fields.length + (price ? 1 : 0) } as CSSProperties}
      >
        {fields.map((field) => (
          <Dropdown
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={(value) => setValues((prev) => ({ ...prev, [field.id]: value }))}
          />
        ))}

        {price && (
          <div className={styles.field}>
            <span className={styles.fieldText}>
              <span className={styles.fieldLabel}>{priceLabel}</span>
              <span className={styles.fieldValue} aria-live="polite">
                {price}
              </span>
            </span>
          </div>
        )}

        <Link href={bookHref} className={styles.bookBtn}>
          {bookLabel}
        </Link>
      </div>
    </>
  );
}
