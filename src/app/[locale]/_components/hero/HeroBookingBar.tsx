"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import styles from "./HeroSection.module.css";

type Option = { value: string; label: string };

type Props = {
  bookHref: string;
  bookLabel: string;
  fields: {
    id: string;
    label: string;
    icon: ReactNode;
    options: Option[];
  }[];
};

export default function HeroBookingBar({ bookHref, bookLabel, fields }: Props) {
  const baseId = useId();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, f.options[0].value])),
  );

  return (
    <div className={styles.bar} role="group">
      {fields.map((field) => {
        const selectId = `${baseId}-${field.id}`;
        const current = field.options.find((o) => o.value === values[field.id]) ?? field.options[0];
        return (
          <div key={field.id} className={styles.field}>
            <span className={styles.fieldIcon} aria-hidden="true">
              {field.icon}
            </span>
            <label htmlFor={selectId} className={styles.fieldText}>
              <span className={styles.fieldLabel}>{field.label}</span>
              <span className={styles.fieldValue}>{current.label}</span>
            </label>
            <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <select
              id={selectId}
              className={styles.select}
              value={values[field.id]}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
            >
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      <Link href={bookHref} className={styles.bookBtn}>
        {bookLabel}
        <svg className={styles.arrow} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
