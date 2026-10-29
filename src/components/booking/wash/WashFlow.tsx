"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
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
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import AddressStep, { type Place, type SavedPlace } from "./AddressStep";
import CarStep from "./CarStep";
import CustomizeStep from "./CustomizeStep";
import DoneStep from "./DoneStep";
import { buildItems, emptyDraft, pick, type Draft } from "./draft";
import PayStep from "./PayStep";
import ReviewStep from "./ReviewStep";
import ServiceStep from "./ServiceStep";
import Stepper from "./Stepper";
import { Banner, Cta } from "./ui";
import WhenStep from "./WhenStep";
import shellStyles from "./../StepShell.module.css";
import styles from "./Wash.module.css";

type Phase = "car" | "address" | "service" | "customize" | "when" | "review" | "pay" | "done";
const PHASES: Phase[] = ["car", "address", "service", "customize", "when", "review", "pay", "done"];
const BACK: Partial<Record<Phase, Phase>> = { address: "car", service: "address", customize: "service", when: "customize", review: "when" };

type Data = {
  categories: CatalogCategory[];
  services: CatalogService[];
  vehicles: Vehicle[];
  saved: SavedPlace | null;
};

const bookingUrl = (pubkey: string) => `${window.location.pathname}?booking=${encodeURIComponent(pubkey)}`;

type Load = { status: "loading" } | { status: "failed"; message: string } | { status: "ready"; data: Data };

export default function WashFlow() {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const router = useRouter();

  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [phase, setPhase] = useState<Phase>("car");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
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

      const saved: SavedPlace | null = address.data.address ? { address: address.data.address, area: address.data.area } : null;
      const coveredPlace: Place | null = saved?.area ? { address: saved.address, area: saved.area } : null;
      const lastVehicle = vehicles.data[vehicles.data.length - 1] ?? null;

      setVehicles(vehicles.data);
      setVehicle(lastVehicle);
      setPlace(coveredPlace);
      setLoad({
        status: "ready",
        data: { categories: catalog.data.categories, services: catalog.data.services, vehicles: vehicles.data, saved },
      });

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
        setError(translateError(verified.error, locale));
      }

      const summary = await fetchPaymentSummary(pubkey);
      if (!active) return;
      if (!summary.ok) {
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
    if (load.status !== "ready" || !vehicle || !place) return;
    setBusy(true);
    setError("");

    let pubkey = bookingPubkey;
    if (!pubkey) {
      const base = {
        items: buildItems(draft),
        addressPubkey: place.address.pubkey,
        vehiclePubkey: vehicle.pubkey,
        discountCode: draft.promo,
        notes: draft.notes,
        visit: draft.visit,
      };
      const created =
        draft.when === "now"
          ? await createInstantBooking(base)
          : await createScheduledBooking({ ...base, areaPubkey: place.area.pubkey, date: draft.date, timeSlot: draft.slot! });
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
    setPhase("car");
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
    <div className={`${shellStyles.shell} ${shellStyles.wide}`}>
      <div className={shellStyles.bar}>
        {back && (
          <button type="button" className={shellStyles.back} onClick={() => setPhase(back)}>
            <IconArrowLeft className={shellStyles.backIcon} size={18} stroke={1.75} aria-hidden />
            {t("back")}
          </button>
        )}
      </div>
      {phase !== "done" && (
      <Stepper
        current={index}
        steps={[t("stepCar"), t("stepLocation"), t("stepService"), t("stepQuantity"), t("stepWhen"), t("stepReview"), t("stepPayment"), t("stepDone")]}
      />
      )}

      {phase === "car" && (
        <CarStep vehicles={vehicles} selected={vehicle} onSelect={setVehicle} onVehiclesChange={setVehicles} onNext={() => setPhase("address")} />
      )}
      {phase === "address" && <AddressStep saved={place ?? data.saved} onChoose={setPlace} onNext={() => setPhase("service")} />}
      {phase === "service" && vehicle && place && (
        <ServiceStep
          categories={data.categories}
          services={data.services}
          vehicle={vehicle}
          address={{ address: place.address, area: place.area }}
          onPick={(service) => {
            setDraftState({ ...emptyDraft, service });
            setPhase("customize");
          }}
        />
      )}
      {vehicle && place && phase !== "car" && phase !== "address" && phase !== "service" && phase !== "done" && (
        <div className={styles.flowSplit}>
          <aside className={`${styles.doneArt} ${styles.flowArt}`}>
            <Image src="/images/features/eco-friendly.jpg" alt="" fill sizes="(min-width: 900px) 34vw, 100vw" className={styles.doneArtImage} />
            <div className={styles.doneArtShade} />
            <div className={styles.doneArtCopy}>
              <span className={styles.flowEyebrow}>{t("yourWash")}</span>
              <h2 className={styles.doneTitle}>{draft.service ? pick(draft.service.title, locale) : ""}</h2>
              <p className={styles.doneSub}>
                {vehicle.make} {vehicle.model} · {place.area.city}
              </p>
            </div>
          </aside>
          <div className={styles.flowBody}>
        {phase === "customize" && <CustomizeStep draft={draft} setDraft={setDraft} onNext={() => setPhase("when")} />}
        {phase === "when" && <WhenStep draft={draft} setDraft={setDraft} areaPubkey={place.area.pubkey} onNext={() => setPhase("review")} />}
        {phase === "review" && (
          <ReviewStep
            draft={draft}
            setDraft={setDraft}
            vehicle={vehicle}
            address={{ address: place.address, area: place.area }}
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
          </div>
        </div>
      )}
      {phase === "done" && booking && <DoneStep booking={booking} onAnother={reset} />}
    </div>
  );
}
