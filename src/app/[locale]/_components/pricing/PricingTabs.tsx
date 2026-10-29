"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import styles from "./PricingSection.module.css";

type Row = { id: string; name: string; desc: string; prices: string[] };

type Props = {
  singleLabel: string;
  membershipsLabel: string;
  sizes: string[];
  rows: Row[];
  addOns: string;
  memberships: ReactNode;
};

export default function PricingTabs({ singleLabel, membershipsLabel, sizes, rows, addOns, memberships }: Props) {
  const baseId = useId();
  const [tab, setTab] = useState<"single" | "memberships">("memberships");
  const tabs = [
    { id: "memberships", label: membershipsLabel },
    { id: "single", label: singleLabel },
  ] as const;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setTab((current) => (current === "single" ? "memberships" : "single"));
  };

  return (
    <>
      <div className={styles.tabs} role="tablist" onKeyDown={onKeyDown}>
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`${baseId}-${id}-tab`}
            aria-selected={tab === id}
            aria-controls={`${baseId}-${id}`}
            tabIndex={tab === id ? 0 : -1}
            className={styles.tab}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`${baseId}-single`} aria-labelledby={`${baseId}-single-tab`} hidden={tab !== "single"}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col" className={styles.serviceCol} />
                {sizes.map((size) => (
                  <th key={size} scope="col">
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className={styles.serviceCol}>
                    <span className={styles.serviceName}>{row.name}</span>
                    <span className={styles.serviceDesc}>{row.desc}</span>
                  </th>
                  {row.prices.map((price, i) => (
                    <td key={sizes[i]} data-size={sizes[i]}>
                      {price}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.addOns}>{addOns}</p>
      </div>

      <div role="tabpanel" id={`${baseId}-memberships`} aria-labelledby={`${baseId}-memberships-tab`} hidden={tab !== "memberships"}>
        {memberships}
      </div>
    </>
  );
}
