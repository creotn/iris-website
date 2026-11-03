"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCreditCard, IconReceipt } from "@tabler/icons-react";
import { fetchOrders, type Order, type OrderPage } from "@/api/AccountAPI";
import { formatMoney } from "@/components/booking/wash/draft";
import { BrandMark, Pager, SortHeader } from "@/components/table/TableParts";
import table from "@/components/table/DataTable.module.css";
import { useTableView } from "@/components/table/useTableView";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import ErrorRow from "./ErrorRow";
import { formatDateTime, orderNumber, orderTitle, stagger, stageIndex } from "./order";
import StatusBadge from "./StatusBadge";
import styles from "./Account.module.css";

const PAGE_SIZE = 10;

type SortKey = "order" | "when" | "status" | "price";

const orderTime = (order: Order) => new Date(order.scheduledAt ?? order.createdAt).getTime();
const orderAmount = (order: Order) => Number(order.amountPaid ?? order.amountDue);

function useOrderText(order: Order) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const items = order.items;
  const title = orderTitle(order, locale) || t("orderNumber", { number: orderNumber(order.pubkey) });
  const quantity = items.length === 1 && items[0].quantity > 1 ? ` × ${items[0].quantity}` : "";
  const car = order.vehicle ? `${order.vehicle.make} ${order.vehicle.model}` : "";
  const meta = [order.vehicle && `${order.vehicle.make} · ${order.vehicle.model}`, `#${orderNumber(order.pubkey)}`]
    .filter(Boolean)
    .join(" · ");
  const when = order.scheduledAt
    ? t("scheduledFor", { date: formatDateTime(order.scheduledAt, locale) })
    : t("bookedAsap", { date: formatDateTime(order.createdAt, locale) });
  return { title: title + quantity, car, meta, when, amount: formatMoney(order.amountPaid ?? order.amountDue, locale) };
}

/** The banner above the live orders for a booking that still has to be paid. */
export function PaymentCard({ order, index }: { order: Order; index: number }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const { title, meta, when, amount } = useOrderText(order);

  return (
    <div className={`${styles.payCard} ${styles.reveal}`} style={stagger(index)}>
      <span className={styles.payIcon} aria-hidden>
        <IconCreditCard size={24} stroke={1.75} />
      </span>
      <Link href={`/${locale}/account/orders/${order.pubkey}`} className={styles.payText}>
        <span className={styles.eyebrow}>{t("paymentNeeded")}</span>
        <b className={`${styles.payTitle} ${styles.ellipsis}`}>{title}</b>
        <span className={styles.muted} dir="auto">
          {meta} · {when}
        </span>
      </Link>
      <Link href={`/${locale}/book/wash?booking=${order.pubkey}`} className={styles.darkBtn}>
        {t("payAmount", { amount })}
      </Link>
    </div>
  );
}

/**
 * Orders as a sortable, paged table in the same style as the booking car table. A row opens the
 * order; live orders also get a Track button. `total` and `onNeedRows` let it page through orders
 * that are still on the server.
 */
