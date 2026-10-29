"use client";

import { useState, useTransition } from "react";
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconCar,
  IconCarSuv,
  IconCheck,
  IconHash,
  IconMotorbike,
  IconPalette,
  IconPlus,
  IconTruck,
} from "@tabler/icons-react";
import { addVehicle, fetchVehicles, type Vehicle } from "@/api/BookingAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { numberInRange, optional, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { Cta, Heading } from "./ui";
import styles from "./Wash.module.css";

const CAR_TYPES = ["SEDAN", "SUV", "TRUCK", "MOTORCYCLE"] as const;
const TYPE_ICONS: Record<string, typeof IconCar> = {
  SEDAN: IconCar,
  SUV: IconCarSuv,
  TRUCK: IconTruck,
  MOTORCYCLE: IconMotorbike,
};
const PAGE_SIZE = 5;
const noRule = () => null;

function AddCar({ onAdded, onCancel }: { onAdded: (vehicles: Vehicle[], added: Vehicle) => void; onCancel?: () => void }) {
  const t = useScopedI18n("book");
  const tw = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [type, setType] = useState<(typeof CAR_TYPES)[number]>("SEDAN");

  const form = useValidatedForm({
    make: required,
    model: required,
    year: optional(numberInRange(1900, 2200, "errYear")),
    plateNumber: noRule,
    color: noRule,
  });

  const field = (key: keyof typeof form.values) => {
    const { props, error: fieldError } = form.field(key);
    return { ...props, error: fieldError ? t(fieldError) : undefined };
  };

  const save = () =>
    startTransition(async () => {
      const added = await addVehicle({ ...form.values, type });
      if (!added.ok) return setError(translateError(added.error, locale));
      const list = await fetchVehicles();
      if (!list.ok) return setError(translateError(list.error, locale));
      const created = list.data[list.data.length - 1];
      if (created) onAdded(list.data, created);
    });

  return (
    <form className={styles.stack} action={save}>
      {onCancel && (
        <button type="button" className={styles.linkBack} onClick={onCancel}>
          <IconArrowLeft size={16} stroke={1.75} aria-hidden />
          {tw("chooseSavedCar")}
        </button>
      )}

      <div className={styles.addCar}>
        <fieldset className={styles.typeSet}>
          <legend className={formStyles.label}>{t("type")}</legend>
          <div className={styles.typeGrid} role="radiogroup" aria-label={t("type")}>
            {CAR_TYPES.map((carType) => {
              const Icon = TYPE_ICONS[carType];
              return (
                <button
                  key={carType}
                  type="button"
                  role="radio"
                  aria-checked={type === carType}
                  className={`${styles.typeTile} ${type === carType ? styles.typeTileOn : ""}`}
                  onClick={() => setType(carType)}
                >
                  <Icon size={26} stroke={1.5} aria-hidden />
                  <span>{t(`type${carType}`)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className={styles.carFields}>
          <AuthField label={t("make")} icon={<IconCar size={18} stroke={1.75} />} {...field("make")} />
          <AuthField label={t("model")} icon={<IconCar size={18} stroke={1.75} />} {...field("model")} />
          <AuthField label={t("year")} icon={<IconCalendar size={18} stroke={1.75} />} inputMode="numeric" required={false} {...field("year")} />
          <AuthField label={t("color")} icon={<IconPalette size={18} stroke={1.75} />} required={false} {...field("color")} />
          <div className={styles.fullRow}>
            <AuthField label={t("plate")} icon={<IconHash size={18} stroke={1.75} />} required={false} {...field("plateNumber")} />
          </div>
        </div>
      </div>

      <p className="errorMessage" role="alert">
        {error}
      </p>

      <div className={styles.plainBar}>
        <SubmitButton className={formStyles.submit} disabled={!form.isValid || pending}>
          {tw("saveCar")}
        </SubmitButton>
      </div>
    </form>
  );
}

export default function CarStep({
  vehicles,
  selected,
  onSelect,
  onVehiclesChange,
  onNext,
}: {
  vehicles: Vehicle[];
  selected: Vehicle | null;
  onSelect: (vehicle: Vehicle) => void;
  onVehiclesChange: (vehicles: Vehicle[]) => void;
  onNext: () => void;
}) {
  const t = useScopedI18n("wash");
  const tb = useScopedI18n("book");
  const [adding, setAdding] = useState(vehicles.length === 0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"ALL" | (typeof CAR_TYPES)[number]>("ALL");

  const counts = Object.fromEntries(
    ["ALL", ...CAR_TYPES].map((tab) => [tab, tab === "ALL" ? vehicles.length : vehicles.filter((v) => v.type === tab).length]),
  ) as Record<"ALL" | (typeof CAR_TYPES)[number], number>;
  const tabs = (["ALL", ...CAR_TYPES] as const).filter((tab) => counts[tab] > 0);
  const filtered = filter === "ALL" ? vehicles : vehicles.filter((v) => v.type === filter);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const onAdded = (list: Vehicle[], added: Vehicle) => {
    onVehiclesChange(list);
    onSelect(added);
    setAdding(false);
  };

  if (adding) {
    return (
      <div className={styles.stack}>
        <Heading title={t("addNewCar")} subtitle={t("addNewCarSubtitle")} />
        <AddCar onAdded={onAdded} onCancel={vehicles.length > 0 ? () => setAdding(false) : undefined} />
      </div>
    );
  }

  return (
    <div className={styles.stack}>
      <Heading title={t("carStepTitle")} subtitle={t("carStepSubtitle")} />

      <div className={styles.typeTabs} role="tablist" aria-label={tb("type")}>
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={filter === tab}
            className={`${styles.typeTab} ${filter === tab ? styles.typeTabOn : ""}`}
            onClick={() => {
              setFilter(tab);
              setPage(1);
            }}
          >
            {tab === "ALL" ? t("all") : tb(`type${tab}` as "typeSEDAN")}
            <sup>{counts[tab]}</sup>
          </button>
        ))}
      </div>

      <ul className={styles.carRows} role="radiogroup" aria-label={t("carStepTitle")}>
        {shown.map((vehicle) => {
          const on = selected?.pubkey === vehicle.pubkey;
          const meta = [vehicle.color, vehicle.year].filter(Boolean).join(" · ");
          return (
            <li key={vehicle.pubkey}>
              <button type="button" role="radio" aria-checked={on} className={styles.carLine} onClick={() => onSelect(vehicle)}>
                <span className={`${styles.mark} ${on ? styles.markOn : ""}`} aria-hidden>
                  {on && <IconCheck size={14} stroke={3} />}
                </span>
                <span className={styles.carLineName}>
                  {vehicle.make} {vehicle.model}
                </span>
                <span className={styles.carLineMeta}>{meta}</span>
                {vehicle.plateNumber && (
                  <span className={styles.carPlate} dir="ltr">
                    {vehicle.plateNumber}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.carFooter}>
        <button type="button" className={styles.carAddLink} onClick={() => setAdding(true)}>
          <IconPlus size={18} stroke={2} aria-hidden />
          {t("addNewCar")}
        </button>
        <Cta disabled={!selected} onClick={onNext}>
          {t("continue")}
        </Cta>
      </div>

      {pages > 1 && (
        <nav className={styles.pager} aria-label={t("carStepTitle")}>
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
