"use client";

import { useState, useTransition } from "react";
import {
  IconCalendar,
  IconCar,
  IconHash,
  IconMotorbike,
  IconPalette,
  IconPencil,
  IconPlus,
  IconTrash,
  IconTruck,
} from "@tabler/icons-react";
import { addVehicle, deleteVehicle, updateVehicle, type Vehicle } from "@/api/BookingAPI";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { numberInRange, optional, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import { stagger } from "./order";
import styles from "./Account.module.css";

const CAR_TYPES = ["SEDAN", "SUV", "TRUCK", "MOTORCYCLE"] as const;
type CarType = (typeof CAR_TYPES)[number];
const noRule = () => null;

const carName = (vehicle: Vehicle) => `${vehicle.make} ${vehicle.model}`;

type Editing = null | "new" | Vehicle;

export default function VehiclesPanel({
  vehicles,
  error,
  reload,
}: {
  vehicles: Vehicle[] | null;
  error: string;
  reload: () => void;
}) {
  const t = useScopedI18n("account");
  const [editing, setEditing] = useState<Editing>(null);
  const [removing, setRemoving] = useState<Vehicle | null>(null);

  const closeAndReload = () => {
    setEditing(null);
    setRemoving(null);
    reload();
  };

  if (!vehicles) {
    if (error) return <ErrorRow message={error} onRetry={reload} />;
    return (
      <div className={styles.carGrid} aria-busy="true">
        <Skeleton height="190px" radius="lg" />
        <Skeleton height="190px" radius="lg" />
      </div>
    );
  }

  return (
    <>
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
        <div className={styles.carGrid}>
          {vehicles.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.pubkey}
              vehicle={vehicle}
              index={index}
              onEdit={() => setEditing(vehicle)}
              onRemove={() => setRemoving(vehicle)}
            />
          ))}
          <button
            type="button"
            className={`${styles.addCard} ${styles.reveal}`}
            style={stagger(vehicles.length)}
            onClick={() => setEditing("new")}
          >
            <span className={styles.emptyIcon}>
              <IconPlus size={24} stroke={2} aria-hidden />
            </span>
            {t("addCar")}
          </button>
        </div>
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

function CarIcon({ type }: { type: string }) {
  if (type === "MOTORCYCLE") return <IconMotorbike size={22} stroke={1.75} />;
  if (type === "TRUCK") return <IconTruck size={22} stroke={1.75} />;
  return <IconCar size={22} stroke={1.75} />;
}

function VehicleCard({ vehicle, index, onEdit, onRemove }: { vehicle: Vehicle; index: number; onEdit: () => void; onRemove: () => void }) {
  const t = useScopedI18n("account");
  const tb = useScopedI18n("book");
  const type = CAR_TYPES.includes(vehicle.type as CarType) ? tb(`type${vehicle.type as CarType}`) : vehicle.type;
  const details = [vehicle.year, vehicle.color, type].filter(Boolean).join(" · ");

  return (
    <div className={`${styles.card} ${styles.carCard} ${styles.reveal}`} style={stagger(index)}>
      <div className={styles.carHead}>
        <span className={styles.tileIcon} aria-hidden>
          <CarIcon type={vehicle.type} />
        </span>
        <span className={styles.carName}>
          <b dir="auto" className={styles.ellipsis}>
            {carName(vehicle)}
          </b>
          <span className={styles.muted} dir="auto">
            {details}
          </span>
        </span>
      </div>
      {vehicle.plateNumber && (
        <span className={styles.plate} dir="ltr" aria-label={tb("plate")}>
          {vehicle.plateNumber}
        </span>
      )}
      <div className={styles.carActions}>
        <button type="button" className={styles.button} onClick={onEdit}>
          <IconPencil size={16} stroke={1.75} aria-hidden />
          {t("edit")}
        </button>
        <button type="button" className={`${styles.button} ${styles.danger}`} onClick={onRemove}>
          <IconTrash size={16} stroke={1.75} aria-hidden />
          {t("remove")}
        </button>
      </div>
    </div>
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
