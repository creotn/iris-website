"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  IconCircleCheck,
  IconCurrentLocation,
  IconExternalLink,
  IconMapPin,
  IconMapPinOff,
  IconPencil,
} from "@tabler/icons-react";
import { saveAddress, type SavedAddress } from "@/api/BookingAPI";
import type { Place } from "@/api/GeoAPI";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { numberInRange, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import LocationMap, { type Point } from "./LocationMap";
import PlaceSearch from "./PlaceSearch";
import { usePlaceName } from "./usePlaceName";
import styles from "./Account.module.css";

type Stored = NonNullable<SavedAddress["address"]>;

const mapsLink = ({ latitude, longitude }: Point) => `https://www.google.com/maps?q=${latitude},${longitude}`;
const storedPoint = (address: Stored | null): Point | null =>
  address?.latitude != null && address.longitude != null ? { latitude: address.latitude, longitude: address.longitude } : null;

export default function AddressPanel({
  saved,
  error,
  reload,
}: {
  saved: SavedAddress | null;
  error: string;
  reload: () => void;
}) {
  const t = useScopedI18n("account");
  const [editing, setEditing] = useState(false);

  if (!saved) {
    if (error) return <ErrorRow message={error} onRetry={reload} />;
    return <Skeleton height="360px" radius="lg" />;
  }

  const { address } = saved;

  return (
    <>
      {error && <ErrorRow message={error} onRetry={reload} />}

      {address ? (
        <AddressCard saved={saved} address={address} onEdit={() => setEditing(true)} onSaved={reload} />
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <IconMapPin size={26} stroke={1.75} aria-hidden />
          </span>
          <b>{t("noAddress")}</b>
          <p>{t("noAddressHint")}</p>
          <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => setEditing(true)}>
            {t("addAddress")}
          </button>
        </div>
      )}

      <Dialog
        open={editing}
        onClose={() => setEditing(false)}
        title={address ? t("changeAddress") : t("addAddress")}
        description={t("addressNote")}
      >
        <AddressForm
          address={address}
          onSaved={() => {
            setEditing(false);
            reload();
          }}
          onCancel={() => setEditing(false)}
        />
      </Dialog>
    </>
  );
}

