import type { ReactNode } from "react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import table from "@/components/table/DataTable.module.css";
import styles from "./Account.module.css";
import sk from "./AccountSkeletons.module.css";

// Booked, assigned, on the way, arrived, washing, done.
const STAGE_WIDTHS = ["34%", "40%", "46%", "36%", "42%", "30%"];
const SUMMARY_WIDTHS = ["52%", "24%", "30%"];
const VISIT_WIDTHS = ["20%", "16%", "26%", "18%", "22%"];

/** Shared by the route's loading screen and by OrderDetail while it fetches, so both look the same. */
export function OrderDetailSkeleton({ back }: { back?: ReactNode }) {
  return (
    <div className={styles.page} aria-busy="true">
      {back ?? <Skeleton width="150px" height="18px" />}

      <div className={styles.detailHead}>
        <div className={styles.detailTitle}>
          <Skeleton width="min(380px, 70vw)" height="40px" />
          <Skeleton width="220px" height="14px" />
        </div>
        <Skeleton width="96px" height="24px" radius="full" />
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.column}>
          <div className={styles.card}>
            <div className={styles.trackHead}>
              <Skeleton width="110px" height="22px" />
              <Skeleton width="96px" height="42px" radius="md" />
            </div>
            <Skeleton height="64px" radius="md" />
            <ol className={styles.tracker}>
              {STAGE_WIDTHS.map((width, i) => (
                <li key={i} className={styles.step}>
                  <Skeleton width="24px" height="24px" radius="circle" />
                  <Skeleton width={width} height="14px" />
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.card}>
            <div className={styles.person}>
              <Skeleton width="46px" height="46px" radius="circle" />
              <span className={styles.detailTitle}>
                <Skeleton width="110px" height="13px" />
                <Skeleton width="150px" height="16px" />
              </span>
            </div>
          </div>
        </div>

        <div className={styles.column}>
          <div className={styles.card}>
            <Skeleton width="100px" height="22px" />
            <div className={styles.lines}>
              {SUMMARY_WIDTHS.map((width, i) => (
                <Line key={i} label={width} />
              ))}
              <div className={`${styles.line} ${styles.lineTotal}`}>
                <Skeleton width="22%" height="18px" />
                <Skeleton width="28%" height="18px" />
              </div>
              <Line label="34%" />
            </div>
          </div>

          <div className={styles.card}>
            <Skeleton width="80px" height="22px" />
            <div className={styles.lines}>
              {VISIT_WIDTHS.map((width, i) => (
                <Line key={i} label={width} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ label }: { label: string }) {
  return (
    <div className={styles.line}>
      <Skeleton width={label} height="14px" />
      <Skeleton width="30%" height="14px" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className={styles.profile}>
      <Skeleton width="44px" height="44px" radius="circle" />
      <span className={styles.profileText}>
        <Skeleton width="120px" height="18px" />
        <Skeleton width="160px" height="13px" />
      </span>
    </div>
  );
}

type SkeletonColumn = { head: string; cell: ReactNode; className?: string };

/** A placeholder in the shared table style: the same headers, folds and row height as the real list. */
function TableSkeleton({ columns, rows }: { columns: SkeletonColumn[]; rows: number }) {
  return (
    <table className={table.table} aria-busy="true">
      <thead>
        <tr>
          {columns.map((column, i) => (
            <th key={i} className={column.className}>
              <Skeleton width={column.head} height="12px" className={column.className === table.num ? sk.end : undefined} />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }, (_, row) => (
          <tr key={row}>
            {columns.map((column, i) => (
              <td key={i} className={column.className}>
                {column.cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const nameCell = (
  <span className={table.cell}>
    <Skeleton width="30px" height="30px" radius="circle" />
    <span className={table.cellText}>
      <Skeleton width="140px" height="15px" />
      <Skeleton width="100px" height="12px" />
    </span>
  </span>
);

const orderColumns: SkeletonColumn[] = [
  { head: "56px", cell: nameCell, className: table.grow },
  { head: "48px", cell: <Skeleton width="150px" height="14px" />, className: table.hideMd },
  { head: "52px", cell: <Skeleton width="120px" height="24px" radius="full" />, className: table.hideMd },
  { head: "44px", cell: <Skeleton width="72px" height="16px" className={sk.end} />, className: table.num },
];

export function LiveOrdersSkeleton() {
  return (
    <TableSkeleton
      rows={3}
      columns={[...orderColumns, { head: "0px", cell: <Skeleton width="64px" height="34px" radius="sm" />, className: table.actions }]}
    />
  );
}

export function HistorySkeleton() {
  return <TableSkeleton rows={5} columns={orderColumns} />;
}

export function CarsSkeleton() {
  return (
    <TableSkeleton
      rows={2}
      columns={[
        { head: "40px", cell: nameCell, className: table.grow },
        { head: "60px", cell: <Skeleton width="64px" height="14px" />, className: table.hideMd },
        { head: "44px", cell: <Skeleton width="56px" height="14px" />, className: table.hideMd },
        { head: "36px", cell: <Skeleton width="40px" height="14px" />, className: table.hideMd },
        { head: "88px", cell: <Skeleton width="88px" height="14px" />, className: table.hideSm },
        { head: "0px", cell: <span className={sk.actions}><Skeleton width="34px" height="34px" radius="sm" /><Skeleton width="34px" height="34px" radius="sm" /></span>, className: table.actions },
      ]}
    />
  );
}

export function AddressSkeleton() {
  return (
    <div className={styles.addressCard} aria-busy="true">
      <div className={styles.addressSearch}>
        <Skeleton height="48px" radius="md" />
      </div>
      <Skeleton height="260px" radius="sm" className={sk.flat} />
      <div className={styles.addressBody}>
        <div className={styles.addressRow}>
          <Skeleton width="42px" height="42px" radius="md" />
          <div className={styles.addressText}>
            <Skeleton width="220px" height="18px" />
            <Skeleton width="160px" height="13px" />
          </div>
        </div>
        <div className={styles.actions}>
          <Skeleton width="170px" height="42px" radius="md" />
          <Skeleton width="150px" height="42px" radius="md" />
        </div>
      </div>
    </div>
  );
}
