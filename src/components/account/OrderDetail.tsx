"use client";

import { useCallback, useEffect, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck, IconCreditCard, IconRefresh, IconStarFilled, IconX } from "@tabler/icons-react";
import { fetchOrder, fileUrl, rateOrder, type Order } from "@/api/AccountAPI";
import { cancelBooking } from "@/api/BookingAPI";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { formatMoney } from "@/components/booking/wash/draft";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import {
  STAGES,
  awaitsPayment,
  formatDateTime,
  formatTime,
  fullName,
  isActive,
  isCancellable,
  isDone,
  orderNumber,
  orderTitle,
  stageIndex,
  stageTimes,
  stagger,
  statusTone,
} from "./order";
import StatusBadge from "./StatusBadge";
import styles from "./Account.module.css";

const POLL_MS = 15_000;

type State = { status: "loading" } | { status: "failed"; message: string } | { status: "ready"; order: Order; at: number };

export default function OrderDetail({ pubkey }: { pubkey: string }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const result = await fetchOrder(pubkey);
    setRefreshing(false);
    if (result.ok) return setState({ status: "ready", order: result.data, at: Date.now() });
    if (result.error === "user_not_authenticated") return router.replace(`/${locale}/sign-in`);
    setState((prev) => (prev.status === "ready" ? prev : { status: "failed", message: translateError(result.error, locale) }));
  }, [pubkey, locale, router]);

  useEffect(() => {
    let active = true;
    fetchOrder(pubkey).then((result) => {
      if (!active) return;
      if (result.ok) return setState({ status: "ready", order: result.data, at: Date.now() });
      if (result.error === "user_not_authenticated") return router.replace(`/${locale}/sign-in`);
      setState({ status: "failed", message: translateError(result.error, locale) });
    });
    return () => {
      active = false;
    };
  }, [pubkey, locale, router]);

  const live = state.status === "ready" && isActive(state.order.status);
  useEffect(() => {
    if (!live) return;
    const timer = setInterval(load, POLL_MS);
    return () => clearInterval(timer);
  }, [live, load]);

  const ready = state.status === "ready";
  useEffect(() => {
    if (ready && window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [ready]);

  const back = (
    <Link href={`/${locale}/account`} className={styles.back}>
      <IconArrowLeft size={18} stroke={1.75} aria-hidden />
      {t("backToAccount")}
    </Link>
  );

  if (state.status === "loading") return <OrderSkeleton back={back} />;
  if (state.status === "failed") {
    return (
      <div className={styles.page}>
        {back}
        <ErrorRow
          message={state.message}
          onRetry={() => {
            setState({ status: "loading" });
            load();
          }}
        />
      </div>
    );
  }

  const { order } = state;
  const number = orderNumber(order.pubkey);

  return (
    <div className={styles.page}>
      {back}

      <div className={`${styles.detailHead} ${styles.reveal}`}>
        <div className={styles.detailTitle}>
          <h1 className={styles.name}>{orderTitle(order, locale) || t("orderNumber", { number })}</h1>
          <span className={styles.muted}>
            <span dir="ltr">#{number}</span> · {t("placedOn", { date: formatDateTime(order.createdAt, locale) })}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {awaitsPayment(order) && (
        <div className={`${styles.payCard} ${styles.reveal}`}>
          <span className={styles.payIcon} aria-hidden>
            <IconCreditCard size={24} stroke={1.75} />
          </span>
          <span className={styles.payText}>
            <span className={styles.eyebrow}>{t("paymentNeeded")}</span>
            <b className={styles.payTitle}>{t("now_NEW")}</b>
          </span>
          <Link href={`/${locale}/book/wash?booking=${order.pubkey}`} className={styles.darkBtn}>
            {t("payAmount", { amount: formatMoney(order.amountDue, locale) })}
          </Link>
        </div>
      )}

      <div className={styles.detailGrid}>
        <div className={styles.column}>
          <Tracker
            order={order}
            at={state.at}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
          {order.professional && <Professional order={order} />}
          {order.photos.length > 0 && <Photos order={order} />}
          {isDone(order.status) && order.professional && <Rating order={order} onRated={load} />}
        </div>
        <div className={styles.column}>
          <Summary order={order} />
          <Visit order={order} />
          {isCancellable(order.status) && <CancelOrder pubkey={order.pubkey} onCancelled={load} />}
        </div>
      </div>
    </div>
  );
}

