"use client";

import { useState } from "react";
import { IconCar, IconClock, IconMapPin, IconSparkles } from "@tabler/icons-react";
import type { CatalogCategory, CatalogService, SavedAddress, Vehicle } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { formatMoney, pick, sorted } from "./draft";
import { Banner, Heading } from "./ui";
import styles from "./Wash.module.css";

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

  const visible = sorted(services).filter((service) => !category || service.categoryPubkey === category);

  return (
    <div className={styles.stack}>
      <Heading title={t("serviceTitle")} subtitle={t("serviceSubtitle")} />

      <Banner icon={<IconCar size={18} stroke={1.75} aria-hidden />}>
        {vehicle.make} {vehicle.model}
        {address.address && (
          <>
            {" · "}
            <IconMapPin size={14} stroke={1.75} aria-hidden /> {address.area?.city ?? address.address.address}
          </>
        )}
      </Banner>

      {categories.length > 0 && (
        <div className={styles.chips} role="group" aria-label={t("categories")}>
          <button type="button" className={`${styles.chip} ${category === null ? styles.chipOn : ""}`} onClick={() => setCategory(null)}>
            {t("all")}
          </button>
          {sorted(categories).map((item) => (
            <button
              key={item.pubkey}
              type="button"
              className={`${styles.chip} ${category === item.pubkey ? styles.chipOn : ""}`}
              onClick={() => setCategory(item.pubkey)}
            >
              {pick(item.label, locale)}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 && <p className={styles.empty}>{t("noServices")}</p>}

      {visible.map((service) => {
        const prices = service.options.flatMap((option) => option.variables.map((variable) => Number(variable.price)));
        const from = prices.length > 0 ? Math.min(...prices) : service.indicativePrice != null ? Number(service.indicativePrice) : null;
        return (
          <button key={service.pubkey} type="button" className={styles.option} onClick={() => onPick(service)}>
            <span className={styles.icon} aria-hidden>
              <IconSparkles size={20} stroke={1.75} />
            </span>
            <span className={styles.text}>
              <b>{pick(service.title, locale)}</b>
              <small>
                {service.estimatedMinutes != null && (
                  <>
                    <IconClock size={12} stroke={1.75} aria-hidden /> {t("minutes", { count: service.estimatedMinutes })}
                  </>
                )}
              </small>
            </span>
            {from != null && (
              <span className={styles.price}>
                {t("from")} {formatMoney(from, locale)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
