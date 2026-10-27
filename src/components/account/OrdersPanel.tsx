"use client";

import { useState } from "react";
import Link from "next/link";
import { IconCreditCard, IconReceipt, IconSparkles } from "@tabler/icons-react";
import { fetchOrders, type Order, type OrderPage } from "@/api/AccountAPI";
import { formatMoney } from "@/components/booking/wash/draft";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import ErrorRow from "./ErrorRow";
import { formatDateTime, orderNumber, orderTitle, stagger, statusTone } from "./order";
import StatusBadge from "./StatusBadge";
import styles from "./Account.module.css";

function useOrderText(order: Order) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const items = order.items;
  const title = orderTitle(order, locale) || t("orderNumber", { number: orderNumber(order.pubkey) });
  const quantity = items.length === 1 && items[0].quantity > 1 ? ` × ${items[0].quantity}` : "";
  const meta = [order.vehicle && `${order.vehicle.make} · ${order.vehicle.model}`, `#${orderNumber(order.pubkey)}`]
    .filter(Boolean)
    .join(" · ");
  const when = order.scheduledAt
    ? t("scheduledFor", { date: formatDateTime(order.scheduledAt, locale) })
    : t("bookedAsap", { date: formatDateTime(order.createdAt, locale) });
  return { title: title + quantity, meta, when, amount: formatMoney(order.amountPaid ?? order.amountDue, locale) };
}

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

export function LiveOrderCard({ order, index }: { order: Order; index: number }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const { title, meta, when, amount } = useOrderText(order);
  const href = `/${locale}/account/orders/${order.pubkey}`;

  return (
    <article className={`${styles.liveCard} ${styles.reveal}`} style={stagger(index)}>
      <div className={styles.liveTop}>
        <div className={styles.liveTitle}>
          <b className={styles.ellipsis}>{title}</b>
          <span className={styles.muted} dir="auto">
            {meta}
          </span>
        </div>
        <span className={styles.amount}>{amount}</span>
      </div>

      <div className={`${styles.statusBox} ${styles[`statusBox_${statusTone(order.status)}`]}`} role="status">
        <span className={styles.statusDot} aria-hidden />
        <span>
          <b>{t(`status_${order.status}`)}</b>
          <span className={styles.muted}>{when}</span>
        </span>
      </div>

      <div className={styles.btnRow}>
        <Link href={`${href}#tracking`} className={styles.button}>
          {t("track")}
        </Link>
        <Link href={href} className={styles.button}>
          {t("details")}
        </Link>
      </div>
    </article>
  );
}

function HistoryRow({ order }: { order: Order }) {
  const locale = useCurrentLocale();
  const { title, meta, when, amount } = useOrderText(order);

  return (
    <Link href={`/${locale}/account/orders/${order.pubkey}`} className={styles.historyRow}>
      <span className={styles.rowIcon} aria-hidden>
        <IconSparkles size={20} stroke={1.75} />
      </span>
      <span className={styles.rowText}>
        <b className={styles.ellipsis}>{title}</b>
        <span className={`${styles.muted} ${styles.ellipsis}`} dir="auto">
          {when} · {meta}
        </span>
      </span>
      <span className={styles.rowAside}>
        <StatusBadge status={order.status} />
        <span className={styles.amount}>{amount}</span>
      </span>
    </Link>
  );
}

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

  const loadMore = async () => {
    setLoading(true);
    setError("");
    const result = await fetchOrders(page + 1);
    setLoading(false);
    if (!result.ok) return setError(translateError(result.error, locale));
    setMore((prev) => [...prev, ...result.data.data]);
    setPage(page + 1);
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
      <div className={styles.historyList}>
        {orders.map((order) => (
          <HistoryRow key={order.pubkey} order={order} />
        ))}
      </div>
      {error && <ErrorRow message={error} onRetry={loadMore} />}
      {orders.length < firstPage.total && !error && (
        <button type="button" className={styles.button} disabled={loading} onClick={loadMore}>
          {t("loadMore")}
        </button>
      )}
    </>
  );
}