function Tracker({ order, at, refreshing, onRefresh }: { order: Order; at: number; refreshing: boolean; onRefresh: () => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const times = stageTimes(order);
  const current = stageIndex(order.status);
  const done = isDone(order.status);
  const name = (order.professional && fullName(order.professional.user)) || t("yourProfessional");

  return (
    <div id="tracking" className={`${styles.card} ${styles.anchor} ${styles.reveal}`} style={stagger(1)}>
      <div className={styles.trackHead}>
        <h2 className={styles.cardTitle}>{t("tracking")}</h2>
        {isActive(order.status) && (
          <button type="button" className={styles.button} onClick={onRefresh} disabled={refreshing}>
            <IconRefresh size={16} stroke={1.75} aria-hidden />
            {t("refresh")}
          </button>
        )}
      </div>

      <div className={`${styles.statusBox} ${styles[`statusBox_${statusTone(order.status)}`]}`} role="status" aria-live="polite">
        {isActive(order.status) ? (
          <span className={styles.statusDot} aria-hidden />
        ) : done ? (
          <IconCheck size={18} stroke={2.5} aria-hidden />
        ) : (
          <IconX size={18} stroke={2.5} aria-hidden />
        )}
        <span>
          <b>{t(`now_${order.status}`, { name })}</b>
          {isActive(order.status) && <span className={styles.muted}>{t("updatedAt", { time: formatTime(at, locale) })}</span>}
        </span>
      </div>

      <ol className={styles.tracker}>
        {STAGES.map((stage, index) => {
          const passed = current === -1 ? Boolean(times[stage]) : index < current || (index === current && done);
          const isCurrent = index === current && !done;
          const time = times[stage];
          return (
            <li
              key={stage}
              className={`${styles.step} ${passed ? styles.stepPassed : ""} ${isCurrent ? styles.stepCurrent : ""}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span className={styles.dot} aria-hidden>
                {passed && <IconCheck size={14} stroke={3} />}
              </span>
              <span>{t(`stage_${stage}`)}</span>
              {time && (passed || isCurrent) && <span className={styles.stepTime}>{formatDateTime(time, locale)}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Professional({ order }: { order: Order }) {
  const t = useScopedI18n("account");
  const user = order.professional!.user;
  const initials = [user.firstName, user.lastName].map((part) => part?.trim()[0] ?? "").join("") || "?";

  return (
    <div className={`${styles.card} ${styles.reveal}`} style={stagger(2)}>
      <div className={styles.person}>
        <span className={styles.avatar} aria-hidden>
          {initials}
        </span>
        <span className={styles.detailTitle}>
          <span className={styles.muted}>{t("yourProfessional")}</span>
          <b dir="auto">{fullName(user)}</b>
        </span>
      </div>
    </div>
  );
}

function Photos({ order }: { order: Order }) {
  const t = useScopedI18n("account");
  const photos = [...order.photos].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === "BEFORE" ? -1 : 1));

  return (
    <div className={`${styles.card} ${styles.reveal}`} style={stagger(3)}>
      <h2 className={styles.cardTitle}>{t("photos")}</h2>
      <div className={styles.photos}>
        {photos.map((photo) => (
          <figure key={photo.pubkey} className={styles.photo}>
            <a href={fileUrl(photo.file.filename)} target="_blank" rel="noopener noreferrer">
              <Image src={fileUrl(photo.file.thumbnailname || photo.file.filename)} alt={t(`photo_${photo.kind}`)} width={400} height={300} />
            </a>
            <figcaption>{t(`photo_${photo.kind}`)}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function Line({ label, value, total, saving }: { label: string; value: string; total?: boolean; saving?: boolean }) {
  return (
    <div className={`${styles.line} ${total ? styles.lineTotal : ""} ${saving ? styles.saving : ""}`}>
      <span>{label}</span>
      <span dir="auto">{value}</span>
    </div>
  );
}

function Summary({ order }: { order: Order }) {
  const t = useScopedI18n("account");
  const tw = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const money = (value: string | number) => formatMoney(value, locale);
  const discount = Number(order.price) - Number(order.priceAfterDiscount);
  const online = Number(order.onlineDiscount);

  return (
    <div className={`${styles.card} ${styles.reveal}`} style={stagger(2)}>
      <h2 className={styles.cardTitle}>{t("summary")}</h2>
      <div className={styles.lines}>
        {order.items.map((item) => (
          <Line
            key={item.pubkey}
            label={`${orderTitle({ ...order, items: [item] }, locale)}${item.quantity > 1 ? ` × ${item.quantity}` : ""}`}
            value={money(Number(item.unitPrice) * item.quantity)}
          />
        ))}
        {order.items.length > 1 && <Line label={t("subtotal")} value={money(order.price)} />}
        {discount > 0 && <Line saving label={t("discount", { code: order.discount?.code ?? "" })} value={`−${money(discount)}`} />}
        {online > 0 && <Line saving label={t("onlineDiscount")} value={`−${money(online)}`} />}
        <Line label={t("vat")} value={money(order.taxAmount)} />
        <Line total label={t("total")} value={money(order.amountDue)} />
        {order.amountPaid && order.paidAt && <Line label={t("paid")} value={money(order.amountPaid)} />}
        <Line label={t("payment")} value={tw(`pm_${order.paymentMethod}` as "pm_CARD")} />
      </div>
    </div>
  );
}

function Visit({ order }: { order: Order }) {
  const t = useScopedI18n("account");
  const tw = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const { vehicle } = order;
  const car = vehicle ? [`${vehicle.make} ${vehicle.model}`, vehicle.plateNumber].filter(Boolean).join(" · ") : null;

  return (
    <div className={`${styles.card} ${styles.reveal}`} style={stagger(3)}>
      <h2 className={styles.cardTitle}>{t("visit")}</h2>
      <div className={styles.lines}>
        <Line label={t("when")} value={order.scheduledAt ? formatDateTime(order.scheduledAt, locale) : t("asap")} />
        {car && <Line label={t("car")} value={car} />}
        {order.address && <Line label={t("address")} value={order.address.address} />}
        <Line label={tw("scent")} value={tw(`scent_${order.scent}`)} />
        <Line label={t("access")} value={tw(`access_${order.vehicleAccess}`)} />
        {order.doNotDisturb && <Line label={tw("doNotDisturb")} value={t("yes")} />}
        {order.notes && <Line label={tw("notes")} value={order.notes} />}
      </div>
    </div>
  );
}

function Rating({ order, onRated }: { order: Order; onRated: () => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [value, setValue] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const rated = order.rating;
  const shown = rated?.value ?? value;

  const submit = () =>
    startTransition(async () => {
      const result = await rateOrder(order.pubkey, value, note);
      if (result.ok) onRated();
      else setError(translateError(result.error, locale));
    });

  return (
    <div className={`${styles.card} ${styles.reveal}`} style={stagger(4)}>
      <h2 className={styles.cardTitle}>{rated ? t("yourRating") : t("rateTitle")}</h2>
      <div
        className={styles.stars}
        role={rated ? "img" : "radiogroup"}
        aria-label={rated ? t("rateStar", { count: rated.value }) : t("rateTitle")}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${star <= shown ? styles.starOn : ""}`}
            role={rated ? undefined : "radio"}
            aria-checked={rated ? undefined : value === star}
            aria-label={t("rateStar", { count: star })}
            aria-hidden={rated ? true : undefined}
            disabled={Boolean(rated) || pending}
            onClick={() => setValue(star)}
          >
            <IconStarFilled size={30} />
          </button>
        ))}
      </div>
      {rated ? (
        rated.note && (
          <p className={styles.muted} dir="auto">
            {rated.note}
          </p>
        )
      ) : (
        <>
          <textarea
            className={styles.textarea}
            placeholder={t("rateNote")}
            aria-label={t("rateNote")}
            maxLength={1000}
            dir="auto"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          {error && (
            <p className="errorMessage" role="alert">
              {error}
            </p>
          )}
          <button type="button" className={`${styles.button} ${styles.primary}`} disabled={!value || pending} onClick={submit}>
            {t("rateSubmit")}
          </button>
        </>
      )}
    </div>
  );
}

function CancelOrder({ pubkey, onCancelled }: { pubkey: string; onCancelled: () => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const cancel = () =>
    startTransition(async () => {
      const result = await cancelBooking(pubkey);
      if (result.ok) {
        setOpen(false);
        onCancelled();
      } else setError(translateError(result.error, locale));
    });

  return (
    <>
      <button type="button" className={`${styles.button} ${styles.danger}`} onClick={() => setOpen(true)}>
        {t("cancelOrder")}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t("cancelTitle")} description={t("cancelConfirm")}>
        {error && (
          <p className="errorMessage" role="alert">
            {error}
          </p>
        )}
        <div className={styles.dialogActions}>
          <button type="button" className={styles.button} onClick={() => setOpen(false)} disabled={pending}>
            {t("keep")}
          </button>
          <button type="button" className={`${styles.button} ${styles.dangerSolid}`} onClick={cancel} disabled={pending}>
            {t("cancelYes")}
          </button>
        </div>
      </Dialog>
    </>
  );
}

function OrderSkeleton({ back }: { back: ReactNode }) {
  return (
    <div className={styles.page} aria-busy="true">
      {back}
      <Skeleton width="55%" height="40px" />
      <div className={styles.detailGrid}>
        <Skeleton height="420px" radius="lg" />
        <div className={styles.column}>
          <Skeleton height="220px" radius="lg" />
          <Skeleton height="200px" radius="lg" />
        </div>
      </div>
    </div>
  );
}
