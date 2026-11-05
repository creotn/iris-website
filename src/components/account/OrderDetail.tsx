"use client";

import { useCallback, useEffect, useState, useTransition, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconCar,
  IconCheck,
  IconCreditCard,
  IconMapPin,
  IconRefresh,
  IconSearch,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";
import { fetchOrder, fileUrl, rateOrder, type Order } from "@/api/AccountAPI";
import { cancelBooking } from "@/api/BookingAPI";
import { formatMoney } from "@/components/booking/wash/draft";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { OrderDetailSkeleton } from "./AccountSkeletons";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import LocationMap from "./LocationMap";
import {
  STAGES,
  awaitsPayment,
  formatDateTime,
  formatTime,
  fullName,
  isActive,
  isCancellable,
  isDone,
  isStopped,
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

  if (state.status === "loading") {
    return (
      <div className={`container ${styles.trackFallback}`}>
        <OrderDetailSkeleton back={back} />
      </div>
    );
  }
  if (state.status === "failed") {
    return (
      <div className={`container ${styles.page} ${styles.trackFallback}`}>
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
  const refresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <div className={styles.trackPage}>
      {/* The visit on a map, with where things stand floating over it */}
      <TrackMap order={order} at={state.at} refreshing={refreshing} onRefresh={refresh} back={back} />

      <aside className={styles.trackPanel}>
        <div className={styles.trackBody}>
          <div className={`${styles.trackHead} ${styles.reveal}`}>
            <span className={styles.detailTitle}>
              <h1>{orderTitle(order, locale) || t("orderNumber", { number })}</h1>
              <span className={styles.muted}>
                <span dir="ltr">#{number}</span> · {formatDateTime(order.createdAt, locale)}
              </span>
            </span>
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

          <Tracker order={order} />
          {order.professional && <Professional order={order} />}
          <VisitTiles order={order} />
          {order.photos.length > 0 && <Photos order={order} />}
          {isDone(order.status) && order.professional && <Rating order={order} onRated={load} />}
        </div>

        <TrackFooter order={order} onCancelled={load} />
      </aside>
    </div>
  );
}

function TrackMap({
  order,
  at,
  refreshing,
  onRefresh,
  back,
}: {
  order: Order;
  at: number;
  refreshing: boolean;
  onRefresh: () => void;
  back: ReactNode;
}) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const { address } = order;
  const point =
    address && address.latitude != null && address.longitude != null
      ? { latitude: address.latitude, longitude: address.longitude }
      : null;
  const active = isActive(order.status);
  const searching = order.status === "PENDING";
  const tone = statusTone(order.status);
  const name = (order.professional && fullName(order.professional.user)) || t("yourProfessional");
  const icon = searching ? (
    <IconSearch size={22} stroke={2} />
  ) : isDone(order.status) ? (
    <IconCheck size={22} stroke={2.5} />
  ) : isStopped(order.status) ? (
    <IconX size={22} stroke={2.5} />
  ) : order.status === "NEW" ? (
    <IconCreditCard size={22} stroke={1.75} />
  ) : (
    <IconCar size={22} stroke={1.75} />
  );

  return (
    <div className={styles.trackMap}>
      {point ? (
        <LocationMap value={point} label={t("mapLabel")} />
      ) : (
        <div className={styles.trackMapEmpty} aria-hidden>
          <IconMapPin size={44} stroke={1.5} />
        </div>
      )}
      {searching && point && <span className={styles.trackPulse} aria-hidden />}

      <div className={styles.trackBack}>{back}</div>

      <div className={`${styles.trackStatus} ${styles.reveal}`} role="status" aria-live="polite">
        <span className={`${styles.trackStatusIcon} ${styles[`trackTone_${tone}`]}`} aria-hidden>
          {icon}
        </span>
        <span className={styles.trackStatusText}>
          <b>{t(`now_${order.status}`, { name })}</b>
          <span>
            {[address?.address, active && t("updatedAt", { time: formatTime(at, locale) })].filter(Boolean).join(" · ")}
          </span>
        </span>
        {active && (
          <button type="button" className={styles.trackRefresh} onClick={onRefresh} disabled={refreshing} aria-label={t("refresh")}>
            <IconRefresh size={18} stroke={1.9} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

function TrackFooter({ order, onCancelled }: { order: Order; onCancelled: () => void }) {
  const t = useScopedI18n("account");
  const tw = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [receipt, setReceipt] = useState(false);

  return (
    <div className={styles.trackFoot}>
      <div className={styles.trackTotal}>
        <span>
          <small>{t("totalWith", { method: tw(`pm_${order.paymentMethod}` as "pm_CARD") })}</small>
          <b>{formatMoney(order.amountDue, locale)}</b>
        </span>
        <button type="button" className={styles.profileAction} onClick={() => setReceipt(true)}>
          {t("viewReceipt")}
        </button>
      </div>
      {isCancellable(order.status) && <CancelOrder pubkey={order.pubkey} onCancelled={onCancelled} />}

      <Dialog open={receipt} onClose={() => setReceipt(false)} title={t("summary")}>
        <Summary order={order} />
        <div className={styles.dialogActions}>
          <button type="button" className={styles.button} onClick={() => setReceipt(false)}>
            {t("close")}
          </button>
        </div>
      </Dialog>
    </div>
  );
}

function Tracker({ order }: { order: Order }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const times = stageTimes(order);
  const current = stageIndex(order.status);
  const done = isDone(order.status);

  return (
    <ol id="tracking" className={`${styles.tracker} ${styles.trackSteps} ${styles.anchor} ${styles.reveal}`} style={stagger(1)} aria-label={t("tracking")}>
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
            {time && (passed || isCurrent) && <span className={styles.stepTime}>{formatTime(time, locale)}</span>}
          </li>
        );
      })}
    </ol>
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
  );
}

function VisitTiles({ order }: { order: Order }) {
  const t = useScopedI18n("account");
  const tw = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const { vehicle } = order;
  const tiles: { label: string; value: string; wide?: boolean; ltr?: boolean }[] = [];
  if (vehicle) tiles.push({ label: t("car"), value: `${vehicle.make} ${vehicle.model}`.trim() });
  if (vehicle?.plateNumber) tiles.push({ label: t("plate"), value: vehicle.plateNumber, ltr: true });
  tiles.push({ label: t("when"), value: order.scheduledAt ? formatDateTime(order.scheduledAt, locale) : t("asap") });
  tiles.push({ label: t("access"), value: tw(`access_${order.vehicleAccess}`) });
  tiles.push({ label: tw("scent"), value: tw(`scent_${order.scent}`) });
  if (order.doNotDisturb) tiles.push({ label: tw("doNotDisturb"), value: t("yes") });
  if (order.notes) tiles.push({ label: tw("notes"), value: order.notes, wide: true });

  return (
    <dl className={`${styles.trackTiles} ${styles.reveal}`} style={stagger(2)}>
      {tiles.map((tile) => (
        <div key={tile.label} className={`${styles.trackTile} ${tile.wide ? styles.trackTileWide : ""}`}>
          <dt>{tile.label}</dt>
          <dd dir={tile.ltr ? "ltr" : "auto"}>{tile.value}</dd>
        </div>
      ))}
    </dl>
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
      <button type="button" className={`${styles.button} ${styles.danger} ${styles.trackCancel}`} onClick={() => setOpen(true)}>
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
