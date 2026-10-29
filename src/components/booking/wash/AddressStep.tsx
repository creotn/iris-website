"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown, IconCircleCheck, IconCurrentLocation, IconHome, IconLoader2, IconMapPinOff } from "@tabler/icons-react";
import { fetchAddress, saveAddress, type SavedAddress } from "@/api/BookingAPI";
import accountStyles from "@/components/account/Account.module.css";
import LocationMap, { type Point } from "@/components/account/LocationMap";
import PlaceSearch from "@/components/account/PlaceSearch";
import { usePlaceName } from "@/components/account/usePlaceName";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { Cta, Heading } from "./ui";
import styles from "./Wash.module.css";

export type Place = { address: NonNullable<SavedAddress["address"]>; area: NonNullable<SavedAddress["area"]> };
export type SavedPlace = { address: NonNullable<SavedAddress["address"]>; area: SavedAddress["area"] };

const coordsLabel = ({ latitude, longitude }: Point) => `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

export default function AddressStep({
  saved,
  onChoose,
  onNext,
}: {
  saved: SavedPlace | null;
  onChoose: (place: Place) => void;
  onNext: () => void;
}) {
  const t = useScopedI18n("wash");
  const tb = useScopedI18n("book");
  const ta = useScopedI18n("account");
  const locale = useCurrentLocale();
  const resolveName = usePlaceName();

  const [point, setPoint] = useState<Point | null>(null);
  const [address, setAddress] = useState("");
  const [fromSaved, setFromSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const lookup = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: Event) => {
      if (event.type === "keydown" && (event as KeyboardEvent).key !== "Escape") return;
      if (event.type === "mousedown" && menuRef.current?.contains(event.target as Node)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  const pick = (spot: Point, name?: string) => {
    setFromSaved(false);
    setPoint(spot);
    setAddress(name ?? coordsLabel(spot));
    setError("");
    setNotice("");
    if (name) return;
    const id = ++lookup.current;
    resolveName(spot, (found) => {
      if (found && id === lookup.current) setAddress(found);
    });
  };

  const chooseSaved = (value: string) => {
    if (!saved || value !== saved.address.pubkey) return;
    const { latitude, longitude } = saved.address;
    lookup.current += 1;
    setPoint(latitude != null && longitude != null ? { latitude, longitude } : null);
    setAddress(saved.address.address);
    setFromSaved(true);
    setMenuOpen(false);
    setError("");
    setNotice("");
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

  const next = async () => {
    if (fromSaved && saved) {
      if (!saved.area) return setNotice(tb("notCovered"));
      onChoose({ address: saved.address, area: saved.area });
      return onNext();
    }
    if (!point) return;
    setBusy(true);
    setError("");
    const result = await saveAddress({ address, latitude: point.latitude.toFixed(6), longitude: point.longitude.toFixed(6) });
    if (!result.ok) {
      setBusy(false);
      return setError(translateError(result.error, locale));
    }
    const fresh = await fetchAddress();
    setBusy(false);
    if (!fresh.ok) return setError(translateError(fresh.error, locale));
    if (!fresh.data.address || !fresh.data.area) return setNotice(tb("notCovered"));
    onChoose({ address: fresh.data.address, area: fresh.data.area });
    onNext();
  };

  return (
    <div className={styles.stack}>
      <Heading title={t("addressStepTitle")} subtitle={t("addressStepSubtitle")} />

      <div className={styles.locToolbar}>
        {saved && (
          <div className={styles.savedMenu} ref={menuRef}>
            <button
              type="button"
              className={`${styles.savedTrigger} ${fromSaved ? styles.savedTriggerOn : ""}`}
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <IconHome size={18} stroke={1.75} aria-hidden />
              <span>{t("savedAddress")}</span>
              <IconChevronDown className={styles.savedChevron} size={16} stroke={2} aria-hidden />
            </button>
            {menuOpen && (
              <ul className={styles.savedPop} role="listbox" aria-label={t("savedAddress")}>
                <li>
                  <button
                    type="button"
                    role="option"
                    aria-selected={fromSaved}
                    className={styles.savedItem}
                    onClick={() => chooseSaved(saved.address.pubkey)}
                  >
                    <span className={styles.savedItemIcon} aria-hidden>
                      <IconHome size={18} stroke={1.75} />
                    </span>
                    <span className={styles.savedItemText}>
                      <b dir="auto">{saved.address.address}</b>
                      <small>{saved.area?.city ?? tb("notCovered")}</small>
                    </span>
                    {fromSaved && <IconCheck className={styles.savedCheck} size={18} stroke={2.5} aria-hidden />}
                  </button>
                </li>
              </ul>
            )}
          </div>
        )}

        <div className={styles.locSearch}>
          <PlaceSearch onPick={(place) => pick(place, place.name)} />
        </div>

        <button type="button" className={styles.iconBtn} onClick={locate} disabled={locating} aria-label={tb("useLocation")} data-tip={tb("useLocation")}>
          {locating ? <IconLoader2 className={accountStyles.spin} size={20} stroke={2} aria-hidden /> : <IconCurrentLocation size={20} stroke={1.75} aria-hidden />}
        </button>
      </div>

      <div className={styles.mapBox}>
        <LocationMap value={point} onPick={(spot) => pick(spot)} label={ta("mapHint")} wheelZoom />
      </div>

      {notice && (
        <p className={styles.noticeLine} role="status">
          {notice}
        </p>
      )}
      <p className="errorMessage" role="alert">
        {error}
      </p>

      <div className={styles.carFooter}>
        <p className={`${accountStyles.pinState} ${point ? accountStyles.pinOk : ""}`} role="status">
          {point ? <IconCircleCheck size={16} stroke={2} aria-hidden /> : <IconMapPinOff size={16} stroke={2} aria-hidden />}
          <span dir="auto">{point ? address : ta("mapHint")}</span>
        </p>
        <Cta disabled={!point || busy} onClick={next}>
          {busy ? t("saving") : t("continue")}
        </Cta>
      </div>
    </div>
  );
}
