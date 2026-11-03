"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconAlertCircle, IconCircleCheck, IconSparkles } from "@tabler/icons-react";
import { fetchBalance, fetchCustomer, fetchOrders, verifyTopUp, type Customer } from "@/api/AccountAPI";
import { fetchAddress, fetchVehicles } from "@/api/BookingAPI";
import { formatMoney } from "@/components/booking/wash/draft";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { HistorySkeleton, LiveOrdersSkeleton, ProfileSkeleton } from "./AccountSkeletons";
import AddressPanel from "./AddressPanel";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import { awaitsPayment, isActive, type View } from "./order";
import { LiveOrdersTable, OrderHistory, PaymentCard } from "./OrdersPanel";
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

  const user = customer.data?.user;
  const unverified = !!user && ((!!user.email && !user.emailVerifiedAt) || (!!user.phone && !user.phoneVerifiedAt));

  const menu: { view: View; label: string; meta: string }[] = [
    { view: "live", label: t("liveOrders"), meta: orders.data ? String(active.length) : "" },
    { view: "history", label: t("tileHistory"), meta: "" },
    { view: "cars", label: t("tileCars"), meta: vehicles.data ? String(vehicles.data.length) : "" },
    { view: "address", label: t("tileAddress"), meta: "" },
  ];

  return (
    <div className={`${styles.page} ${styles.shell}`}>
      {/* ---- Side menu: who you are, the booking button, the sections ---- */}
      <aside className={styles.side}>
        {customer.data ? <Profile customer={customer.data} /> : <ProfileSkeleton />}

        <Link href={`/${locale}/book/wash`} className={styles.sideBook}>
          {t("book")}
        </Link>

        <nav className={styles.sideNav} aria-label={t("title")}>
          {menu.map((item) => (
            <button
              key={item.view}
              type="button"
              className={styles.sideItem}
              aria-current={view === item.view ? "page" : undefined}
              onClick={() => show(item.view)}
            >
              <span>{item.label}</span>
              {item.meta && <span className={styles.sideMeta}>{item.meta}</span>}
            </button>
          ))}
          <button type="button" className={styles.sideItem} onClick={() => setToppingUp(true)} disabled={!balance.data}>
            <span>{t("wallet")}</span>
            <span className={styles.sideMeta}>{balance.data ? formatMoney(balance.data.balance, locale) : ""}</span>
          </button>
        </nav>

        {unverified && (
          <p className={styles.notice}>
            <IconAlertCircle size={18} stroke={2} aria-hidden />
            {t("verifyNotice")}
          </p>
        )}
      </aside>

      <main className={styles.mainCol}>
        {customer.error && !customer.data && <ErrorRow message={customer.error} onRetry={customer.reload} />}

        {view === "live" && (
          <>
            <div className={styles.mainHead}>
              <h1 className={styles.mainTitle}>{t("liveOrders")}</h1>
              {orders.data && <span className={styles.muted}>{active.length > 0 ? t("liveCount", { count: active.length }) : t("liveNone")}</span>}
            </div>

            {unpaid.map((order, index) => (
              <PaymentCard key={order.pubkey} order={order} index={index} />
            ))}

            {orders.error && <ErrorRow message={orders.error} onRetry={orders.reload} />}
            {!orders.data && !orders.error && <LiveOrdersSkeleton />}
            {orders.data &&
              (live.length > 0 ? (
                <LiveOrdersTable orders={live} />
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
            <VehiclesPanel title={t("tileCars")} vehicles={vehicles.data} error={vehicles.error} reload={vehicles.reload} />
          </>
        )}

        {view === "address" && (
          <>
            <h1 className={styles.mainTitle}>{t("tileAddress")}</h1>
            <AddressPanel saved={address.data} error={address.error} reload={address.reload} />
          </>
        )}

        {view === "history" && (
          <>
            <h1 className={styles.mainTitle}>{t("history")}</h1>
            {orders.data ? <OrderHistory firstPage={orders.data} /> : <HistorySkeleton />}
          </>
        )}
      </main>

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

function Profile({ customer }: { customer: Customer }) {
  const t = useScopedI18n("account");
  const { user } = customer;
  const initials = [user.firstName, user.lastName].map((part) => part?.trim()[0] ?? "").join("").toUpperCase() || "?";

  return (
    <div className={styles.profile}>
      <span className={styles.sideAvatar} aria-hidden>
        {initials}
      </span>
      <span className={styles.profileText}>
        <b dir="auto">{user.firstName ? t("hello", { name: user.firstName }) : t("title")}</b>
        <span className={`${styles.muted} ${styles.ellipsis}`} dir="ltr">
          {user.email || user.phone}
        </span>
      </span>
    </div>
  );
}