function OrdersTable({
  orders,
  live,
  total,
  onNeedRows,
}: {
  orders: Order[];
  live?: boolean;
  total?: number;
  onNeedRows?: (count: number) => void;
}) {
  const t = useScopedI18n("account");
  const view = useTableView<Order, SortKey>(
    orders,
    {
      order: (order) => orderTitle(order, "en").toLowerCase(),
      when: orderTime,
      // Live orders sort by how far along they are; closed ones by their status name.
      status: (order) => (live ? stageIndex(order.status) : order.status),
      price: orderAmount,
    },
    PAGE_SIZE,
    total,
  );

  const goTo = (page: number) => {
    view.setPage(page);
    if (page * PAGE_SIZE > orders.length) onNeedRows?.(page * PAGE_SIZE);
  };

  return (
    <>
      <table className={`${table.table} ${table.clickable}`}>
        <thead>
          <tr>
            <SortHeader column="order" label={t("colOrder")} sort={view.sort} onSort={view.toggleSort} />
            <SortHeader column="when" label={t("colWhen")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
            <SortHeader column="status" label={t("colStatus")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
            <SortHeader column="price" label={t("colPrice")} sort={view.sort} onSort={view.toggleSort} className={table.num} />
            {live && (
              <th scope="col" className={table.actions}>
                <span className={styles.srOnly}>{t("colActions")}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {view.shown.map((order) => (
            <OrderRow key={order.pubkey} order={order} live={live} />
          ))}
        </tbody>
      </table>
      <Pager page={view.page} pages={view.pages} onPage={goTo} label={t("colOrder")} previous={t("previousPage")} next={t("nextPage")} />
    </>
  );
}

function OrderRow({ order, live }: { order: Order; live?: boolean }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const router = useRouter();
  const { title, car, when, amount } = useOrderText(order);
  const href = `/${locale}/account/orders/${order.pubkey}`;

  return (
    <tr onClick={() => router.push(href)}>
      <td className={table.grow}>
        <span className={table.cell}>
          <BrandMark make={order.vehicle?.make} />
          <span className={table.cellText}>
            {/* The link keeps the row reachable by keyboard; the row click covers the mouse. */}
            <Link href={href} onClick={(event) => event.stopPropagation()}>
              {title}
            </Link>
            <span className={table.cellSub} dir="auto">
              {[car, `#${orderNumber(order.pubkey)}`].filter(Boolean).join(" · ")}
            </span>
            <span className={table.cellMeta}>
              {when} · {t(`status_${order.status}`)}
            </span>
          </span>
        </span>
      </td>
      <td className={table.hideMd}>{when}</td>
      <td className={table.hideMd}>
        <StatusBadge status={order.status} />
      </td>
      <td className={`${table.num} ${table.strong}`}>{amount}</td>
      {live && (
        <td className={table.actions} onClick={(event) => event.stopPropagation()}>
          <span>
            <Link href={`${href}#tracking`} className={table.actionBtn}>
              {t("track")}
            </Link>
          </span>
        </td>
      )}
    </tr>
  );
}

/** Live orders, ordered by how far along they are. */
export function LiveOrdersTable({ orders }: { orders: Order[] }) {
  return <OrdersTable orders={orders} live />;
}

/** Every past order, loading further pages from the server as the user pages through them. */
export function OrderHistory({ firstPage }: { firstPage: OrderPage }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [more, setMore] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const orders = [...firstPage.data, ...more].filter(
    (order, index, all) => all.findIndex((other) => other.pubkey === order.pubkey) === index,
  );

  // Fetches server pages until at least `count` orders are loaded (or there are no more).
  const loadUpTo = async (count: number) => {
    if (loading) return;
    setLoading(true);
    setError("");
    let next = page;
    let loaded = orders.length;
    const fetched: Order[] = [];
    while (loaded < Math.min(count, firstPage.total)) {
      const result = await fetchOrders(next + 1);
      if (!result.ok) {
        setError(translateError(result.error, locale));
        break;
      }
      if (result.data.data.length === 0) break;
      fetched.push(...result.data.data);
      loaded += result.data.data.length;
      next += 1;
    }
    setMore((prev) => [...prev, ...fetched]);
    setPage(next);
    setLoading(false);
  };

  if (orders.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>
          <IconReceipt size={26} stroke={1.75} aria-hidden />
        </span>
        <b>{t("noOrders")}</b>
        <p>{t("noOrdersHint")}</p>
        <Link href={`/${locale}/book/wash`} className={`${styles.button} ${styles.primary}`}>
          {t("book")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <OrdersTable orders={orders} total={firstPage.total} onNeedRows={loadUpTo} />
      {error && <ErrorRow message={error} onRetry={() => loadUpTo(orders.length + PAGE_SIZE)} />}
    </>
  );
}
