"use client";

import { useState } from "react";
import { IconCar, IconCheck, IconClock, IconMapPin, IconSparkles } from "@tabler/icons-react";
import { checkDiscount, type SavedAddress, type Vehicle } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { buildItems, formatMoney, itemCount, pick, slotLabel, type Draft } from "./draft";
import { Banner, Cta, Heading, Line } from "./ui";
import { useQuote } from "./useQuote";
import styles from "./Wash.module.css";

type Applied = { code: string; discountAmount: string | null };

export default function ReviewStep({
  draft,
  setDraft,
  vehicle,
  address,
  busy,
  error,
  onConfirm,
}: {
  draft: Draft;
  setDraft: (update: (draft: Draft) => Draft) => void;
  vehicle: Vehicle;
  address: SavedAddress;
  busy: boolean;
  error: string;
  onConfirm: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const service = draft.service!;
  const items = buildItems(draft);
  const { quote } = useQuote(items);

  const [code, setCode] = useState(draft.promo);
  const [promoError, setPromoError] = useState("");
  const [checking, setChecking] = useState(false);
  const [applied, setApplied] = useState<Applied | null>(draft.promo ? { code: draft.promo, discountAmount: null } : null);

  const apply = async () => {
    if (!quote) return;
    setChecking(true);
    setPromoError("");
    const result = await checkDiscount(code, itemCount(items), quote.total);
    setChecking(false);

    if (!result.ok) return setPromoError(translateError(result.error, locale));
    if (!result.data.valid) return setPromoError(translateError(result.data.message, locale));

    const value = code.trim().toUpperCase();
    setApplied({ code: value, discountAmount: result.data.preview?.discountAmount ?? null });
    setDraft((c) => ({ ...c, promo: value }));
  };

  const remove = () => {
    setApplied(null);
    setCode("");
    setPromoError("");
    setDraft((c) => ({ ...c, promo: "" }));
  };

  const when =
    draft.when === "now"
      ? t("asap")
      : `${new Date(`${draft.date}T12:00:00`).toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })} · ${draft.slot ? slotLabel(draft.slot) : ""}`;

  return (
    <div className={styles.stack}>
      <Heading title={t("reviewTitle")} />

      <div className={styles.card}>
        <Line
          label={
            <>
              <IconSparkles size={14} stroke={1.75} aria-hidden /> {pick(service.title, locale)} × {draft.qty}
            </>
          }
          value=""
        />
        <Line
          label={
            <>
              <IconCar size={14} stroke={1.75} aria-hidden /> {vehicle.make} {vehicle.model}
            </>
          }
          value=""
        />
        <Line
          label={
            <>
              <IconMapPin size={14} stroke={1.75} aria-hidden /> {address.address?.address}
            </>
          }
          value=""
        />
        <Line
          label={
            <>
              <IconClock size={14} stroke={1.75} aria-hidden /> {when}
            </>
          }
          value=""
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="promo" className={styles.groupLabel}>
          {t("promo")} <span className={styles.hint}>({t("optional")})</span>
        </label>
        {applied ? (
          <Banner tone="ok" icon={<IconCheck size={18} stroke={2} aria-hidden />}>
            {t("promoApplied", { code: applied.code })}{" "}
            <button type="button" className={styles.secondary} style={{ padding: "2px 10px" }} onClick={remove}>
              {t("remove")}
            </button>
          </Banner>
        ) : (
          <>
            <div className={styles.promo}>
              <input
                id="promo"
                dir="ltr"
                className={`${styles.plain} ${promoError ? styles.plainBad : ""}`}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setPromoError("");
                }}
                placeholder="IRIS10"
                maxLength={50}
              />
              <button type="button" className={styles.secondary} disabled={!code.trim() || checking || !quote} onClick={apply}>
                {t("apply")}
              </button>
            </div>
            <span className="errorMessage" role="alert">
              {promoError}
            </span>
          </>
        )}
      </div>

      {quote && (
        <div className={styles.card}>
          <Line label={t("subtotal")} value={formatMoney(quote.total, locale)} />
          {applied?.discountAmount && <Line tone="negative" label={t("discount")} value={`−${formatMoney(applied.discountAmount, locale)}`} />}
          <Line label={t("vat")} value={formatMoney(quote.tax.taxAmount, locale)} />
          <Line strong label={applied ? t("estimatedTotal") : t("total")} value={formatMoney(quote.tax.amountDue, locale)} />
        </div>
      )}
      {applied && <span className={styles.hint}>{t("finalTotalNote")}</span>}
      <span className={styles.hint}>{t("cancelNote")}</span>

      <p className="errorMessage" role="alert">
        {error}
      </p>

      <Cta disabled={!quote || busy} onClick={onConfirm}>
        {busy ? t("creating") : t("continueToPayment")}
      </Cta>
    </div>
  );
}
