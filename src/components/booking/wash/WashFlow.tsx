"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
  type Vehicle,
} from "@/api/BookingAPI";
import { SkeletonScreen } from "@/components/skeleton/Skeleton";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import AddressStep, { type Place, type SavedPlace } from "./AddressStep";
import CarStep from "./CarStep";
import CheckoutStep, { type Created } from "./CheckoutStep";
import DoneStep from "./DoneStep";
import BookingSidebar from "./BookingSidebar";
import { buildItems, clearFlow, emptyDraft, readFlow, restoreDraft, saveFlow, STEP_SLUG, urlPhase, type Draft, type Phase, type StoredPhase } from "./draft";
import ServiceDialog from "./ServiceDialog";
import StepSkeleton from "./StepSkeleton";
import ServiceStep from "./ServiceStep";
import Stepper from "./Stepper";
import { Banner, Cta } from "./ui";
import shellStyles from "./../StepShell.module.css";
import styles from "./Wash.module.css";

// The service popup holds the options, time and visit details; checkout is the summary and payment on one page.
const STEP_OF: Record<Phase, number> = { car: 1, address: 2, service: 3, checkout: 4, done: 5 };
const BACK: Partial<Record<Phase, Phase>> = { address: "car", service: "address", checkout: "service" };
const PHASE_AT: Phase[] = ["car", "address", "service", "checkout", "done"];

type Data = {
  categories: CatalogCategory[];
  services: CatalogService[];
  saved: SavedPlace | null;
};


/** Writes ?step= (and ?booking= once the booking exists) to the address bar. */
function writeUrl(mode: "push" | "replace", phase: Phase, booking: string | null) {
  const params = new URLSearchParams({ step: STEP_SLUG[phase] });
  if (booking) params.set("booking", booking);
  const url = `${window.location.pathname}?${params}`;
  if (url === window.location.pathname + window.location.search) return;
  if (mode === "push") window.history.pushState(null, "", url);
  else window.history.replaceState(null, "", url);
}

type Load = { status: "loading" } | { status: "failed"; message: string } | { status: "ready"; data: Data };

