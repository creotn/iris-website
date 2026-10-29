"use client";

import { useEffect, useMemo, useState } from "react";
import { IconBellOff, IconBolt, IconCalendarEvent, IconCheck, IconClock } from "@tabler/icons-react";
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
  const dateLocale = locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US";

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

  const summary =
    draft.when === "now"
      ? t("asap")
      : draft.slot
        ? `${new Date(`${date}T12:00:00`).toLocaleDateString(dateLocale, { weekday: "short", day: "numeric", month: "short" })} · ${slotLabel(draft.slot)}`
        : t("pickTimeToContinue");

  const modes = [
    { id: "now" as const, icon: <IconBolt size={22} stroke={1.75} />, title: t("washNow"), detail: t("nowNote") },
    { id: "later" as const, icon: <IconCalendarEvent size={22} stroke={1.75} />, title: t("schedule"), detail: t("scheduleNote") },
  ];

  return (
    <div className={styles.stack}>
      <Heading title={t("whenTitle")} subtitle={t("whenSubtitle")} />

      <div className={styles.whenGrid}>
        <section className={styles.panel} aria-label={t("whenTitle")}>
          <div className={styles.modeGrid} role="radiogroup" aria-label={t("whenTitle")}>
            {modes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                role="radio"
                aria-checked={draft.when === mode.id}
                className={`${styles.mode} ${draft.when === mode.id ? styles.modeOn : ""}`}
                onClick={() => setDraft((c) => ({ ...c, when: mode.id, slot: null }))}
              >
                <span className={styles.modeIcon} aria-hidden>
                  {mode.icon}
                </span>
                <span className={styles.modeText}>
                  <b>{mode.title}</b>
                  <small>{mode.detail}</small>
                </span>
                <span className={`${styles.mark} ${draft.when === mode.id ? styles.markOn : ""}`} aria-hidden>
                  {draft.when === mode.id && <IconCheck size={14} stroke={3} />}
                </span>
              </button>
            ))}
          </div>

          {draft.when === "later" && (
            <>
              <div className={styles.group}>
                <span className={styles.groupLabel}>{t("pickDay")}</span>
                <div className={styles.dayRow} role="group" aria-label={t("pickDay")}>
                  {days.map(({ key, day }) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={date === key}
                      className={`${styles.day} ${date === key ? styles.dayOn : ""}`}
                      onClick={() => setDraft((c) => ({ ...c, date: key, slot: null }))}
                    >
                      <small>{day.toLocaleDateString(dateLocale, { weekday: "short" })}</small>
                      <b>{day.getDate()}</b>
                      <small>{day.toLocaleDateString(dateLocale, { month: "short" })}</small>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.group}>
                <span className={styles.groupLabel}>{t("pickTime")}</span>
                {loadingSlots && <span className={styles.hint}>{t("loadingSlots")}</span>}
                {current && current.slots === null && <Banner tone="warn">{t("slotsFailed")}</Banner>}
                {current?.slots && (
                  <div className={styles.slotGrid}>
                    {current.slots.map((slot) => (
                      <button
                        key={slot.timeSlot}
                        type="button"
                        disabled={!slot.available}
                        aria-pressed={draft.slot === slot.timeSlot}
                        className={`${styles.slot} ${draft.slot === slot.timeSlot ? styles.slotOn : ""}`}
                        onClick={() => setDraft((c) => ({ ...c, date, slot: slot.timeSlot }))}
                      >
                        <IconClock size={16} stroke={1.75} aria-hidden />
                        <bdi dir="ltr">{slotLabel(slot.timeSlot)}</bdi>
                      </button>
                    ))}
                  </div>
                )}
                {current?.slots && <span className={styles.hint}>{t("slotsFullHint")}</span>}
              </div>
            </>
          )}
        </section>

        <section className={styles.panel} aria-label={t("detailsTitle")}>
          <h2 className={styles.panelTitle}>{t("detailsTitle")}</h2>

          <div className={styles.group}>
            <span className={styles.groupLabel}>{t("scent")}</span>
            <div className={styles.segmented} role="radiogroup" aria-label={t("scent")}>
              {SCENTS.map((scent) => (
                <button
                  key={scent}
                  type="button"
                  role="radio"
                  aria-checked={draft.visit.scent === scent}
                  className={`${styles.seg} ${draft.visit.scent === scent ? styles.segOn : ""}`}
                  onClick={() => setDraft((c) => ({ ...c, visit: { ...c.visit, scent } }))}
                >
                  {t(`scent_${scent}`)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <span className={styles.groupLabel}>{t("access")}</span>
            <div className={styles.segmented} role="radiogroup" aria-label={t("access")}>
              {ACCESS.map((access) => (
                <button
                  key={access}
                  type="button"
                  role="radio"
                  aria-checked={draft.visit.vehicleAccess === access}
                  className={`${styles.seg} ${draft.visit.vehicleAccess === access ? styles.segOn : ""}`}
                  onClick={() => setDraft((c) => ({ ...c, visit: { ...c.visit, vehicleAccess: access } }))}
                >
                  {t(`access_${access}`)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.toggleCard}>
            <span className={styles.toggleIcon} aria-hidden>
              <IconBellOff size={20} stroke={1.75} />
            </span>
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
              rows={3}
              maxLength={500}
              value={draft.notes}
              onChange={(event) => setDraft((c) => ({ ...c, notes: event.target.value }))}
              placeholder={t("notesPlaceholder")}
            />
          </label>
        </section>
      </div>

      <div className={styles.checkoutBar}>
        <div className={styles.checkoutInfo}>
          <small>{t("stepWhen")}</small>
          <span className={styles.checkoutValue} aria-live="polite">
            {summary}
          </span>
        </div>
        <div className={styles.checkoutActions}>
          <Cta disabled={!ready} onClick={onNext}>
            {ready ? t("reviewBooking") : t("pickTimeToContinue")}
          </Cta>
        </div>
      </div>
    </div>
  );
}
