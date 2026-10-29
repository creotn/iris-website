"use client";

import { IconCar, IconCheck, IconMinus, IconPlus, IconSparkles } from "@tabler/icons-react";
import type { ServiceOption } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { buildItems, formatMoney, isConfigured, pick, sorted, type Draft } from "./draft";
import { Banner, Cta, Heading } from "./ui";
import { useQuote } from "./useQuote";
import styles from "./Wash.module.css";

const MAX_QTY = 5;

export default function CustomizeStep({
  draft,
  setDraft,
  onNext,
}: {
  draft: Draft;
  setDraft: (update: (draft: Draft) => Draft) => void;
  onNext: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const service = draft.service!;
  const items = buildItems(draft);
  const { quote, loading, error } = useQuote(items);

  const toggle = (option: ServiceOption, variablePubkey: string) =>
    setDraft((current) => {
      const chosen = current.picks[option.pubkey] ?? [];
      const next =
        option.selectionMode === "MULTIPLE"
          ? chosen.includes(variablePubkey)
            ? chosen.filter((key) => key !== variablePubkey)
            : [...chosen, variablePubkey]
          : [variablePubkey];
      return { ...current, picks: { ...current.picks, [option.pubkey]: next } };
    });

  const options = sorted(service.options).filter((option) => option.kind !== "CATEGORY");
  const ready = isConfigured(draft) && quote !== null;

  return (
    <div className={styles.stack}>
      <Heading title={pick(service.title, locale)} subtitle={pick(service.description, locale)} />

      <div className={styles.customizeMain}>
          {options.map((option, index) => (
            <section key={option.pubkey} className={styles.group} role="group" aria-label={pick(option.title, locale)}>
              <span className={styles.groupHead}>
                <span className={styles.groupIndex} aria-hidden>
                  {index + 1}
                </span>
                <span className={styles.groupLabel}>
                  {pick(option.title, locale)}
                  {!option.isRequired && <span className={styles.hint}> ({t("optional")})</span>}
                </span>
              </span>

              {option.kind === "INPUT" ? (
                <>
                  <input
                    className={styles.plain}
                    inputMode="decimal"
                    dir="ltr"
                    value={draft.dims[option.pubkey] ?? ""}
                    onChange={(event) => setDraft((current) => ({ ...current, dims: { ...current.dims, [option.pubkey]: event.target.value } }))}
                    placeholder={t("measurement")}
                  />
                  {draft.dims[option.pubkey] && buildItems({ ...draft, service: { ...service, options: [option] } }).length === 0 && (
                    <span className={styles.hint}>{t("measurementOutOfRange")}</span>
                  )}
                </>
              ) : (
                <div className={styles.choiceGrid}>
                  {sorted(option.variables).map((variable) => {
                    const on = (draft.picks[option.pubkey] ?? []).includes(variable.pubkey);
                    const multiple = option.selectionMode === "MULTIPLE";
                    return (
                      <button
                        key={variable.pubkey}
                        type="button"
                        className={`${styles.choice} ${on ? styles.choiceOn : ""}`}
                        role={multiple ? "checkbox" : "radio"}
                        aria-checked={on}
                        onClick={() => toggle(option, variable.pubkey)}
                      >
                        <span className={styles.choiceIcon} aria-hidden>
                          {multiple ? <IconSparkles size={22} stroke={1.75} /> : <IconCar size={22} stroke={1.75} />}
                        </span>
                        <span className={`${styles.mark} ${multiple ? styles.markBox : ""} ${on ? styles.markOn : ""}`} aria-hidden>
                          {on && <IconCheck size={14} stroke={3} />}
                        </span>
                        <b className={styles.choiceName}>{pick(variable.title, locale)}</b>
                        <span className={styles.choicePrice}>{formatMoney(variable.price, locale)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
      </div>

      {error && <Banner tone="warn">{t("quoteFailed")}</Banner>}

      <div className={styles.checkoutBar}>
        <div className={styles.checkoutInfo}>
          <small>{quote ? `${t("total")} · ${t("vat")}` : pick(service.title, locale)}</small>
          <span className={styles.checkoutTotal} aria-live="polite">
            {quote ? formatMoney(quote.tax.amountDue, locale) : "—"}
          </span>
        </div>
        <div className={styles.checkoutActions}>
          <div className={styles.switchRow}>
            <span>{t("quantity")}</span>
            <div className={styles.stepper}>
              <button type="button" aria-label={t("less")} disabled={draft.qty <= 1} onClick={() => setDraft((c) => ({ ...c, qty: c.qty - 1 }))}>
                <IconMinus size={16} stroke={2} aria-hidden />
              </button>
              <span aria-live="polite">{draft.qty}</span>
              <button type="button" aria-label={t("more")} disabled={draft.qty >= MAX_QTY} onClick={() => setDraft((c) => ({ ...c, qty: c.qty + 1 }))}>
                <IconPlus size={16} stroke={2} aria-hidden />
              </button>
            </div>
          </div>
          <Cta disabled={!ready} onClick={onNext}>
            {loading ? t("pricing") : t("continue")}
          </Cta>
        </div>
      </div>
    </div>
  );
}
