"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { IconCar, IconCircleCheck, IconClock, IconMapPin, IconPlus, IconSparkles } from "@tabler/icons-react";
import { fetchBalance, fetchCustomer, fetchOrders, verifyTopUp, type Customer } from "@/api/AccountAPI";
import { fetchAddress, fetchVehicles } from "@/api/BookingAPI";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { formatMoney } from "@/components/booking/wash/draft";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import AddressPanel from "./AddressPanel";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import { awaitsPayment, isActive, stagger, type View } from "./order";
import { LiveOrderCard, OrderHistory, PaymentCard } from "./OrdersPanel";
import TopUp from "./TopUp";
import { useResource } from "./useResource";
import VehiclesPanel from "./VehiclesPanel";
import styles from "./Account.module.css";

const fetchFirstOrders = () => fetchOrders(0);

export default function AccountView({ initialView }: { initialView: View }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [view, setView] = useState(initialView);

  const show = (next: View) => {
    setView(next);
    window.history.replaceState(null, "", next === "live" ? window.location.pathname : `?view=${next}`);
  };
  const customer = useResource(fetchCustomer);
  const balance = useResource(fetchBalance);
  const orders = useResource(fetchFirstOrders);
  const vehicles = useResource(fetchVehicles);
  const address = useResource(fetchAddress);
  const [toppingUp, setToppingUp] = useState(false);
  const [toast, setToast] = useState("");

  const reloadBalance = balance.reload;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topUp = params.get("topup");
    const transaction = params.get("tx");
    const paymentId = params.get("id");
    if (!topUp || !transaction || !paymentId) return;
    window.history.replaceState(null, "", window.location.pathname);
    verifyTopUp(topUp, transaction, paymentId).then((result) => {
      setToast(result.ok ? t("walletUpdated") : translateError(result.error, locale));
      reloadBalance();
    });
  }, [t, locale, reloadBalance]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  const active = orders.data?.data.filter((order) => isActive(order.status)) ?? [];
  const unpaid = active.filter(awaitsPayment);
  const live = active.filter((order) => !awaitsPayment(order));

  return (
    <div className={styles.page}>
      {customer.error && !customer.data && <ErrorRow message={customer.error} onRetry={customer.reload} />}

      <section className={`${styles.hero} ${styles.reveal}`}>
        <div>
          {customer.data ? <HeroMeta customer={customer.data} /> : <Skeleton width="60%" height="44px" radius="full" />}
          <h1 className={styles.heroTitle} dir="auto">
            {customer.data?.user.firstName ? t("hello", { name: customer.data.user.firstName }) : t("title")}
          </h1>
          {orders.data ? (
            <p className={styles.heroSummary}>
              {active.length === 0
                ? t("summaryNone")
                : active.length === 1
                  ? t("summaryOne")
                  : t("summaryMany", { count: active.length })}
              {unpaid.length > 0 && ` ${unpaid.length === 1 ? t("payOne") : t("payMany", { count: unpaid.length })}`}
            </p>
          ) : (
            <Skeleton width="70%" height="20px" />
          )}
        </div>

        <div className={styles.heroAside}>
          <div className={styles.walletCard}>
            <span>
              {t("wallet")}
              <b>{balance.data ? formatMoney(balance.data.balance, locale) : "—"}</b>
            </span>
            {balance.data && (
              <button type="button" className={styles.topUpBtn} onClick={() => setToppingUp(true)}>
                {t("topUp")}
              </button>
            )}
          </div>
          <Link href={`/${locale}/book/wash`} className={styles.limeBtn}>
            <IconPlus size={20} stroke={2.5} aria-hidden />
            {t("book")}
          </Link>
        </div>
      </section>

      <div className={styles.tiles} role="tablist" aria-label={t("title")}>
        <Tile
          view="live"
          current={view}
          onSelect={show}
          index={1}
          icon={<IconSparkles size={20} stroke={1.75} />}
          title={t("liveOrders")}
          detail={orders.data ? (active.length > 0 ? t("liveCount", { count: active.length }) : t("liveNone")) : null}
        />
        <Tile
          view="cars"
          current={view}
          onSelect={show}
          index={2}
          icon={<IconCar size={20} stroke={1.75} />}
          title={t("tileCars")}
          detail={
            vehicles.data
              ? vehicles.data.length > 0
                ? `${t("carsSaved", { count: vehicles.data.length })} · ${[...new Set(vehicles.data.map((car) => car.make))].join(", ")}`
                : t("carsNone")
              : null
          }
        />
        <Tile
          view="address"
          current={view}
          onSelect={show}
          index={3}
          icon={<IconMapPin size={20} stroke={1.75} />}
          title={t("tileAddress")}
          detail={address.data ? (address.data.address?.address ?? t("addressNone")) : null}
        />
        <Tile
          view="history"
          current={view}
          onSelect={show}
          index={4}
          icon={<IconClock size={20} stroke={1.75} />}
          title={t("tileHistory")}
          detail={t("historyHint")}
        />
      </div>

      <section key={view} id={`panel-${view}`} role="tabpanel" aria-labelledby={`tab-${view}`} className={`${styles.section} ${styles.reveal}`}>
        {view === "live" && (
          <>
            {unpaid.map((order, index) => (
              <PaymentCard key={order.pubkey} order={order} index={index} />
            ))}
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{t("liveOrders")}</h2>
              <button type="button" className={styles.seeAll} onClick={() => show("history")}>
                {t("seeAll")}
              </button>
            </div>
            {orders.error && <ErrorRow message={orders.error} onRetry={orders.reload} />}
            {!orders.data && !orders.error && (
              <div className={styles.liveGrid} aria-busy="true">
                <Skeleton height="230px" radius="lg" />
                <Skeleton height="230px" radius="lg" />
              </div>
            )}
            {orders.data &&
              (live.length > 0 ? (
                <div className={styles.liveGrid}>
                  {live.map((order, index) => (
                    <LiveOrderCard key={order.pubkey} order={order} index={index} />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>
                    <IconSparkles size={26} stroke={1.75} aria-hidden />
                  </span>
                  <b>{t("noLive")}</b>
                  <p>{t("noLiveHint")}</p>
                  <Link href={`/${locale}/book/wash`} className={`${styles.button} ${styles.primary}`}>
                    {t("book")}
                  </Link>
                </div>
              ))}
          </>
        )}

        {view === "cars" && (
          <>
            <h2 className={styles.sectionTitle}>{t("tileCars")}</h2>
            <VehiclesPanel vehicles={vehicles.data} error={vehicles.error} reload={vehicles.reload} />
          </>
        )}

        {view === "address" && (
          <>
            <h2 className={styles.sectionTitle}>{t("tileAddress")}</h2>
            <AddressPanel saved={address.data} error={address.error} reload={address.reload} />
          </>
        )}

        {view === "history" && (
          <>
            <h2 className={styles.sectionTitle}>{t("history")}</h2>
            {orders.data ? <OrderHistory firstPage={orders.data} /> : <Skeleton height="220px" radius="lg" />}
          </>
        )}
      </section>

      {balance.data && (
        <Dialog open={toppingUp} onClose={() => setToppingUp(false)} title={t("topUpTitle")}>
          <TopUp
            balance={balance.data}
            onDone={(amount) => {
              setToppingUp(false);
              setToast(t("topUpDone", { amount }));
              balance.reload();
            }}
          />
        </Dialog>
      )}

      {toast && (
        <div className={styles.toast} role="status">
          <IconCircleCheck size={20} stroke={2} aria-hidden />
          {toast}
        </div>
      )}
    </div>
  );
}

function HeroMeta({ customer }: { customer: Customer }) {
  const t = useScopedI18n("account");
  const { user } = customer;
  const initials = [user.firstName, user.lastName].map((part) => part?.trim()[0] ?? "").join("") || "?";
  const contacts = [user.email, user.phone].filter(Boolean);
  const unverified = (user.email && !user.emailVerifiedAt) || (user.phone && !user.phoneVerifiedAt);

  return (
    <div className={styles.heroMeta}>
      <span className={styles.heroAvatar} aria-hidden>
        {initials}
      </span>
      <span dir="ltr">{contacts.join(" · ")}</span>
      {unverified && <span>({t("notVerified")})</span>}
    </div>
  );
}

function Tile({
  view,
  current,
  onSelect,
  index,
  icon,
  title,
  detail,
}: {
  view: View;
  current: View;
  onSelect: (view: View) => void;
  index: number;
  icon: ReactNode;
  title: string;
  detail: string | null;
}) {
  const selected = view === current;
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${view}`}
      aria-selected={selected}
      aria-controls={`panel-${view}`}
      className={`${styles.tile} ${selected ? styles.tileOn : ""} ${styles.reveal}`}
      style={stagger(index)}
      onClick={() => onSelect(view)}
    >
      <span className={styles.tileIcon} aria-hidden>
        {icon}
      </span>
      <span className={styles.tileText}>
        <b>{title}</b>
        {detail === null ? (
          <Skeleton width="80%" height="12px" />
        ) : (
          <span className={`${styles.muted} ${styles.ellipsis}`} dir="auto">
            {detail}
          </span>
        )}
      </span>
    </button>
  );
}
