"use client";

import { IconCheck } from "@tabler/icons-react";
import type { ServiceOption } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { buildItems, formatMoney, isConfigured, pick, sorted, type Draft } from "./draft";
import { Banner, Cta, Heading, Line } from "./ui";
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

  const ready = isConfigured(draft) && quote !== null;

  return (
    <div className={styles.stack}>
      <Heading title={pick(service.title, locale)} subtitle={pick(service.description, locale)} />

      {sorted(service.options)
        .filter((option) => option.kind !== "CATEGORY")
        .map((option) => (
        <div key={option.pubkey} className={styles.group} role="group" aria-label={pick(option.title, locale)}>
          <span className={styles.groupLabel}>
            {pick(option.title, locale)}
            {!option.isRequired && <span className={styles.hint}> ({t("optional")})</span>}
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
            sorted(option.variables).map((variable) => {
              const on = (draft.picks[option.pubkey] ?? []).includes(variable.pubkey);
              const multiple = option.selectionMode === "MULTIPLE";
              return (
                <button
                  key={variable.pubkey}
                  type="button"
                  className={`${styles.option} ${on ? styles.optionOn : ""}`}
                  role={multiple ? "checkbox" : "radio"}
                  aria-checked={on}
                  onClick={() => toggle(option, variable.pubkey)}
                >
                  <span className={styles.text}>
                    <b>{pick(variable.title, locale)}</b>
                  </span>
                  <span className={styles.price}>{formatMoney(variable.price, locale)}</span>
                  <span className={`${styles.mark} ${multiple ? styles.markBox : ""} ${on ? styles.markOn : ""}`} aria-hidden>
                    {on && <IconCheck size={14} stroke={3} />}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ))}

      <div className={styles.switchRow}>
        <span>{t("quantity")}</span>
        <div className={styles.stepper}>
          <button type="button" aria-label={t("less")} disabled={draft.qty <= 1} onClick={() => setDraft((c) => ({ ...c, qty: c.qty - 1 }))}>
            −
          </button>
          <span aria-live="polite">{draft.qty}</span>
          <button type="button" aria-label={t("more")} disabled={draft.qty >= MAX_QTY} onClick={() => setDraft((c) => ({ ...c, qty: c.qty + 1 }))}>
            +
          </button>
        </div>
      </div>

      {error && <Banner tone="warn">{t("quoteFailed")}</Banner>}

      {quote && (
        <div className={styles.card}>
          <Line label={t("subtotal")} value={formatMoney(quote.total, locale)} />
          <Line label={t("vat")} value={formatMoney(quote.tax.taxAmount, locale)} />
          <Line strong label={t("total")} value={formatMoney(quote.tax.amountDue, locale)} />
        </div>
      )}

      <Cta disabled={!ready} onClick={onNext}>
        {loading ? t("pricing") : quote ? t("continueWith", { total: formatMoney(quote.tax.amountDue, locale) }) : t("continue")}
      </Cta>
    </div>
  );
}
