"use client";

import { useState } from "react";
import { IconArrowRight, IconCheck, IconClock } from "@tabler/icons-react";
import type { CatalogCategory, CatalogService } from "@/api/BookingAPI";
import { Pager } from "@/components/table/TableParts";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { formatMoney, pick, sorted } from "./draft";
import { Cta, StepFooter, StepHeading } from "./ui";
import styles from "./Wash.module.css";

const PAGE_SIZE = 6;

export default function ServiceStep({
  categories,
  services,
  selected,
  onPick,
  onContinue,
}: {
  categories: CatalogCategory[];
  services: CatalogService[];
  selected: CatalogService | null;
  onPick: (service: CatalogService) => void;
  /** Reopens the popup for the chosen service. */
  onContinue: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const visible = sorted(services).filter((service) => !category || service.categoryPubkey === category);

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const categoryName = (pubkey: string | null) => {
    const match = categories.find((item) => item.pubkey === pubkey);
    return match ? pick(match.label, locale) : "";
  };

  return (
    <div className={styles.stack}>
      <StepHeading
        step={3}
        title={t("serviceTitle")}
        subtitle={t("serviceSubtitle")}
      />


      {categories.length > 0 && (
        <div className={styles.catTabs} role="group" aria-label={t("categories")}>
          <button type="button" className={`${styles.catTab} ${category === null ? styles.catTabOn : ""}`} onClick={() => {
              setCategory(null);
              setPage(1);
            }}>
            {t("all")}
          </button>
          {sorted(categories).map((item) => (
            <button
              key={item.pubkey}
              type="button"
              className={`${styles.catTab} ${category === item.pubkey ? styles.catTabOn : ""}`}
              onClick={() => {
                setCategory(item.pubkey);
                setPage(1);
              }}
            >
              {pick(item.label, locale)}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 && <p className={styles.empty}>{t("noServices")}</p>}

      <div className={styles.serviceGrid}>
        {shown.map((service) => {
          const prices = service.options.flatMap((option) => option.variables.map((variable) => Number(variable.price)));
          const raw = prices.length > 0 ? Math.min(...prices) : service.indicativePrice != null ? Number(service.indicativePrice) : null;
          const from = raw && raw > 0 ? raw : null;
          const description = pick(service.description, locale);
          const group = categoryName(service.categoryPubkey);
          const on = service.pubkey === selected?.pubkey;
          return (
            <button
              key={service.pubkey}
              type="button"
              className={`${styles.svcCard} ${on ? styles.svcCardOn : ""}`}
              aria-pressed={on}
              onClick={() => onPick(service)}
            >
              <span className={styles.svcMeta}>
                <span className={styles.svcGroup}>{group}</span>
                {service.estimatedMinutes != null && (
                  <span className={styles.svcTime}>
                    <IconClock size={14} stroke={1.75} aria-hidden />
                    {t("minutes", { count: service.estimatedMinutes })}
                  </span>
                )}
              </span>
              <b className={styles.svcTitle}>{pick(service.title, locale)}</b>
              {description && <span className={styles.svcDesc}>{description}</span>}
              <span className={styles.svcFoot}>
                {from != null ? (
                  <span className={styles.svcPrice}>
                    <small>{t("from")}</small>
                    {formatMoney(from, locale)}
                  </span>
                ) : (
                  <span className={styles.priceNote}>{t("priceOnSelection")}</span>
                )}
                <span className={styles.svcGo} aria-hidden>
                  {on ? <IconCheck size={18} stroke={2.5} /> : <IconArrowRight size={18} stroke={2} />}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <Pager page={current} pages={pages} onPage={setPage} label={t("serviceTitle")} previous={t("back")} next={t("continue")} />

      <StepFooter label={t("stepService")} hint={t("pickServiceHint")} value={selected && pick(selected.title, locale)}>
        <Cta disabled={!selected} onClick={onContinue}>
          {t("continue")}
        </Cta>
      </StepFooter>
    </div>
  );
}
