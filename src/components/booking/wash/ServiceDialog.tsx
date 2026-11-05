"use client";

import { useEffect, useId, useMemo, useState, useSyncExternalStore } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { fetchSlots, type ServiceOption, type SlotInfo, type VisitDetails } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { buildItems, dateKey, formatMoney, isConfigured, pick, slotLabel, sorted, type Draft } from "./draft";
import Popup from "./Popup";
import SelectField from "./SelectField";
import { Banner, Cta } from "./ui";
import { useQuote } from "./useQuote";
import styles from "./Wash.module.css";

const DAYS_AHEAD = 7;
// Up to this many choices show as cards; more fall back to a dropdown.
const MAX_CARDS = 6;
const SCENTS: VisitDetails["scent"][] = ["NONE", "LIGHT", "MEDIUM"];
const ACCESS: VisitDetails["vehicleAccess"][] = ["OPEN", "OWNER", "GUARD"];

type SlotsResult = { key: string; slots: SlotInfo[] | null };

// Phones get the popup as a wizard: one question per screen.
const PHONE = "(max-width: 600px)";
const watchPhone = (onChange: () => void) => {
  const query = window.matchMedia(PHONE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isPhone = () => window.matchMedia(PHONE).matches;

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
      return {
        key: dateKey(day),
        label: day.toLocaleDateString(dateLocale, { weekday: "long", day: "numeric", month: "short" }),
        weekday: day.toLocaleDateString(dateLocale, { weekday: "short" }),
        num: day.toLocaleDateString(dateLocale, { day: "numeric" }),
      };
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

  // With options to pick, "Your wash" and "When" sit side by side on wider screens, so the popup fits without scrolling.
  const half = options.length > 0 ? styles.popHalf : "";

  // The phone wizard: one screen per option, then "when", then the visit details. It restarts each time the popup opens.
  const phone = useSyncExternalStore(watchPhone, isPhone, () => false);
  const [wizard, setWizard] = useState({ open, page: 0 });
  if (wizard.open !== open) setWizard({ open, page: 0 });
  const whenPage = options.length;
  const lastPage = options.length + 1;
  const page = phone ? Math.min(wizard.page, lastPage) : -1;
  const goTo = (next: number) => setWizard({ open, page: next });
  // Hides what is not on the current screen (only on phones).
  const off = (index: number) => (phone && page !== index ? styles.wizOff : "");
  const answered = (option: ServiceOption) =>
    !option.isRequired ||
    (option.kind === "INPUT"
      ? buildItems({ ...draft, service: { ...service, options: [option] } }).length > 0
      : (draft.picks[option.pubkey]?.length ?? 0) > 0);
  const pageDone = page < whenPage ? answered(options[page]) : page === whenPage ? timeReady : true;
  const pageName = page < whenPage ? pick(options[page]?.title, locale) : page === whenPage ? t("when") : t("detailsTitle");

  return (
    <Popup open={open} onClose={onClose} size="md" title={pick(service.title, locale)} subtitle={pick(service.description, locale) || undefined}>
      {phone && (
        <div className={styles.wizTop}>
          <div className={styles.wizRow}>
            {page > 0 && (
              <button type="button" className={styles.wizBack} onClick={() => goTo(page - 1)} aria-label={t("back")}>
                <IconArrowLeft className={styles.mStepBackIcon} size={18} stroke={2} aria-hidden />
              </button>
            )}
            <span className={styles.wizStep}>
              {t("step", { current: page + 1, total: lastPage + 1 })} · {pageName}
            </span>
          </div>
          <ol className={styles.mStepBars} aria-hidden>
            {Array.from({ length: lastPage + 1 }, (_, index) => (
              <li key={index} className={index <= page ? styles.wizBarOn : undefined} />
            ))}
          </ol>
        </div>
      )}

      {options.length > 0 && (
      <section className={`${styles.popSection} ${half} ${phone && page >= whenPage ? styles.wizOff : ""}`} aria-label={t("yourWash")}>
        <h3 className={styles.popSectionTitle}>{t("yourWash")}</h3>
        <div className={`${styles.popGrid} ${styles.popGridStack}`}>
          {options.map((option, index) => {
            const label = pick(option.title, locale);
            const hint = option.isRequired ? undefined : t("optional");

            if (option.kind === "INPUT") {
              const value = draft.dims[option.pubkey] ?? "";
              const outOfRange = value !== "" && buildItems({ ...draft, service: { ...service, options: [option] } }).length === 0;
              return (
                <div key={option.pubkey} className={`${styles.popField} ${styles.popFull} ${off(index)}`}>
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
                <fieldset key={option.pubkey} className={`${styles.popField} ${styles.popFull} ${styles.popChecks} ${off(index)}`}>
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

            // A short list is a row of cards, one tap each; a long one stays a dropdown.
            if (option.variables.length <= MAX_CARDS) {
              const current = draft.picks[option.pubkey]?.[0] ?? "";
              return (
                <div key={option.pubkey} className={`${styles.popField} ${styles.popFull} ${off(index)}`}>
                  <span className={styles.popLabel} id={`${option.pubkey}-label`}>
                    {label}
                    {hint && <span className={styles.popOptional}>{hint}</span>}
                  </span>
                  <div className={styles.optGrid} role="radiogroup" aria-labelledby={`${option.pubkey}-label`}>
                    {sorted(option.variables).map((variable) => {
                      const on = current === variable.pubkey;
                      return (
                        <button
                          key={variable.pubkey}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          className={styles.optCard}
                          // Tapping the chosen card again clears an optional choice.
                          onClick={() => choose(option, on && !option.isRequired ? [] : [variable.pubkey])}
                        >
                          <b>{pick(variable.title, locale)}</b>
                          <small>{formatMoney(variable.price, locale)}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div key={option.pubkey} className={off(index)}>
              <SelectField
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
              </div>
            );
          })}
        </div>
      </section>
      )}

      <section className={`${styles.popSection} ${half} ${off(whenPage)}`} aria-label={t("when")}>
        <h3 className={styles.popSectionTitle}>{t("when")}</h3>
        <div className={styles.popGrid}>
          {/* Now or later as a two-way switch; a later wash picks a day, then a time. */}
          <div className={`${styles.seg} ${styles.popFull}`} role="radiogroup" aria-label={t("when")}>
            {(["now", "later"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={draft.when === value}
                onClick={() => setDraft((c) => ({ ...c, when: value, slot: null }))}
              >
                {value === "now" ? t("asap") : t("schedule")}
              </button>
            ))}
          </div>

          {draft.when === "later" && (
            <>
              <div className={`${styles.dayRow} ${styles.popFull}`} role="radiogroup" aria-label={t("pickDay")}>
                {days.map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    role="radio"
                    aria-checked={date === day.key}
                    aria-label={day.label}
                    className={styles.dayChip}
                    onClick={() => setDraft((c) => ({ ...c, date: day.key, slot: null }))}
                  >
                    <small>{day.weekday}</small>
                    <b>{day.num}</b>
                  </button>
                ))}
              </div>

              <div className={`${styles.popField} ${styles.popFull}`}>
                <span className={styles.popLabel}>{t("pickTime")}</span>
                {slots === undefined && <p className={styles.popHint}>{t("loadingSlots")}</p>}
                {slots && (
                  <div className={styles.slotGrid} role="radiogroup" aria-label={t("pickTime")}>
                    {slots.map((slot) => (
                      <button
                        key={slot.timeSlot}
                        type="button"
                        role="radio"
                        aria-checked={draft.slot === slot.timeSlot}
                        disabled={!slot.available}
                        className={styles.slotChip}
                        onClick={() => setDraft((c) => ({ ...c, date, slot: slot.timeSlot }))}
                      >
                        {slotLabel(slot.timeSlot)}
                        {!slot.available && <small>{t("slotFull")}</small>}
                      </button>
                    ))}
                  </div>
                )}
                {slots === null && <Banner tone="warn">{t("slotsFailed")}</Banner>}
              </div>
            </>
          )}
        </div>
      </section>

      <section className={`${styles.popSection} ${off(lastPage)}`} aria-label={t("detailsTitle")}>
        <h3 className={styles.popSectionTitle}>{t("detailsTitle")}</h3>
        <div className={styles.popGrid}>
          <div className={`${styles.popField} ${styles.popFull}`}>
            <span className={styles.popLabel}>{t("access")}</span>
            <div className={styles.pillRow} role="radiogroup" aria-label={t("access")}>
              {ACCESS.map((access) => (
                <button
                  key={access}
                  type="button"
                  role="radio"
                  aria-checked={draft.visit.vehicleAccess === access}
                  className={styles.pill}
                  onClick={() => setVisit({ vehicleAccess: access })}
                >
                  {t(`access_${access}`)}
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.popField} ${styles.popFull}`}>
            <span className={styles.popLabel}>{t("scent")}</span>
            <div className={styles.seg} role="radiogroup" aria-label={t("scent")}>
              {SCENTS.map((scent) => (
                <button key={scent} type="button" role="radio" aria-checked={draft.visit.scent === scent} onClick={() => setVisit({ scent })}>
                  {t(`scent_${scent}`)}
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.switchRow} ${styles.popFull}`}>
            <span id={`${notesId}-dnd`}>{t("doNotDisturb")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={draft.visit.doNotDisturb}
              aria-labelledby={`${notesId}-dnd`}
              className={`${styles.switch} ${draft.visit.doNotDisturb ? styles.switchOn : ""}`}
              onClick={() => setVisit({ doNotDisturb: !draft.visit.doNotDisturb })}
            />
          </div>

          <div className={`${styles.popField} ${styles.popFull}`}>
            <label htmlFor={notesId}>
              {t("notes")}
              <span className={styles.popOptional}>{t("optional")}</span>
            </label>
            <textarea
              id={notesId}
              className={`${styles.popInput} ${styles.popTextarea}`}
              rows={2}
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
        {phone && page < lastPage ? (
          <Cta disabled={!pageDone} onClick={() => goTo(page + 1)}>
            {t("continue")}
          </Cta>
        ) : (
          <Cta disabled={!ready} onClick={onNext}>
            {loading ? t("pricing") : timeReady ? t("reviewBooking") : t("pickTimeToContinue")}
          </Cta>
        )}
      </div>
    </Popup>
  );
}
