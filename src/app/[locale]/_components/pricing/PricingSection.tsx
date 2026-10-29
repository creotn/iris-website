import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import type { CSSProperties } from "react";
import { fetchMembershipPlans } from "@/api/PricingAPI";
import { getScopedI18n } from "@/locales/server";
import PricingTabs from "./PricingTabs";
import { addOnPrices, carSizes, singleWashes } from "./pricing.content";
import SectionHeader from "../shared/SectionHeader";
import SpotlightGrid from "../shared/SpotlightGrid";
import styles from "./PricingSection.module.css";

type L10n = { en?: string; ar?: string; ur?: string } | null | undefined;

const pick = (field: L10n, locale: Locale) => field?.[locale] ?? field?.ar ?? field?.en ?? "";

const formatAmount = (value: string | number) => {
  const n = Number(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

function Price({ value, currency }: { value: string; currency: string }) {
  const n = Number(value);
  return (
    <span className={styles.price}>
      {Number.isInteger(n) ? (
        <>
          <span className={styles.counter} style={{ "--target": n } as CSSProperties} aria-hidden="true" />
          <span className={styles.srOnly}>{n}</span>
        </>
      ) : (
        <span className={styles.amount}>{n.toFixed(2)}</span>
      )}
      <span className={styles.currency}>{currency}</span>
    </span>
  );
}

export default async function PricingSection({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("pricing");
  const plans = await fetchMembershipPlans();

  const badged = plans.findIndex((plan) => plan.badgeLabel);
  const cheapest = plans.reduce(
    (best, plan, i) => {
      const avg = Number(plan.averageWashPrice);
      return plan.averageWashPrice && avg > 0 && avg < best.avg ? { i, avg } : best;
    },
    { i: -1, avg: Infinity },
  ).i;
  const featured = badged >= 0 ? badged : plans.length > 1 ? cheapest : -1;

  const validity = (days: number) =>
    days % 365 === 0
      ? t("validityYears", { count: days / 365 })
      : days % 30 === 0
        ? t("validityMonths", { count: days / 30 })
        : t("validityDays", { count: days });

  const memberships = (
    <>
      {plans.length === 0 && <p className={styles.empty}>{t("unavailable")}</p>}

      {plans.length > 0 && (
        <>
          <SpotlightGrid className={styles.grid}>
            {plans.map((plan, index) => {
              const name = pick(plan.name, locale);
              const isFeatured = index === 1;
              const badge = plan.badgeLabel || (isFeatured ? t("bestValue") : "");
              const description = pick(plan.description, locale);
              const lines = [
                t("washes", { count: plan.washCount }),
                plan.averageWashPrice ? t("perWash", { price: formatAmount(plan.averageWashPrice) }) : null,
                plan.monthlyWashes ? t("monthly", { count: plan.monthlyWashes }) : null,
                plan.maxCars ? t("cars", { count: plan.maxCars }) : null,
                plan.extraWashPrice ? t("extraWash", { price: formatAmount(plan.extraWashPrice) }) : null,
              ]
                .filter((line): line is string => Boolean(line))
                .slice(0, 5);

              return (
                <li
                  key={plan.pubkey}
                  className={`${styles.card} ${isFeatured ? styles.featured : ""}`}
                  data-spotlight
                  style={{ "--i": index } as CSSProperties}
                >
                  <div className={styles.cardTop}>
                    <h3 className={styles.name}>{name}</h3>
                    {isFeatured && badge && <span className={styles.badge}>{badge}</span>}
                  </div>
                  {description && <p className={styles.desc}>{description}</p>}

                  <div className={styles.priceRow}>
                    <Price value={plan.price} currency={t("currency")} />
                    <span className={styles.minutes}>· {validity(plan.validityDays)}</span>
                  </div>

                  <ul className={styles.features}>
                    {lines.map((line, i) => (
                      <li key={line} style={{ "--f": i } as CSSProperties}>
                        <IconCheck size={18} stroke={2.25} aria-hidden="true" />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.actions}>
                    <Link
                      href={`/${locale}/account`}
                      className={`${styles.cta} ${isFeatured ? styles.ctaPrimary : ""}`}
                      aria-label={t("choosePlanNamed", { name })}
                    >
                      {isFeatured ? t("choosePlanNamed", { name }) : t("choosePlan")}
                    </Link>
                    <Link href={`/${locale}/account`} className={styles.gift} aria-label={t("giftNamed", { name })}>
                      {t("gift")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </SpotlightGrid>
          <p className={styles.note}>{t("membershipNote")}</p>
        </>
      )}
    </>
  );

  const rows = singleWashes.map((wash) => ({
    id: wash.id,
    name: wash.name[locale],
    desc: wash.desc[locale],
    prices: carSizes.map((size) => String(wash.prices[size])),
  }));

  return (
    <section className="section" id="pricing">
      <div className="container">
        <SectionHeader label={t("label")} title={t("title")} description={t("description")} />

        <PricingTabs
          singleLabel={t("tabSingle")}
          membershipsLabel={t("tabMemberships")}
          sizes={[t("sizeSedan"), t("sizeSuv"), t("sizeVan")]}
          rows={rows}
          addOns={t("addOns", { engine: addOnPrices.engineBay, headlight: addOnPrices.headlight })}
          memberships={memberships}
        />
      </div>
    </section>
  );
}