export default function WashFlow() {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const router = useRouter();

  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [phase, setPhase] = useState<Phase>("car");
  const [configuring, setConfiguring] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [place, setPlace] = useState<Place | null>(null);
  const [draft, setDraftState] = useState<Draft>(emptyDraft);
  const [bookingPubkey, setBookingPubkey] = useState<string | null>(null);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
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
      clearFlow();
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
      const params = new URLSearchParams(window.location.search);
      const pubkey = params.get("booking");

      // A refresh returns to the step the user was on, but never past the first step whose data is gone.
      // A ?booking= return from the card provider takes priority over the stored draft.
      const stored = pubkey ? null : readFlow();
      const storedVehicle = vehicles.data.find((item) => item.pubkey === stored?.vehiclePubkey) ?? null;
      const storedService = catalog.data.services.find((item) => item.pubkey === stored?.servicePubkey) ?? null;
      // The customer has one saved address, so the stored place is only trusted if it is still that one.
      const storedPlace = coveredPlace && stored?.place?.address.pubkey === coveredPlace.address.pubkey ? coveredPlace : null;
      const reached: StoredPhase = !storedVehicle ? "car" : !storedPlace ? "address" : "service";
      const order: StoredPhase[] = ["car", "address", "service"];
      const resume = stored ? order[Math.min(order.indexOf(stored.phase), order.indexOf(reached))] : "car";

      setVehicles(vehicles.data);
      setVehicle(storedVehicle ?? vehicles.data[vehicles.data.length - 1] ?? null);
      setPlace(storedPlace ?? coveredPlace);
      if (stored && storedService) setDraftState(restoreDraft(storedService, stored));
      setPhase(resume);
      setLoad({ status: "ready", data: { categories: catalog.data.categories, services: catalog.data.services, saved } });

      // Back from the card provider's 3-D Secure page: verify the payment, or reopen the checkout.
      if (!pubkey) return;
      const paymentId = params.get("id");
      const transaction = params.get("tx");
      writeUrl("replace", "checkout", pubkey);
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
        writeUrl("replace", "car", null);
        return setBookingPubkey(null);
      }
      if (!summary.data.requiresPayment) return finish(pubkey);
      setSummary(summary.data);
      setPhase("checkout");
    })();

    return () => {
      active = false;
    };
  }, [locale, router, finish]);

  /** Creates the booking when the user pays, and returns it with its payment summary, or an error message. */
  const createBooking = async (): Promise<Created | string> => {
    if (bookingPubkey && summary) return { pubkey: bookingPubkey, summary };
    if (!vehicle || !place) return "";

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
      if (!created.ok) return translateError(created.error, locale);
      pubkey = created.data.pubkey;
      // From here the booking itself is the state, recovered through ?booking= on a refresh.
      clearFlow();
      setBookingPubkey(pubkey);
      writeUrl("replace", "checkout", pubkey);
    }

    const result = await fetchPaymentSummary(pubkey);
    if (!result.ok) return translateError(result.error, locale);
    setSummary(result.data);
    if (!result.data.requiresPayment) await finish(pubkey);
    return { pubkey, summary: result.data };
  };

  const reset = () => {
    writeUrl("replace", "car", null);
    clearFlow();
    setDraftState(emptyDraft);
    setBookingPubkey(null);
    setSummary(null);
    setBooking(null);
    setError("");
    setConfiguring(false);
    setPhase("car");
  };

  const cancel = async () => {
    if (bookingPubkey) await cancelBooking(bookingPubkey);
    reset();
  };

  // Keep the step and choices for a refresh, until a booking exists.
  useEffect(() => {
    if (load.status !== "ready" || bookingPubkey || phase === "done") return;
    const { service, ...fields } = draft;
    saveFlow({
      ...fields,
      // Checkout itself is never restored; a refresh there lands on the service step with the choices kept.
      phase: phase === "checkout" ? "service" : phase,
      vehiclePubkey: vehicle?.pubkey ?? null,
      place,
      servicePubkey: service?.pubkey ?? null,
    });
  }, [load.status, bookingPubkey, phase, vehicle, place, draft]);

  // Mirror the step in the address bar. The first write replaces the entry the page opened with.
  const wroteUrl = useRef(false);
  useEffect(() => {
    // Skip while a ?booking= return is still being resolved, so it doesn't flash the car step into history.
    if (load.status !== "ready" || returning || (bookingPubkey && phase !== "checkout" && phase !== "done")) return;
    if (urlPhase() !== phase) writeUrl(wroteUrl.current ? "push" : "replace", phase, bookingPubkey);
    wroteUrl.current = true;
  }, [load.status, returning, phase, bookingPubkey]);

  // Browser Back/Forward: go to that step if it can be reached, otherwise put the current step back in the URL.
  const latest = useRef({ phase, bookingPubkey, vehicle, place, service: draft.service });
  useEffect(() => {
    latest.current = { phase, bookingPubkey, vehicle, place, service: draft.service };
  });
  useEffect(() => {
    const onPopState = () => {
      const target = urlPhase();
      const { phase: now, bookingPubkey: booking, vehicle, place, service } = latest.current;
      if (!target || target === now) return;
      // A created booking can only be paid or cancelled, and no step opens without what it needs.
      const needs: Record<Phase, boolean> = {
        car: true,
        address: vehicle !== null,
        service: vehicle !== null && place !== null,
        checkout: vehicle !== null && place !== null && service !== null,
        done: false,
      };
      if (booking || !needs[target]) return writeUrl("push", now, booking);
      setConfiguring(false);
      setPhase(target);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Going back to the services reopens the popup the user came from.
  const goBack = (to: Phase) => {
    setConfiguring(to === "service" && draft.service !== null);
    setPhase(to);
  };

  if (load.status === "loading") {
    return (
      <SkeletonScreen>
        <StepSkeleton />
      </SkeletonScreen>
    );
  }

  if (returning) {
    return (
      <div className={styles.hero} role="status">
        <div className={styles.spinner} />
        <p className={styles.hint}>{t("confirmingPayment")}</p>
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
  // Once the booking exists it can only be paid or cancelled, not edited.
  const back = phase === "checkout" && bookingPubkey ? undefined : BACK[phase];

  const steps = [t("stepCar"), t("stepLocation"), t("stepService"), t("stepReview"), t("stepDone")];
  const shortSteps = [t("railCar"), t("railPlace"), t("railWash"), t("railPay"), t("railDone")];
  return (
    <div className={`${styles.flow} ${phase === "car" ? styles.flowFit : ""}`}>
      <BookingSidebar
        steps={steps}
        short={shortSteps}
        current={STEP_OF[phase]}
        complete={phase === "done"}
        // Earlier steps can be reopened whenever Back would be offered.
        onStep={back ? (step) => goBack(PHASE_AT[step - 1]) : undefined}
      />

      <div className={`${shellStyles.shell} ${styles.flowMain}`}>
      {/* Phones: Back and the step bars in one header. On desktop the rail does both. */}
      <div className={styles.flowMobile}>
        <Stepper current={STEP_OF[phase]} complete={phase === "done"} steps={steps} onBack={back ? () => goBack(back) : undefined} />
      </div>

      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}

      {phase === "car" && (
        <CarStep vehicles={vehicles} selected={vehicle} onSelect={setVehicle} onVehiclesChange={setVehicles} onNext={() => setPhase("address")} />
      )}
      {phase === "address" && <AddressStep saved={place ?? data.saved} onChoose={setPlace} onNext={() => setPhase("service")} />}
      {phase === "service" && vehicle && place && (
        <>
          <ServiceStep
            categories={data.categories}
            services={data.services}
            selected={draft.service}
            onPick={(service) => {
              // Reopening the same service keeps what was filled in; another service starts fresh.
              if (service.pubkey !== draft.service?.pubkey) setDraftState({ ...emptyDraft, service });
              setConfiguring(true);
            }}
          />
          {draft.service && (
            <ServiceDialog
              open={configuring}
              draft={draft}
              setDraft={setDraft}
              areaPubkey={place.area.pubkey}
              onClose={() => setConfiguring(false)}
              onNext={() => {
                setConfiguring(false);
                setPhase("checkout");
              }}
            />
          )}
        </>
      )}
      {phase === "checkout" && vehicle && place && draft.service && (
        <CheckoutStep
          draft={draft}
          setDraft={setDraft}
          vehicle={vehicle}
          place={place}
          bookingPubkey={bookingPubkey}
          summary={summary}
          onCreate={createBooking}
          onPaid={finish}
          onCancel={cancel}
          onEdit={() => goBack("service")}
        />
      )}
      {phase === "done" && booking && <DoneStep booking={booking} onAnother={reset} />}
      </div>
    </div>
  );
}
