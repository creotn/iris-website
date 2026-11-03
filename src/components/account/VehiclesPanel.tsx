"use client";

import { useState, useTransition } from "react";
import {
  IconCalendar,
  IconCar,
  IconHash,
  IconPalette,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { addVehicle, deleteVehicle, updateVehicle, type Vehicle } from "@/api/BookingAPI";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { CarsSkeleton } from "./AccountSkeletons";
import { numberInRange, optional, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { CarColor, Pager, Plate, SortHeader, VehicleMark } from "@/components/table/TableParts";
import table from "@/components/table/DataTable.module.css";
import { useTableView } from "@/components/table/useTableView";
import { translateError } from "@/utils/error";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import styles from "./Account.module.css";

const CAR_TYPES = ["SEDAN", "SUV", "TRUCK", "MOTORCYCLE"] as const;
type CarType = (typeof CAR_TYPES)[number];
const noRule = () => null;

const carName = (vehicle: Vehicle) => `${vehicle.make} ${vehicle.model}`;

type Editing = null | "new" | Vehicle;

const PAGE_SIZE = 8;

type SortKey = "car" | "type" | "color" | "year" | "plate";
const SORT_VALUE: Record<SortKey, (vehicle: Vehicle) => string | number> = {
  car: (vehicle) => carName(vehicle).toLowerCase(),
  type: (vehicle) => CAR_TYPES.indexOf(vehicle.type as CarType),
  color: (vehicle) => (vehicle.color ?? "").toLowerCase(),
  year: (vehicle) => Number(vehicle.year) || 0,
  plate: (vehicle) => vehicle.plateNumber ?? "",
};

export default function VehiclesPanel({
  title,
  vehicles,
  error,
  reload,
}: {
  title: string;
  vehicles: Vehicle[] | null;
  error: string;
  reload: () => void;
}) {
  const t = useScopedI18n("account");
  const tb = useScopedI18n("book");
  const [editing, setEditing] = useState<Editing>(null);
  const [removing, setRemoving] = useState<Vehicle | null>(null);
  const view = useTableView(vehicles ?? [], SORT_VALUE, PAGE_SIZE);

  const closeAndReload = () => {
    setEditing(null);
    setRemoving(null);
    reload();
  };

  const typeName = (type: string) => (CAR_TYPES.includes(type as CarType) ? tb(`type${type as CarType}`) : type);

  const head = (
    <div className={styles.mainHead}>
      <h1 className={styles.mainTitle}>{title}</h1>
      {vehicles && vehicles.length > 0 && (
        <button type="button" className={table.addBtn} onClick={() => setEditing("new")}>
          <IconPlus size={16} stroke={2} aria-hidden />
          {t("addCar")}
        </button>
      )}
    </div>
  );

  if (!vehicles) {
    return (
      <>
        {head}
        {error ? <ErrorRow message={error} onRetry={reload} /> : <CarsSkeleton />}
      </>
    );
  }

  return (
    <>
      {head}
      {error && <ErrorRow message={error} onRetry={reload} />}

      {vehicles.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <IconCar size={26} stroke={1.75} aria-hidden />
          </span>
          <b>{t("noCars")}</b>
          <p>{t("noCarsHint")}</p>
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => setEditing("new")}>
            <IconPlus size={18} stroke={2} aria-hidden />
            {t("addCar")}
          </button>
        </div>
      ) : (
        <>
          <table className={`${table.table} ${table.clickable}`}>
            <thead>
              <tr>
                <SortHeader column="car" label={t("car")} sort={view.sort} onSort={view.toggleSort} />
                <SortHeader column="type" label={tb("type")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
                <SortHeader column="color" label={tb("color")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
                <SortHeader column="year" label={tb("year")} sort={view.sort} onSort={view.toggleSort} className={table.hideMd} />
                <SortHeader column="plate" label={tb("plate")} sort={view.sort} onSort={view.toggleSort} className={table.hideSm} />
                <th scope="col" className={table.actions}>
                  <span className={styles.srOnly}>{t("colActions")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {view.shown.map((vehicle) => (
                <tr key={vehicle.pubkey} onClick={() => setEditing(vehicle)}>
                  <td className={table.grow}>
                    <span className={table.cell}>
                      <VehicleMark type={vehicle.type} />
                      <span className={table.cellText}>
                        <b dir="auto">{carName(vehicle)}</b>
                        <span className={table.cellMeta} dir="auto">
                          {[typeName(vehicle.type), vehicle.color, vehicle.year, vehicle.plateNumber].filter(Boolean).join(", ")}
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
                  <td className={table.actions} onClick={(event) => event.stopPropagation()}>
                    <span>
                      <button type="button" className={table.iconBtn} onClick={() => setEditing(vehicle)} aria-label={`${t("edit")} ${carName(vehicle)}`}>
                        <IconPencil size={17} stroke={1.75} aria-hidden />
                      </button>
                      <button
                        type="button"
                        className={`${table.iconBtn} ${table.iconBtnDanger}`}
                        onClick={() => setRemoving(vehicle)}
                        aria-label={`${t("remove")} ${carName(vehicle)}`}
                      >
                        <IconTrash size={17} stroke={1.75} aria-hidden />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pager page={view.page} pages={view.pages} onPage={view.setPage} label={title} previous={t("previousPage")} next={t("nextPage")} />
        </>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} title={editing && editing !== "new" ? t("editCar") : t("addCar")}>
        <VehicleForm vehicle={editing && editing !== "new" ? editing : undefined} onSaved={closeAndReload} onCancel={() => setEditing(null)} />
      </Dialog>

      <Dialog
        open={removing !== null}
        onClose={() => setRemoving(null)}
        title={t("removeTitle")}
        description={removing ? t("removeConfirm", { car: carName(removing) }) : undefined}
      >
        {removing && <RemoveVehicle vehicle={removing} onRemoved={closeAndReload} onCancel={() => setRemoving(null)} />}
      </Dialog>
    </>
  );
}

function RemoveVehicle({ vehicle, onRemoved, onCancel }: { vehicle: Vehicle; onRemoved: () => void; onCancel: () => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const remove = () =>
    startTransition(async () => {
      const result = await deleteVehicle(vehicle.pubkey);
      if (result.ok) onRemoved();
      else setError(translateError(result.error, locale));
    });

  return (
    <>
      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}
      <div className={styles.dialogActions}>
        <button type="button" className={styles.button} onClick={onCancel} disabled={pending}>
          {t("cancel")}
        </button>
        <button type="button" className={`${styles.button} ${styles.dangerSolid}`} onClick={remove} disabled={pending}>
          <IconTrash size={16} stroke={1.75} aria-hidden />
          {t("remove")}
        </button>
      </div>
    </>
  );
}

function VehicleForm({ vehicle, onSaved, onCancel }: { vehicle?: Vehicle; onSaved: () => void; onCancel: () => void }) {
  const t = useScopedI18n("account");
  const tb = useScopedI18n("book");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [type, setType] = useState<CarType>(
    vehicle && CAR_TYPES.includes(vehicle.type as CarType) ? (vehicle.type as CarType) : "SEDAN",
  );

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
    return { ...props, error: fieldError ? tb(fieldError) : undefined };
  };

  const save = () =>
    startTransition(async () => {
      const input = { ...form.values, type };
      const result = vehicle ? await updateVehicle(vehicle.pubkey, input) : await addVehicle(input);
      if (result.ok) onSaved();
      else setError(translateError(result.error, locale));
    });

  return (
    <form className={formStyles.fields} action={save}>
      <div className={formStyles.row}>
        <AuthField label={tb("make")} icon={<IconCar size={18} stroke={1.75} />} dir="auto" autoFocus {...field("make")} />
        <AuthField label={tb("model")} icon={<IconCar size={18} stroke={1.75} />} dir="auto" {...field("model")} />
      </div>
      <div className={formStyles.row}>
        <AuthField label={tb("year")} icon={<IconCalendar size={18} stroke={1.75} />} inputMode="numeric" required={false} {...field("year")} />
        <AuthField label={tb("color")} icon={<IconPalette size={18} stroke={1.75} />} dir="auto" required={false} {...field("color")} />
      </div>
      <div className={formStyles.row}>
        <AuthField label={tb("plate")} icon={<IconHash size={18} stroke={1.75} />} required={false} {...field("plateNumber")} />
        <label className={formStyles.field}>
          <span className={formStyles.label}>{tb("type")}</span>
          <select className={styles.select} value={type} onChange={(event) => setType(event.target.value as CarType)}>
            {CAR_TYPES.map((carType) => (
              <option key={carType} value={carType}>
                {tb(`type${carType}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}

      <div className={styles.dialogActions}>
        <button type="button" className={styles.button} onClick={onCancel} disabled={pending}>
          {t("cancel")}
        </button>
        <button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!form.isValid || pending}>
          {t("save")}
        </button>
      </div>
    </form>
  );
}