/** The saved address on a live map: search or tap to move the pin, then confirm before it's saved. */
function AddressCard({ saved, address, onEdit, onSaved }: { saved: SavedAddress; address: Stored; onEdit: () => void; onSaved: () => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const resolveName = usePlaceName();
  // `name` is undefined while it's being looked up, null when none was found.
  const [draft, setDraft] = useState<{ point: Point; name?: string | null } | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const current = storedPoint(address);

  const choose = (point: Point, name?: string) => {
    setError("");
    setDraft({ point, name });
    if (!name) resolveName(point, (found) => setDraft((prev) => (prev?.point === point ? { point, name: found } : prev)));
  };

  const save = () =>
    startTransition(async () => {
      if (!draft) return;
      const result = await saveAddress({
        address: draft.name ?? address.address,
        latitude: String(draft.point.latitude),
        longitude: String(draft.point.longitude),
      });
      if (!result.ok) return setError(translateError(result.error, locale));
      setDraft(null);
      onSaved();
    });

  return (
    <div className={`${styles.addressCard} ${styles.reveal}`}>
      <div className={styles.addressSearch}>
        <PlaceSearch onPick={(place: Place) => choose(place, place.name)} />
      </div>

      <div className={styles.mapWrap}>
        <LocationMap value={draft?.point ?? current} onPick={(point) => choose(point)} label={t("mapHint")} />
        {saved.area ? (
          <span className={`${styles.badge} ${styles.badge_success} ${styles.mapBadge}`}>
            <IconCircleCheck size={14} stroke={2} aria-hidden />
            {t("covered", { city: saved.area.city })}
          </span>
        ) : (
          <span className={`${styles.badge} ${styles.badge_warn} ${styles.mapBadge}`}>
            <IconMapPinOff size={14} stroke={2} aria-hidden />
            {t("notCovered")}
          </span>
        )}
      </div>

      {draft ? (
        <div className={styles.draftBar} role="status">
          <span className={styles.addressText}>
            <span className={styles.eyebrow}>{t("newSpot")}</span>
            <b dir="auto">{draft.name === undefined ? t("findingName") : (draft.name ?? address.address)}</b>
          </span>
          {error && (
            <p className="errorMessage" role="alert">
              {error}
            </p>
          )}
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={() => setDraft(null)} disabled={pending}>
              {t("cancel")}
            </button>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={save} disabled={pending}>
              <IconCircleCheck size={16} stroke={2} aria-hidden />
              {t("saveLocation")}
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.addressBody}>
          <div className={styles.addressRow}>
            <span className={styles.tileIcon} aria-hidden>
              <IconMapPin size={22} stroke={1.75} />
            </span>
            <div className={styles.addressText}>
              <b dir="auto">{address.address}</b>
              <span className={styles.muted}>{t("mapHint")}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={onEdit}>
              <IconPencil size={16} stroke={1.75} aria-hidden />
              {t("changeAddress")}
            </button>
            {current && (
              <a className={styles.button} href={mapsLink(current)} target="_blank" rel="noopener noreferrer">
                <IconExternalLink size={16} stroke={1.75} aria-hidden />
                {t("openInMaps")}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AddressForm({ address, onSaved, onCancel }: { address: Stored | null; onSaved: () => void; onCancel: () => void }) {
  const t = useScopedI18n("account");
  const tb = useScopedI18n("book");
  const locale = useCurrentLocale();
  const resolveName = usePlaceName();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [locating, setLocating] = useState(false);

  const form = useValidatedForm(
    {
      address: required,
      latitude: numberInRange(-90, 90, "errLatitude"),
      longitude: numberInRange(-180, 180, "errLongitude"),
    },
    address
      ? { address: address.address, latitude: address.latitude?.toString(), longitude: address.longitude?.toString() }
      : undefined,
  );

  const field = (key: keyof typeof form.values) => {
    const { props, error: fieldError } = form.field(key);
    return { ...props, error: fieldError ? tb(fieldError) : undefined };
  };

  const pinned =
    !numberInRange(-90, 90, "errLatitude")(form.values.latitude) &&
    !numberInRange(-180, 180, "errLongitude")(form.values.longitude);
  const point: Point | null = pinned ? { latitude: Number(form.values.latitude), longitude: Number(form.values.longitude) } : null;

  // A place name only fills the field while the customer hasn't written their own.
  const typed = useRef(form.values.address);
  const autoName = useRef<string | null>(null);
  useEffect(() => {
    typed.current = form.values.address;
  });

  const fillName = (name: string | null) => {
    if (!name || (typed.current.trim() && typed.current !== autoName.current)) return;
    autoName.current = name;
    form.setValue("address", name);
  };

  const pick = ({ latitude, longitude }: Point, name?: string) => {
    form.setValue("latitude", latitude.toFixed(6));
    form.setValue("longitude", longitude.toFixed(6));
    if (name) fillName(name);
    else resolveName({ latitude, longitude }, fillName);
  };

  const locate = () => {
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        pick({ latitude: coords.latitude, longitude: coords.longitude });
        setLocating(false);
      },
      () => {
        setNotice(tb("locationDenied"));
        setLocating(false);
      },
    );
  };

  // An uncovered address is still saved; the card then shows the coverage badge.
  const save = () =>
    startTransition(async () => {
      const result = await saveAddress(form.values);
      if (result.ok) onSaved();
      else setError(translateError(result.error, locale));
    });

  return (
    <form className={formStyles.fields} action={save}>
      <PlaceSearch onPick={(place) => pick(place, place.name)} />

      <div className={styles.pickMap}>
        <LocationMap value={point} onPick={(spot) => pick(spot)} label={t("mapHint")} wheelZoom />
      </div>
      <p className={`${styles.pinState} ${pinned ? styles.pinOk : ""}`} role="status">
        {pinned ? <IconCircleCheck size={16} stroke={2} aria-hidden /> : <IconMapPinOff size={16} stroke={2} aria-hidden />}
        {pinned ? t("locationSet") : t("mapHint")}
      </p>

      <button type="button" className={styles.button} onClick={locate} disabled={locating}>
        <IconCurrentLocation size={18} stroke={1.75} aria-hidden />
        {locating ? tb("locating") : tb("useLocation")}
      </button>

      {notice && (
        <p className={formStyles.notice} role="status">
          {notice}
        </p>
      )}

      <AuthField
        label={tb("address")}
        icon={<IconMapPin size={18} stroke={1.75} />}
        dir="auto"
        autoComplete="street-address"
        placeholder={t("addressPlaceholder")}
        {...field("address")}
      />

      <details className={styles.manual}>
        <summary>{t("manualCoords")}</summary>
        <div className={formStyles.row}>
          <AuthField label={tb("latitude")} icon={<IconMapPin size={18} stroke={1.75} />} inputMode="decimal" {...field("latitude")} />
          <AuthField label={tb("longitude")} icon={<IconMapPin size={18} stroke={1.75} />} inputMode="decimal" {...field("longitude")} />
        </div>
      </details>

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
