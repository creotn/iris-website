"use client";

import { useId, useState, useTransition, type ComponentProps } from "react";
import { IconPlus } from "@tabler/icons-react";
import { addVehicle, deleteVehicle, fetchVehicles, updateVehicle, type Vehicle } from "@/api/BookingAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import formStyles from "@/components/forms/SignInForm.module.css";
import { CarColor, Pager, Plate, RowMenu, SortHeader, VehicleMark } from "@/components/table/TableParts";
import table from "@/components/table/DataTable.module.css";
import { useTableView } from "@/components/table/useTableView";
import { numberInRange, optional, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import Popup from "./Popup";
import SelectField from "./SelectField";
import { Cta, Ghost, StepFooter, StepHeading } from "./ui";
import styles from "./Wash.module.css";

const CAR_TYPES = ["SEDAN", "SUV", "TRUCK", "MOTORCYCLE"] as const;
type CarType = (typeof CAR_TYPES)[number];
const PAGE_SIZE = 5;
const noRule = () => null;

type SortKey = "car" | "type" | "color" | "year" | "plate";
const SORT_VALUE: Record<SortKey, (v: Vehicle) => string | number> = {
  car: (v) => `${v.make} ${v.model}`.toLowerCase(),
  type: (v) => CAR_TYPES.indexOf(v.type as CarType),
  color: (v) => (v.color ?? "").toLowerCase(),
  year: (v) => Number(v.year) || 0,
  plate: (v) => v.plateNumber ?? "",
};

const carName = (vehicle: Vehicle) => `${vehicle.make} ${vehicle.model}`;

function Field({ label, hint, error, ...input }: ComponentProps<"input"> & { label: string; hint?: string; error?: string }) {
  const id = useId();
  return (
    <div className={styles.popField}>
      <label htmlFor={id}>
        {label}
        {hint && <span className={styles.popOptional}>{hint}</span>}
      </label>
      <input id={id} dir="auto" className={styles.popInput} aria-invalid={error ? true : undefined} {...input} />
      {error && (
        <span className={formStyles.fieldError} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/** Adds a car, or edits `vehicle` when given. Hands back the refreshed list and the saved car. */
function CarForm({ vehicle, onSaved }: { vehicle?: Vehicle; onSaved: (vehicles: Vehicle[], saved: Vehicle) => void }) {
  const t = useScopedI18n("book");
  const tw = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [type, setType] = useState<CarType>(vehicle && CAR_TYPES.includes(vehicle.type as CarType) ? (vehicle.type as CarType) : "SEDAN");

  const form = useValidatedForm(
    {
      make: required,
      model: required,
      year: optional(numberInRange(1900, 2200, "errYear")),
      plateNumber: noRule,
      color: noRule,
    },
    vehicle && {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year?.toString() ?? "",
      plateNumber: vehicle.plateNumber ?? "",
      color: vehicle.color ?? "",
    },
  );

  const field = (key: keyof typeof form.values) => {
    const { props, error: fieldError } = form.field(key);
    return { ...props, error: fieldError ? t(fieldError) : undefined };
  };

  const save = () =>
    startTransition(async () => {
      const input = { ...form.values, type };
      const result = vehicle ? await updateVehicle(vehicle.pubkey, input) : await addVehicle(input);
      if (!result.ok) return setError(translateError(result.error, locale));
      const list = await fetchVehicles();
      if (!list.ok) return setError(translateError(list.error, locale));
      // A new car is the last one in the list; an edited one keeps its key.
      const saved = vehicle ? list.data.find((item) => item.pubkey === vehicle.pubkey) : list.data[list.data.length - 1];
      if (saved) onSaved(list.data, saved);
    });

  return (
    <form action={save}>
      <div className={styles.popGrid}>
        <SelectField
          label={t("type")}
          full
          value={type}
          onChange={(value) => setType(value as CarType)}
          options={CAR_TYPES.map((carType) => ({ value: carType, label: t(`type${carType}`) }))}
        />
        <Field label={t("make")} required autoComplete="off" {...field("make")} />
        <Field label={t("model")} required autoComplete="off" {...field("model")} />
        <Field label={t("year")} hint={tw("optional")} inputMode="numeric" {...field("year")} />
        <Field label={t("color")} hint={tw("optional")} {...field("color")} />
        <div className={styles.popFull}>
          <Field label={t("plate")} hint={tw("optional")} dir="ltr" {...field("plateNumber")} />
          <p className={styles.popHint}>{tw("plateHint")}</p>
        </div>
      </div>

      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}

      <SubmitButton className={`${formStyles.submit} ${styles.popSubmit}`} disabled={!form.isValid || pending}>
        {tw("saveCar")}
      </SubmitButton>
    </form>
  );
}

function RemoveCar({ vehicle, onRemoved, onCancel }: { vehicle: Vehicle; onRemoved: (vehicles: Vehicle[]) => void; onCancel: () => void }) {
  const ta = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const remove = () =>
    startTransition(async () => {
      const result = await deleteVehicle(vehicle.pubkey);
      if (!result.ok) return setError(translateError(result.error, locale));
      const list = await fetchVehicles();
      if (!list.ok) return setError(translateError(list.error, locale));
      onRemoved(list.data);
    });

  return (
    <>
      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}
      <div className={styles.popActions}>
        <Ghost onClick={onCancel} disabled={pending}>
          {ta("cancel")}
        </Ghost>
        <button type="button" className={styles.popDanger} onClick={remove} disabled={pending}>
          {ta("remove")}
        </button>
      </div>
    </>
  );
}

type Editing = null | "new" | Vehicle;

export default function CarStep({
  vehicles,
  selected,
  onSelect,
  onVehiclesChange,
  onNext,
}: {
  vehicles: Vehicle[];
  selected: Vehicle | null;
  onSelect: (vehicle: Vehicle | null) => void;
  onVehiclesChange: (vehicles: Vehicle[]) => void;
  onNext: () => void;
}) {
  const t = useScopedI18n("wash");
  const tb = useScopedI18n("book");
  const ta = useScopedI18n("account");
  const [editing, setEditing] = useState<Editing>(vehicles.length === 0 ? "new" : null);
  const [removing, setRemoving] = useState<Vehicle | null>(null);
  const view = useTableView(vehicles, SORT_VALUE, PAGE_SIZE);

  const typeName = (type: string) => (CAR_TYPES.includes(type as CarType) ? tb(`type${type as CarType}`) : type);

  const onSaved = (list: Vehicle[], saved: Vehicle) => {
    onVehiclesChange(list);
    onSelect(saved);
    setEditing(null);
  };

  const onRemoved = (list: Vehicle[]) => {
    onVehiclesChange(list);
    // Removing the chosen car falls back to the most recent one left.
    if (selected?.pubkey === removing?.pubkey) onSelect(list[list.length - 1] ?? null);
    setRemoving(null);
  };

  const addButton = (
    <button type="button" className={table.addBtn} onClick={() => setEditing("new")}>
      <IconPlus size={16} stroke={2} aria-hidden />
      {t("addCar")}
    </button>
  );

  return (
    <div className={styles.stack}>
      <StepHeading step={1} title={t("carStepTitle")} subtitle={t("carStepSubtitle")} />

      {vehicles.length === 0 ? (
        <div className={styles.carEmpty}>
          <b>{ta("noCars")}</b>
          <p>{ta("noCarsHint")}</p>
          {addButton}
        </div>
      ) : (
        <div>
          <div className={styles.carBar}>
            <span className={styles.listCount}>{t("savedCars", { count: vehicles.length })}</span>
            {addButton}
          </div>

          <table className={`${table.table} ${table.clickable} ${table.roomy}`}>
            <thead>
              <tr>
                <SortHeader column="car" label={ta("car")} sort={view.sort} onSort={view.toggleSort} />
                <SortHeader column="type" label={tb("type")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
                <SortHeader column="color" label={tb("color")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
                <SortHeader column="year" label={tb("year")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
                <SortHeader column="plate" label={tb("plate")} sort={view.sort} onSort={view.toggleSort} className={table.hideSm} />
                <th className={table.actions}>
                  <span className={styles.srOnly}>{ta("colActions")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {view.shown.map((vehicle) => {
                const on = selected?.pubkey === vehicle.pubkey;
                const name = carName(vehicle);
                return (
                  <tr key={vehicle.pubkey} className={on ? table.selected : undefined} onClick={() => onSelect(vehicle)}>
                    <td className={table.grow}>
                      <span className={table.cell}>
                        {/* The row highlight shows the choice; this hidden radio keeps it reachable by keyboard and screen readers. */}
                        <input type="radio" name="car" className={styles.srOnly} checked={on} onChange={() => onSelect(vehicle)} aria-label={name} />
                        <VehicleMark type={vehicle.type} />
                        <span className={table.cellText}>
                          <b dir="auto" className={table.cellName}>
                            {name}
                          </b>
                          <span className={table.cellMeta} dir="auto">
                            {[typeName(vehicle.type), vehicle.color, vehicle.year, vehicle.plateNumber].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className={table.hideMd}>{typeName(vehicle.type)}</td>
                    <td className={table.hideMd} dir="auto">
                      <CarColor color={vehicle.color} />
                    </td>
                    <td className={table.hideMd}>{vehicle.year || <span className={table.none}>–</span>}</td>
                    <td className={table.hideSm}>
                      <Plate number={vehicle.plateNumber} />
                    </td>
                    <td className={table.actions}>
                      <span>
                        <RowMenu
                          label={`${t("moreActions")}: ${name}`}
                          items={[
                            { label: ta("edit"), onSelect: () => setEditing(vehicle) },
                            { label: ta("remove"), onSelect: () => setRemoving(vehicle), danger: true },
                          ]}
                        />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Pager page={view.page} pages={view.pages} onPage={view.setPage} label={t("carStepTitle")} previous={t("back")} next={t("continue")} />
        </div>
      )}

      <StepFooter
        label={t("washing")}
        hint={t("pickCar")}
        value={
          selected && (
            <>
              {carName(selected)}
              {selected.plateNumber && <bdi dir="ltr"> · {selected.plateNumber}</bdi>}
            </>
          )
        }
      >
        <Cta disabled={!selected} onClick={onNext}>
          {t("continue")}
        </Cta>
      </StepFooter>

      <Popup
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing && editing !== "new" ? ta("editCar") : t("addNewCar")}
        subtitle={t("addNewCarSubtitle")}
      >
        {editing !== null && (
          <CarForm key={editing === "new" ? "new" : editing.pubkey} vehicle={editing === "new" ? undefined : editing} onSaved={onSaved} />
        )}
      </Popup>

      <Popup
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={ta("removeTitle")}
        subtitle={removing ? ta("removeConfirm", { car: carName(removing) }) : undefined}
      >
        {removing && <RemoveCar vehicle={removing} onRemoved={onRemoved} onCancel={() => setRemoving(null)} />}
      </Popup>
    </div>
  );
}
