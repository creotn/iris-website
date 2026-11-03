"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import type { Area, CoverageContent } from "./coverage.content";
import styles from "./CoverageSection.module.css";

const CoverageMap = dynamic(() => import("./CoverageMap"), { ssr: false });

type Props = {
  locale: Locale;
  areas: Area[];
  content: CoverageContent;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/(^|\s)(al[\s-]?|ال)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export default function CoverageShowcase({ locale, areas, content }: Props) {
  const inputId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const points = useMemo(
    () =>
      areas.map((area, i) => ({
        id: String(i),
        name: area.name[locale],
        lat: area.lat,
        lng: area.lng,
      })),
    [areas, locale],
  );

  const needle = normalize(query);
  const matches = needle
    ? areas.flatMap((area, i) =>
        normalize(area.name.en).includes(needle) ||
        normalize(area.name.ar).includes(needle)
          ? [i]
          : [],
      )
    : [];
  const active = matches[0] ?? -1;
  const match = active >= 0 ? points[active].name : "";
  const state = !needle ? "idle" : matches.length ? "yes" : "no";

  return (
    <>
      {/* The map fills the whole section; the question sits on a panel over it. */}
      <div className={styles.map}>
        <CoverageMap
          points={points}
          active={active}
          onSelect={(i) => setQuery(points[i].name)}
          label={content.mapLabel}
          region={content.titleAccent}
          overlay={panelRef}
        />
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.ask} ref={panelRef}>
          <div className={styles.head}>
            <h2 className={styles.title}>{content.question}</h2>
            <p className={styles.subtitle}>{content.subtitle}</p>
          </div>

          <div className={styles.search}>
            <label htmlFor={inputId} className={styles.srOnly}>
              {content.inputLabel}
            </label>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              id={inputId}
              className={styles.input}
              type="search"
              value={query}
              placeholder={content.placeholder}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div aria-live="polite">
            {state === "yes" && (
              <div className={styles.answer} data-state="yes">
                <p className={styles.result}>
                  <strong className={styles.yes}>{content.yes}</strong> {content.yesText.replace("{name}", match)}
                </p>
                <Link href={`/${locale}/book/wash`} className={styles.cta}>
                  {content.book}
                </Link>
              </div>
            )}
            {state === "no" && (
              <div className={styles.answer} data-state="no">
                <p className={styles.result}>
                  <strong>{content.no}</strong> <span className={styles.muted}>{content.noText}</span>
                </p>
              </div>
            )}
          </div>

          <ul className={styles.districts}>
            {points.map((p, i) => {
              const hit = matches.includes(i);
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={styles.district}
                    data-state={i === active ? "active" : needle && !hit ? "miss" : "idle"}
                    aria-pressed={i === active}
                    onClick={() => setQuery(p.name)}
                  >
                    <svg className={styles.pin} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {p.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
