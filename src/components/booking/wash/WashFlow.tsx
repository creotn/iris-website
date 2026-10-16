"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  cancelBooking,
  createInstantBooking,
  createScheduledBooking,
  fetchAddress,
  fetchBooking,
  fetchCatalog,
  fetchPaymentSummary,
  fetchVehicles,
  verifyCardPayment,
  type Booking,
  type CatalogCategory,
  type CatalogService,
  type PaymentSummary,
  type SavedAddress,
  type Vehicle,
} from "@/api/BookingAPI";
import { stepPath } from "@/config/booking";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import CustomizeStep from "./CustomizeStep";
import DoneStep from "./DoneStep";
import { buildItems, emptyDraft, type Draft } from "./draft";
import PayStep from "./PayStep";
import ReviewStep from "./ReviewStep";
import ServiceStep from "./ServiceStep";
import { Banner, Cta } from "./ui";
import WhenStep from "./WhenStep";
import shellStyles from "./../StepShell.module.css";
import styles from "./Wash.module.css";

type Phase = "service" | "customize" | "when" | "review" | "pay" | "done";
const PHASES: Phase[] = ["service", "customize", "when", "review", "pay", "done"];
const BACK: Partial<Record<Phase, Phase>> = { customize: "service", when: "customize", review: "when" };

type Data = {
  categories: CatalogCategory[];
  services: CatalogService[];
  vehicle: Vehicle;
  address: SavedAddress & { area: NonNullable<SavedAddress["area"]> };
};

/** Keeps the booking in the URL so a refresh reopens it instead of starting a new one. */
const bookingUrl = (pubkey: string) => `${window.location.pathname}?booking=${encodeURIComponent(pubkey)}`;

type Load = { status: "loading" } | { status: "failed"; message: string } | { status: "ready"; data: Data };

