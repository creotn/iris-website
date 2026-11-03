import { useState } from "react";

export type Sort<K extends string> = { key: K; dir: 1 | -1 } | null;

/**
 * Sorting and paging for a client-side table. Clicking a column sorts by it, clicking again flips
 * the order. `total` lets a table show pages for rows that are not loaded yet.
 */
export function useTableView<T, K extends string>(
  rows: T[],
  sortValue: Record<K, (row: T) => string | number>,
  pageSize: number,
  total = rows.length,
) {
  const [sort, setSort] = useState<Sort<K>>(null);
  const [page, setPage] = useState(1);

  const sorted = sort
    ? [...rows].sort((a, b) => {
        const x = sortValue[sort.key](a);
        const y = sortValue[sort.key](b);
        return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
      })
    : rows;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages);

  const toggleSort = (key: K) => {
    setSort((prev) => (prev?.key === key ? { key, dir: prev.dir === 1 ? -1 : 1 } : { key, dir: 1 }));
    setPage(1);
  };

  return {
    shown: sorted.slice((current - 1) * pageSize, current * pageSize),
    sort,
    toggleSort,
    page: current,
    pages,
    setPage,
  };
}
