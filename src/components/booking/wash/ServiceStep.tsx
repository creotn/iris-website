"use client";

import { useState } from "react";
import { IconArrowRight, IconCar, IconChevronLeft, IconChevronRight, IconClock, IconMapPin, IconSearch } from "@tabler/icons-react";
import type { CatalogCategory, CatalogService, SavedAddress, Vehicle } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { formatMoney, pick, sorted } from "./draft";
import { Heading } from "./ui";
import styles from "./Wash.module.css";

const PAGE_SIZE = 6;

export default function ServiceStep({
  categories,
  services,
  vehicle,
  address,
  onPick,
}: {
  categories: CatalogCategory[];
  services: CatalogService[];
  vehicle: Vehicle;
  address: SavedAddress;
  onPick: (service: CatalogService) => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const needle = query.trim().toLowerCase();
  const visible = sorted(services).filter(
    (service) =>
      (!category || service.categoryPubkey === category) &&
      (!needle || pick(service.title, locale).toLowerCase().includes(needle)),
  );

  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const categoryName = (pubkey: string | null) => {
    const match = categories.find((item) => item.pubkey === pubkey);
    return match ? pick(match.label, locale) : "";
  };

  return (
    <div className={styles.stack}>
      <div className={styles.serviceHead}>
        <Heading title={t("serviceTitle")} subtitle={t("serviceSubtitle")} />
        <div className={styles.context}>
          <span className={styles.contextItem}>
            <IconCar size={16} stroke={1.75} aria-hidden />
            {vehicle.make} {vehicle.model}
          </span>
          {address.address && (
            <span className={styles.contextItem}>
              <IconMapPin size={16} stroke={1.75} aria-hidden />
              {address.area?.city ?? address.address.address}
            </span>
          )}
        </div>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.searchBox}>
          <IconSearch size={18} stroke={1.75} aria-hidden />
          <input
            type="search"
            dir="auto"
            value={query}
            placeholder={t("searchServices")}
            aria-label={t("searchServices")}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <span className={styles.count} role="status">
          {t("servicesCount", { count: visible.length })}
        </span>
      </div>

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

      {visible.length === 0 && <p className={styles.empty}>{needle ? t("noMatch") : t("noServices")}</p>}

      <div className={styles.serviceGrid}>
        {shown.map((service) => {
          const prices = service.options.flatMap((option) => option.variables.map((variable) => Number(variable.price)));
          const raw = prices.length > 0 ? Math.min(...prices) : service.indicativePrice != null ? Number(service.indicativePrice) : null;
          const from = raw && raw > 0 ? raw : null;
          const description = pick(service.description, locale);
          const group = categoryName(service.categoryPubkey);
          return (
            <button key={service.pubkey} type="button" className={styles.svcCard} onClick={() => onPick(service)}>
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
                  <IconArrowRight size={18} stroke={2} />
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {pages > 1 && (
        <nav className={styles.pager} aria-label={t("serviceTitle")}>
          <button type="button" className={styles.pageBtn} disabled={current === 1} onClick={() => setPage(current - 1)} aria-label={t("back")}>
            <IconChevronLeft size={18} stroke={2} aria-hidden />
          </button>
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              className={`${styles.pageBtn} ${number === current ? styles.pageOn : ""}`}
              aria-current={number === current ? "page" : undefined}
              onClick={() => setPage(number)}
            >
              {number}
            </button>
          ))}
          <button type="button" className={styles.pageBtn} disabled={current === pages} onClick={() => setPage(current + 1)} aria-label={t("continue")}>
            <IconChevronRight size={18} stroke={2} aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
}
