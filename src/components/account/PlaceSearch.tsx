"use client";

import { useRef, useState } from "react";
import { IconLoader2, IconMapPin, IconSearch } from "@tabler/icons-react";
import { searchPlaces, type Place } from "@/api/GeoAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import styles from "./Account.module.css";

/**
 * Search by name, run on Enter or the button. Not a <form>: it also sits inside the address form,
 * and forms can't nest, so Enter is caught here instead of submitting the address.
 */
export default function PlaceSearch({ onPick }: { onPick: (place: Place) => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef<AbortController | null>(null);

  const search = async () => {
    if (!query.trim() || searching) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    setSearching(true);
    setFailed(false);
    const found = await searchPlaces(query, locale, controller.signal);
    if (controller.signal.aborted) return;
    setSearching(false);
    setFailed(found === null);
    setResults(found ?? []);
  };

  const choose = (place: Place) => {
    setResults(null);
    setQuery(place.name);
    onPick(place);
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchRow}>
        <span className={styles.searchField}>
          <IconSearch size={18} stroke={1.75} aria-hidden />
          <input
            type="search"
            dir="auto"
            value={query}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            onChange={(event) => {
              setQuery(event.target.value);
              setResults(null);
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              search();
            }}
          />
        </span>
        <button type="button" className={`${styles.button} ${styles.primary}`} onClick={search} disabled={!query.trim() || searching}>
          {searching ? <IconLoader2 className={styles.spin} size={18} stroke={2} aria-hidden /> : t("search")}
        </button>
      </div>

      {results && (
        <div className={styles.results} role="status">
          {results.length === 0 ? (
            <p className={styles.muted}>{failed ? t("searchFailed") : t("noResults")}</p>
          ) : (
            <ul>
              {results.map((place) => (
                <li key={`${place.latitude},${place.longitude}`}>
                  <button type="button" className={styles.result} onClick={() => choose(place)}>
                    <IconMapPin size={18} stroke={1.75} aria-hidden />
                    <span>
                      <b dir="auto">{place.name}</b>
                      <small dir="auto">{place.detail}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
