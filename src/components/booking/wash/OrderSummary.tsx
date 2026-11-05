"use client";

import { useState } from "react";
import { IconPencil } from "@tabler/icons-react";
import { checkDiscount, type Quote, type Vehicle } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import type { Place } from "./AddressStep";
import { buildItems, formatMoney, itemCount, pick, slotLabel, sorted, type Draft } from "./draft";
import { Line } from "./ui";
import styles from "./Wash.module.css";

export type Totals = { subtotal: string; onlineDiscount: string | null; vat: string; total: string; estimated: boolean };

/** The checkout's order, laid out like a receipt: the service and its price, the car, place, time and visit details, then the totals. */
export default function OrderSummary({
  draft,
  vehicle,
  place,
  totals,
  discount,
  locked,
  onEdit,
}: {
  draft: Draft;
  vehicle: Vehicle;
  place: Place;
  totals: Totals | null;
  /** The promo discount previewed by the promo field, shown until the server's own total arrives. */
  discount: string | null;
  /** The booking exists: nothing can change any more. */
  locked: boolean;
  onEdit: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const service = draft.service;
  const money = (amount: string | number) => formatMoney(amount, locale);

  // The options picked in the service popup, by name ("Large", "Wax", "Area: 12"), then the duration.
  const choices = service
    ? sorted(service.options).flatMap((option) => {
        if (option.kind === "INPUT") return draft.dims[option.pubkey] ? [`${pick(option.title, locale)}: ${draft.dims[option.pubkey]}`] : [];
        const chosen = draft.picks[option.pubkey] ?? [];
        return option.variables.filter((variable) => chosen.includes(variable.pubkey)).map((variable) => pick(variable.title, locale));
      })
    : [];
  if (service?.estimatedMinutes != null) choices.push(t("minutes", { count: service.estimatedMinutes }));

  const when =
    draft.when === "now"
      ? t("asap")
      : `${new Date(`${draft.date}T12:00:00`).toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })} · ${draft.slot ? slotLabel(draft.slot) : ""}`;

  // One line for the visit: access, then the scent and "don't disturb" only when chosen.
  const visit = [
    t(`access_${draft.visit.vehicleAccess}`),
    ...(draft.visit.scent !== "NONE" ? [`${t("scent")}: ${t(`scent_${draft.visit.scent}`)}`] : []),
    ...(draft.visit.doNotDisturb ? [t("doNotDisturb")] : []),
  ].join(" · ");

  return (
    <aside className={styles.coSummary} aria-label={t("orderSummary")}>
      <div className={styles.coSummaryHead}>
        <h2>{t("orderSummary")}</h2>
        {!locked && service && (
          <button type="button" className={styles.coEdit} onClick={onEdit}>
            <IconPencil size={15} stroke={1.75} aria-hidden />
            {t("edit")}
          </button>
        )}
      </div>

      {/* Details come from what was filled in, so they are left out when coming back from the card provider. */}
      {service && (
        <>
          <div className={styles.coReceiptItem}>
            <span>
              <b>{pick(service.title, locale)}</b>
              {choices.length > 0 && <small>{choices.join(" · ")}</small>}
            </span>
            {totals && <b className={styles.coReceiptPrice}>{money(totals.subtotal)}</b>}
          </div>

          <hr className={styles.coRule} />

          <dl className={styles.coReceipt}>
            <dt>{t("car")}</dt>
            <dd dir="auto">
              {vehicle.make} {vehicle.model}
              {vehicle.plateNumber && (
                <span className={styles.coPlate} dir="ltr">
                  {" "}
                  · {vehicle.plateNumber}
                </span>
              )}
            </dd>
            <dt>{t("where")}</dt>
            <dd dir="auto">{place.address.address}</dd>
            <dt>{t("when")}</dt>
            <dd>{when}</dd>
            <dt>{t("detailsTitle")}</dt>
            <dd>{visit}</dd>
            {draft.notes && (
              <>
                <dt>{t("notes")}</dt>
                <dd dir="auto">{draft.notes}</dd>
              </>
            )}
          </dl>

          <hr className={styles.coRule} />
        </>
      )}

      {totals && (
        <div className={styles.coTotals}>
          <Line label={t("subtotal")} value={money(totals.subtotal)} />
          {totals.estimated && draft.promo && discount && <Line tone="negative" label={t("discount")} value={`−${money(discount)}`} />}
          {totals.onlineDiscount && <Line tone="negative" label={t("onlineDiscount")} value={`−${money(totals.onlineDiscount)}`} />}
          <Line label={t("vat")} value={money(totals.vat)} />
          <Line strong label={totals.estimated && draft.promo ? t("estimatedTotal") : t("toPay")} value={money(totals.total)} />
          {totals.estimated && draft.promo && <p className={styles.coNote}>{t("finalTotalNote")}</p>}
        </div>
      )}

      <p className={`${styles.coNote} ${styles.coReceiptFoot}`}>{t("cancelNote")}</p>
    </aside>
  );
}

/** The promo code, in the payment column. It previews the discount; the server applies it when the booking is created. */
export function PromoField({
  draft,
  setDraft,
  quote,
  onDiscount,
}: {
  draft: Draft;
  setDraft: (update: (draft: Draft) => Draft) => void;
  quote: Quote | null;
  onDiscount: (amount: string | null) => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [code, setCode] = useState(draft.promo);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  // Most people have no code, so the field stays a link until asked for.
  const [open, setOpen] = useState(false);

  const apply = async () => {
    if (!quote) return;
    setChecking(true);
    setError("");
    const result = await checkDiscount(code, itemCount(buildItems(draft)), quote.total);
    setChecking(false);
    if (!result.ok) return setError(translateError(result.error, locale));
    if (!result.data.valid) return setError(translateError(result.data.message, locale));
    onDiscount(result.data.preview?.discountAmount ?? null);
    setDraft((c) => ({ ...c, promo: code.trim().toUpperCase() }));
  };

  const remove = () => {
    setCode("");
    setError("");
    onDiscount(null);
    setDraft((c) => ({ ...c, promo: "" }));
  };

  if (draft.promo) {
    return (
      <div className={styles.coPromoApplied}>
        <span>{t("promoApplied", { code: draft.promo })}</span>
        <button type="button" className={styles.coEdit} onClick={remove}>
          {t("remove")}
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button type="button" className={`${styles.coEdit} ${styles.coPromoLink}`} onClick={() => setOpen(true)}>
        {t("havePromo")}
      </button>
    );
  }

  return (
    <div className={styles.coPromo}>
      <label htmlFor="promo">
        {t("promo")} <span className={styles.popOptional}>{t("optional")}</span>
      </label>
      <div>
        <input
          id="promo"
          dir="ltr"
          className={styles.popInput}
          value={code}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            setCode(event.target.value);
            setError("");
          }}
          placeholder="IRIS10"
          maxLength={50}
        />
        <button type="button" className={styles.coApply} disabled={!code.trim() || checking || !quote} onClick={apply}>
          {t("apply")}
        </button>
      </div>
      {error && (
        <span className="errorMessage" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
