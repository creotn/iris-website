"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { fetchSlots, type ServiceOption, type SlotInfo, type VisitDetails } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { buildItems, dateKey, formatMoney, isConfigured, MAX_QTY, pick, slotLabel, sorted, type Draft } from "./draft";
import Popup from "./Popup";
import SelectField from "./SelectField";
import { Banner, Cta } from "./ui";
import { useQuote } from "./useQuote";
import styles from "./Wash.module.css";

const DAYS_AHEAD = 7;
const SCENTS: VisitDetails["scent"][] = ["NONE", "LIGHT", "MEDIUM"];
const ACCESS: VisitDetails["vehicleAccess"][] = ["OPEN", "OWNER", "GUARD"];

type SlotsResult = { key: string; slots: SlotInfo[] | null };

/** Everything about the chosen service in one popup: its options, quantity, when, and the visit details. */
export default function ServiceDialog({
  open,
  draft,
  setDraft,
  areaPubkey,
  onClose,
  onNext,
}: {
  open: boolean;
  draft: Draft;
  setDraft: (update: (draft: Draft) => Draft) => void;
  areaPubkey: string;
  onClose: () => void;
  onNext: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const dateLocale = locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US";
  const notesId = useId();
  const service = draft.service!;
  const options = sorted(service.options).filter((option) => option.kind !== "CATEGORY");
  const { quote, loading, error } = useQuote(buildItems(draft));

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: DAYS_AHEAD }, (_, index) => {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
      return { key: dateKey(day), label: day.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "short" }) };
    });
  }, [dateLocale]);
  const date = draft.date || days[0].key;

  // Slots are only fetched for a scheduled wash, and kept per area and day.
  const slotsKey = open && draft.when === "later" ? `${areaPubkey}|${date}` : "";
  const [result, setResult] = useState<SlotsResult | null>(null);
  useEffect(() => {
    if (!slotsKey) return;
    let active = true;
    fetchSlots(areaPubkey, date).then((response) => {
      if (active) setResult({ key: slotsKey, slots: response.ok ? response.data : null });
    });
    return () => {
      active = false;
    };
  }, [slotsKey, areaPubkey, date]);
  const slots = result?.key === slotsKey ? result.slots : undefined;

  const setVisit = (visit: Partial<VisitDetails>) => setDraft((c) => ({ ...c, visit: { ...c.visit, ...visit } }));
  const choose = (option: ServiceOption, variables: string[]) =>
    setDraft((c) => ({ ...c, picks: { ...c.picks, [option.pubkey]: variables } }));

  const timeReady = draft.when === "now" || draft.slot !== null;
  const ready = isConfigured(draft) && quote !== null && timeReady;

  return (
    <Popup open={open} onClose={onClose} size="md" title={pick(service.title, locale)} subtitle={pick(service.description, locale) || undefined}>
      <section className={styles.popSection} aria-label={t("yourWash")}>
        <h3 className={styles.popSectionTitle}>{t("yourWash")}</h3>
        <div className={styles.popGrid}>
          {options.map((option) => {
            const label = pick(option.title, locale);
            const hint = option.isRequired ? undefined : t("optional");

            if (option.kind === "INPUT") {
              const value = draft.dims[option.pubkey] ?? "";
              const outOfRange = value !== "" && buildItems({ ...draft, service: { ...service, options: [option] } }).length === 0;
              return (
                <div key={option.pubkey} className={`${styles.popField} ${styles.popFull}`}>
                  <label htmlFor={option.pubkey}>
                    {label}
                    {hint && <span className={styles.popOptional}>{hint}</span>}
                  </label>
                  <input
                    id={option.pubkey}
                    className={styles.popInput}
                    inputMode="decimal"
                    dir="ltr"
                    value={value}
                    placeholder={t("measurement")}
                    aria-invalid={outOfRange || undefined}
                    onChange={(event) => setDraft((c) => ({ ...c, dims: { ...c.dims, [option.pubkey]: event.target.value } }))}
                  />
                  {outOfRange && <p className={styles.popHint}>{t("measurementOutOfRange")}</p>}
                </div>
              );
            }

            if (option.selectionMode === "MULTIPLE") {
              const chosen = draft.picks[option.pubkey] ?? [];
              return (
                <fieldset key={option.pubkey} className={`${styles.popField} ${styles.popFull} ${styles.popChecks}`}>
                  <legend>
                    {label}
                    {hint && <span className={styles.popOptional}>{hint}</span>}
                  </legend>
                  {sorted(option.variables).map((variable) => (
                    <label key={variable.pubkey} className={styles.popCheck}>
                      <input
                        type="checkbox"
                        checked={chosen.includes(variable.pubkey)}
                        onChange={(event) =>
                          choose(option, event.target.checked ? [...chosen, variable.pubkey] : chosen.filter((key) => key !== variable.pubkey))
                        }
                      />
                      <span>{pick(variable.title, locale)}</span>
                      <span className={styles.popCheckPrice}>+{formatMoney(variable.price, locale)}</span>
                    </label>
                  ))}
                </fieldset>
              );
            }

            return (
              <SelectField
                key={option.pubkey}
                label={label}
                hint={hint}
                placeholder={t("chooseOption")}
                value={draft.picks[option.pubkey]?.[0] ?? ""}
                onChange={(value) => choose(option, value ? [value] : [])}
                options={[
                  // An optional choice can be cleared again.
                  ...(option.isRequired ? [] : [{ value: "", label: t("chooseOption") }]),
                  ...sorted(option.variables).map((variable) => ({
                    value: variable.pubkey,
                    label: pick(variable.title, locale),
                    meta: formatMoney(variable.price, locale),
                  })),
                ]}
              />
            );
          })}

          <SelectField
            label={t("quantity")}
            value={String(draft.qty)}
            onChange={(value) => setDraft((c) => ({ ...c, qty: Number(value) }))}
            options={Array.from({ length: MAX_QTY }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }))}
          />
        </div>
      </section>

      <section className={styles.popSection} aria-label={t("when")}>
        <h3 className={styles.popSectionTitle}>{t("when")}</h3>
        <div className={styles.popGrid}>
          <SelectField
            label={t("when")}
            full
            value={draft.when}
            onChange={(value) => setDraft((c) => ({ ...c, when: value as Draft["when"], slot: null }))}
            options={[
              { value: "now", label: t("asap") },
              { value: "later", label: t("schedule") },
            ]}
          />

          {draft.when === "later" && (
            <>
              <SelectField
                label={t("pickDay")}
                value={date}
                onChange={(value) => setDraft((c) => ({ ...c, date: value, slot: null }))}
                options={days.map((day) => ({ value: day.key, label: day.label }))}
              />
              <SelectField
                label={t("pickTime")}
                placeholder={slots === undefined ? t("loadingSlots") : t("pickTime")}
                disabled={!slots}
                value={draft.slot ?? ""}
                onChange={(value) => setDraft((c) => ({ ...c, date, slot: value }))}
                options={(slots ?? []).map((slot) => ({
                  value: slot.timeSlot,
                  label: slotLabel(slot.timeSlot),
                  meta: slot.available ? undefined : t("slotFull"),
                  disabled: !slot.available,
                }))}
              />
              {slots === null && (
                <div className={styles.popFull}>
                  <Banner tone="warn">{t("slotsFailed")}</Banner>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className={styles.popSection} aria-label={t("detailsTitle")}>
        <h3 className={styles.popSectionTitle}>{t("detailsTitle")}</h3>
        <div className={`${styles.popGrid} ${styles.popPairs}`}>
          <SelectField
            label={t("scent")}
            value={draft.visit.scent}
            onChange={(value) => setVisit({ scent: value as VisitDetails["scent"] })}
            options={SCENTS.map((scent) => ({ value: scent, label: t(`scent_${scent}`) }))}
          />
          <SelectField
            label={t("access")}
            value={draft.visit.vehicleAccess}
            onChange={(value) => setVisit({ vehicleAccess: value as VisitDetails["vehicleAccess"] })}
            options={ACCESS.map((access) => ({ value: access, label: t(`access_${access}`) }))}
          />

          <label className={`${styles.popCheck} ${styles.popFull}`}>
            <input type="checkbox" checked={draft.visit.doNotDisturb} onChange={(event) => setVisit({ doNotDisturb: event.target.checked })} />
            <span>{t("doNotDisturb")}</span>
          </label>

          <div className={`${styles.popField} ${styles.popFull}`}>
            <label htmlFor={notesId}>
              {t("notes")}
              <span className={styles.popOptional}>{t("optional")}</span>
            </label>
            <textarea
              id={notesId}
              className={`${styles.popInput} ${styles.popTextarea}`}
              rows={3}
              maxLength={500}
              dir="auto"
              value={draft.notes}
              placeholder={t("notesPlaceholder")}
              onChange={(event) => setDraft((c) => ({ ...c, notes: event.target.value }))}
            />
          </div>
        </div>
      </section>

      {error && <Banner tone="warn">{t("quoteFailed")}</Banner>}

      <div className={styles.popFoot}>
        <div className={styles.popTotal}>
          <small>
            {t("total")} · {t("vat")}
          </small>
          {quote ? (
            <b aria-live="polite">{formatMoney(quote.tax.amountDue, locale)}</b>
          ) : (
            <span aria-live="polite">{loading ? t("pricing") : t("priceOnSelection")}</span>
          )}
        </div>
        <Cta disabled={!ready} onClick={onNext}>
          {loading ? t("pricing") : timeReady ? t("reviewBooking") : t("pickTimeToContinue")}
        </Cta>
      </div>
    </Popup>
  );
}
