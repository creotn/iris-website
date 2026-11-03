"use client";

import { useEffect, useRef, useState } from "react";
import { IconCar, IconCarSuv, IconChevronLeft, IconChevronRight, IconDots, IconMotorbike, IconSelector, IconTruck } from "@tabler/icons-react";
import type { Sort } from "./useTableView";
import styles from "./DataTable.module.css";

/** A column header that sorts its table when clicked. */
export function SortHeader<K extends string>({
  column,
  label,
  sort,
  onSort,
  className,
}: {
  column: K;
  label: string;
  sort: Sort<K>;
  onSort: (key: K) => void;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={className}
      aria-sort={sort?.key === column ? (sort.dir === 1 ? "ascending" : "descending") : undefined}
    >
      <button type="button" className={styles.sortBtn} onClick={() => onSort(column)}>
        {label}
        <IconSelector size={14} stroke={1.75} aria-hidden />
      </button>
    </th>
  );
}

/** Numbered pages with previous and next arrows. Renders nothing for a single page. */
export function Pager({
  page,
  pages,
  onPage,
  label,
  previous,
  next,
}: {
  page: number;
  pages: number;
  onPage: (page: number) => void;
  label: string;
  previous: string;
  next: string;
}) {
  if (pages <= 1) return null;
  return (
    <nav className={styles.pager} aria-label={label}>
      <button type="button" className={styles.pageBtn} disabled={page === 1} onClick={() => onPage(page - 1)} aria-label={previous}>
        <IconChevronLeft size={18} stroke={2} aria-hidden />
      </button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          className={`${styles.pageBtn} ${number === page ? styles.pageOn : ""}`}
          aria-current={number === page ? "page" : undefined}
          onClick={() => onPage(number)}
        >
          {number}
        </button>
      ))}
      <button type="button" className={styles.pageBtn} disabled={page === pages} onClick={() => onPage(page + 1)} aria-label={next}>
        <IconChevronRight size={18} stroke={2} aria-hidden />
      </button>
    </nav>
  );
}

// Brand marks use each maker's own colour; unknown makes fall back to the IRIS violet.
const BRAND_COLORS: Record<string, string> = {
  toyota: "#eb0a1e",
  lexus: "#1a1a1a",
  hyundai: "#002c5f",
  kia: "#05141f",
  nissan: "#c3002f",
  ford: "#1c396d",
  chevrolet: "#c99a2e",
  gmc: "#cc0000",
  honda: "#cc0000",
  mazda: "#101010",
  mitsubishi: "#e60012",
  mercedes: "#1a1a1a",
  bmw: "#0066b1",
  audi: "#1a1a1a",
  volkswagen: "#001e50",
  changan: "#0050a0",
  geely: "#1b4f9c",
  mg: "#a6192e",
};

const CAR_COLORS: Record<string, string> = {
  white: "#f4f4f2",
  black: "#1a1a1a",
  silver: "#c3c7cc",
  grey: "#7a7f87",
  gray: "#7a7f87",
  beige: "#d8c7a3",
  gold: "#c9a646",
  red: "#b3261e",
  blue: "#1f4e9c",
  brown: "#6b4a32",
  green: "#2f6b45",
  أبيض: "#f4f4f2",
  أسود: "#1a1a1a",
  فضي: "#c3c7cc",
  رمادي: "#7a7f87",
  بيج: "#d8c7a3",
  ذهبي: "#c9a646",
  أحمر: "#b3261e",
  أزرق: "#1f4e9c",
  بني: "#6b4a32",
  أخضر: "#2f6b45",
};

/** A round badge with the car make's initial, in the make's colour. */
export function BrandMark({ make }: { make: string | null | undefined }) {
  const name = (make ?? "").trim();
  const color = BRAND_COLORS[name.toLowerCase().split(/[\s-]/)[0]];
  return (
    <span className={styles.mark} style={color ? { background: color } : undefined} aria-hidden>
      {name.charAt(0).toUpperCase() || "•"}
    </span>
  );
}

/** A car colour name with a dot in that colour, when the name is a known one. */
export function CarColor({ color }: { color: string | null | undefined }) {
  if (!color) return <span className={styles.none}>–</span>;
  const dot = CAR_COLORS[color.trim().toLowerCase()];
  return (
    <>
      {dot && <span className={styles.colorDot} style={{ background: dot }} aria-hidden />}
      {color}
    </>
  );
}

/** A rounded tile with an icon for the vehicle type. */
export function VehicleMark({ type }: { type: string }) {
  const Icon = type === "MOTORCYCLE" ? IconMotorbike : type === "TRUCK" ? IconTruck : type === "SUV" ? IconCarSuv : IconCar;
  return (
    <span className={styles.typeMark} aria-hidden>
      <Icon size={20} stroke={1.75} />
    </span>
  );
}

/** A plate number drawn like a Saudi plate: a light tag with the blue band. */
export function Plate({ number }: { number: string | null | undefined }) {
  if (!number) return <span className={styles.none}>–</span>;
  return (
    <span className={styles.plate} dir="ltr">
      {number}
    </span>
  );
}

/** A "…" button opening a small menu of row actions. */
export function RowMenu({ label, items }: { label: string; items: { label: string; onSelect: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <span ref={root} className={styles.menuRoot} onClick={(event) => event.stopPropagation()}>
      <button type="button" className={styles.iconBtn} aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <IconDots size={18} stroke={2} aria-hidden />
      </button>
      {open && (
        <span className={styles.menu} role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`${styles.menuItem} ${item.danger ? styles.menuDanger : ""}`}
              onClick={() => {
                setOpen(false);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}