export default function WashFlow() {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const router = useRouter();

  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [phase, setPhase] = useState<Phase>("service");
  const [draft, setDraftState] = useState<Draft>(emptyDraft);
  const [bookingPubkey, setBookingPubkey] = useState<string | null>(null);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(false);

  const setDraft = useCallback((update: (draft: Draft) => Draft) => setDraftState(update), []);

  const finish = useCallback(
    async (pubkey: string) => {
      const result = await fetchBooking(pubkey);
      if (!result.ok) {
        setError(translateError(result.error, locale));
        return;
      }
      setBooking(result.data);
      setPhase("done");
    },
    [locale],
  );

  useEffect(() => {
    let active = true;

    (async () => {
      const [catalog, vehicles, address] = await Promise.all([fetchCatalog(), fetchVehicles(), fetchAddress()]);
      if (!active) return;

      const failure = [catalog, vehicles, address].find((result) => !result.ok);
      if (failure && !failure.ok) {
        if (failure.error === "user_not_authenticated") return router.replace(`/${locale}/sign-in`);
        return setLoad({ status: "failed", message: translateError(failure.error, locale) });
      }
      if (!catalog.ok || !vehicles.ok || !address.ok) return;

      // The wash needs a car and a covered address; the onboarding steps collect them.
      if (vehicles.data.length === 0) return router.replace(stepPath(locale, "car"));
      if (!address.data.address || !address.data.area) return router.replace(stepPath(locale, "address"));

      setLoad({
        status: "ready",
        data: {
          categories: catalog.data.categories,
          services: catalog.data.services,
          vehicle: vehicles.data[vehicles.data.length - 1],
          address: { ...address.data, area: address.data.area },
        },
      });

      // A booking in the URL is reopened: after a refresh, or coming back from a 3-D Secure challenge
      // (Moyasar appends the payment id to our callback URL).
      const params = new URLSearchParams(window.location.search);
      const pubkey = params.get("booking");
      if (!pubkey) return;
      const paymentId = params.get("id");
      const transaction = params.get("tx");
      window.history.replaceState(null, "", bookingUrl(pubkey));
      setBookingPubkey(pubkey);

      if (paymentId && transaction) {
        setReturning(true);
        const verified = await verifyCardPayment(pubkey, transaction, paymentId);
        if (!active) return;
        setReturning(false);
        if (verified.ok) return finish(pubkey);
        // Declined or abandoned: the booking is still waiting, so offer the payment methods again.
        setError(translateError(verified.error, locale));
      }

      const summary = await fetchPaymentSummary(pubkey);
      if (!active) return;
      if (!summary.ok) {
        // Not this account's booking, or gone: start a fresh one rather than reuse the pubkey on confirm.
        window.history.replaceState(null, "", window.location.pathname);
        return setBookingPubkey(null);
      }
      if (!summary.data.requiresPayment) return finish(pubkey);
      setSummary(summary.data);
      setPhase("pay");
    })();

    return () => {
      active = false;
    };
  }, [locale, router, finish]);

  const confirm = async () => {
    if (load.status !== "ready") return;
    const { vehicle, address } = load.data;
    setBusy(true);
    setError("");

    let pubkey = bookingPubkey;
    if (!pubkey) {
      const base = {
        items: buildItems(draft),
        addressPubkey: address.address!.pubkey,
        vehiclePubkey: vehicle.pubkey,
        discountCode: draft.promo,
        notes: draft.notes,
        visit: draft.visit,
      };
      const created =
        draft.when === "now"
          ? await createInstantBooking(base)
          : await createScheduledBooking({ ...base, areaPubkey: address.area.pubkey, date: draft.date, timeSlot: draft.slot! });
      if (!created.ok) {
        setBusy(false);
        return setError(translateError(created.error, locale));
      }
      pubkey = created.data.pubkey;
      setBookingPubkey(pubkey);
      window.history.replaceState(null, "", bookingUrl(pubkey));
    }

    const result = await fetchPaymentSummary(pubkey);
    setBusy(false);
    if (!result.ok) return setError(translateError(result.error, locale));

    // Nothing to pay (a prepaid wash or a zero total) — the booking is already released.
    if (!result.data.requiresPayment) return finish(pubkey);
    setSummary(result.data);
    setPhase("pay");
  };

  const reset = () => {
    window.history.replaceState(null, "", window.location.pathname);
    setDraftState(emptyDraft);
    setBookingPubkey(null);
    setSummary(null);
    setBooking(null);
    setError("");
    setPhase("service");
  };

  const cancel = async () => {
    if (bookingPubkey) await cancelBooking(bookingPubkey);
    reset();
  };

  if (load.status === "loading" || returning) {
    return (
      <div className={styles.hero} role="status">
        <div className={styles.spinner} />
        <p className={styles.hint}>{returning ? t("confirmingPayment") : t("loading")}</p>
      </div>
    );
  }

  if (load.status === "failed") {
    return (
      <div className={styles.stack}>
        <Banner tone="warn">{load.message}</Banner>
        <Cta arrow={false} onClick={() => window.location.reload()}>
          {t("retry")}
        </Cta>
      </div>
    );
  }

  const { data } = load;
  const index = PHASES.indexOf(phase) + 1;
  const back = BACK[phase];

  return (
    <div className={shellStyles.shell}>
      <div className={shellStyles.bar}>
        {back && (
          <button type="button" className={shellStyles.back} onClick={() => setPhase(back)}>
            <IconArrowLeft className={shellStyles.backIcon} size={18} stroke={1.75} aria-hidden />
            {t("back")}
          </button>
        )}
        <span className={shellStyles.count}>{t("step", { current: index, total: PHASES.length })}</span>
      </div>
      <div className={shellStyles.track} role="progressbar" aria-valuemin={1} aria-valuemax={PHASES.length} aria-valuenow={index}>
        <span className={shellStyles.fill} style={{ inlineSize: `${(index / PHASES.length) * 100}%` }} />
      </div>

      {phase === "service" && (
        <ServiceStep
          categories={data.categories}
          services={data.services}
          vehicle={data.vehicle}
          address={data.address}
          onPick={(service) => {
            setDraftState({ ...emptyDraft, service });
            setPhase("customize");
          }}
        />
      )}
      {phase === "customize" && <CustomizeStep draft={draft} setDraft={setDraft} onNext={() => setPhase("when")} />}
      {phase === "when" && <WhenStep draft={draft} setDraft={setDraft} areaPubkey={data.address.area.pubkey} onNext={() => setPhase("review")} />}
      {phase === "review" && (
        <ReviewStep
          draft={draft}
          setDraft={setDraft}
          vehicle={data.vehicle}
          address={data.address}
          busy={busy}
          error={error}
          onConfirm={confirm}
        />
      )}
      {phase === "pay" && bookingPubkey && summary && (
        <>
          {error && (
            <p className="errorMessage" role="alert">
              {error}
            </p>
          )}
          <PayStep bookingPubkey={bookingPubkey} summary={summary} onPaid={() => finish(bookingPubkey)} onCancel={cancel} />
        </>
      )}
      {phase === "done" && booking && <DoneStep booking={booking} onAnother={reset} />}
    </div>
  );
}
