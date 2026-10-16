"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBolt } from "@tabler/icons-react";
import { fetchSlots, type SlotInfo, type VisitDetails } from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { dateKey, slotLabel, type Draft } from "./draft";
import { Banner, Cta, Heading } from "./ui";
import styles from "./Wash.module.css";

const DAYS_AHEAD = 7;
const SCENTS: VisitDetails["scent"][] = ["NONE", "LIGHT", "MEDIUM"];
const ACCESS: VisitDetails["vehicleAccess"][] = ["OPEN", "OWNER", "GUARD"];

type SlotsResult = { key: string; slots: SlotInfo[] | null };

export default function WhenStep({
  draft,
  setDraft,
  areaPubkey,
  onNext,
}: {
  draft: Draft;
  setDraft: (update: (draft: Draft) => Draft) => void;
  areaPubkey: string;
  onNext: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: DAYS_AHEAD }, (_, index) => {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + index);
      return { key: dateKey(day), day };
    });
  }, []);
  const date = draft.date || days[0].key;

  const slotsKey = draft.when === "later" ? `${areaPubkey}|${date}` : "";
  const [result, setResult] = useState<SlotsResult | null>(null);

  useEffect(() => {
    if (!slotsKey) return;
    let active = true;
    fetchSlots(areaPubkey, date).then((response) => {
      if (active) setResult({ key: slotsKey, slots: response.ok ? response.data : null });
    });
    return () => {
      active = false;
    };
  }, [slotsKey, areaPubkey, date]);

  const current = result?.key === slotsKey ? result : null;
  const loadingSlots = draft.when === "later" && !current;
  const ready = draft.when === "now" || draft.slot !== null;

  const label = (value: Date) =>
    value.toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className={styles.stack}>
      <Heading title={t("whenTitle")} subtitle={t("whenSubtitle")} />

      <div className={styles.tabs} role="tablist">
        {(["now", "later"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={draft.when === mode}
            className={`${styles.tab} ${draft.when === mode ? styles.tabOn : ""}`}
            onClick={() => setDraft((c) => ({ ...c, when: mode, slot: null }))}
          >
            {t(mode === "now" ? "washNow" : "schedule")}
          </button>
        ))}
      </div>

      {draft.when === "now" ? (
        <Banner icon={<IconBolt size={18} stroke={1.75} aria-hidden />}>{t("nowNote")}</Banner>
      ) : (
        <>
          <div className={styles.chips} role="group" aria-label={t("pickDay")}>
            {days.map(({ key, day }) => (
              <button
                key={key}
                type="button"
                className={`${styles.chip} ${date === key ? styles.chipOn : ""}`}
                onClick={() => setDraft((c) => ({ ...c, date: key, slot: null }))}
              >
                {label(day)}
              </button>
            ))}
          </div>

          <div className={styles.group}>
            <span className={styles.groupLabel}>{t("pickTime")}</span>
            {loadingSlots && <span className={styles.hint}>{t("loadingSlots")}</span>}
            {current && current.slots === null && <Banner tone="warn">{t("slotsFailed")}</Banner>}
            {current?.slots && (
              <div className={styles.slots}>
                {current.slots.map((slot) => (
                  <button
                    key={slot.timeSlot}
                    type="button"
                    disabled={!slot.available}
                    className={`${styles.chip} ${draft.slot === slot.timeSlot ? styles.chipOn : ""}`}
                    onClick={() => setDraft((c) => ({ ...c, date, slot: slot.timeSlot }))}
                  >
                    <bdi dir="ltr">{slotLabel(slot.timeSlot)}</bdi>
                  </button>
                ))}
              </div>
            )}
            {current?.slots && <span className={styles.hint}>{t("slotsFullHint")}</span>}
          </div>
        </>
      )}

      <div className={styles.group}>
        <span className={styles.groupLabel}>{t("scent")}</span>
        <div className={styles.chips}>
          {SCENTS.map((scent) => (
            <button
              key={scent}
              type="button"
              className={`${styles.chip} ${draft.visit.scent === scent ? styles.chipOn : ""}`}
              onClick={() => setDraft((c) => ({ ...c, visit: { ...c.visit, scent } }))}
            >
              {t(`scent_${scent}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>{t("access")}</span>
        <div className={styles.chips}>
          {ACCESS.map((access) => (
            <button
              key={access}
              type="button"
              className={`${styles.chip} ${draft.visit.vehicleAccess === access ? styles.chipOn : ""}`}
              onClick={() => setDraft((c) => ({ ...c, visit: { ...c.visit, vehicleAccess: access } }))}
            >
              {t(`access_${access}`)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.switchRow}>
        <span id="dnd-label">{t("doNotDisturb")}</span>
        <button
          type="button"
          role="switch"
          aria-checked={draft.visit.doNotDisturb}
          aria-labelledby="dnd-label"
          className={`${styles.switch} ${draft.visit.doNotDisturb ? styles.switchOn : ""}`}
          onClick={() => setDraft((c) => ({ ...c, visit: { ...c.visit, doNotDisturb: !c.visit.doNotDisturb } }))}
        />
      </div>

      <label className={styles.group}>
        <span className={styles.groupLabel}>
          {t("notes")} <span className={styles.hint}>({t("optional")})</span>
        </span>
        <textarea
          className={styles.plain}
          rows={2}
          maxLength={500}
          value={draft.notes}
          onChange={(event) => setDraft((c) => ({ ...c, notes: event.target.value }))}
          placeholder={t("notesPlaceholder")}
        />
      </label>

      <Cta disabled={!ready} onClick={onNext}>
        {ready ? t("reviewBooking") : t("pickTimeToContinue")}
      </Cta>
    </div>
  );
}
