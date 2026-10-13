"use client";

import clsx from "clsx";
import { useState } from "react";
import styles from "./AppPrototype.module.css";

export default function ChipGroup({
  options,
  initial = 0,
  grid = false,
}: {
  options: string[];
  initial?: number;
  grid?: boolean;
}) {
  const [selected, setSelected] = useState(initial);

  return (
    <div className={grid ? styles.chipsGrid : styles.chips}>
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          className={clsx(styles.chip, index === selected && styles.chipActive)}
          onClick={() => setSelected(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
