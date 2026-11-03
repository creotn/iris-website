"use client";

import { useState } from "react";
import Image from "next/image";
import { IconChevronDown } from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import styles from "./PhoneField.module.css";

const COUNTRIES = [
  { code: "sa", dial: "966", name: { ar: "السعودية", en: "Saudi Arabia" } },
  { code: "tn", dial: "216", name: { ar: "تونس", en: "Tunisia" } },
  { code: "ae", dial: "971", name: { ar: "الإمارات", en: "UAE" } },
  { code: "kw", dial: "965", name: { ar: "الكويت", en: "Kuwait" } },
  { code: "qa", dial: "974", name: { ar: "قطر", en: "Qatar" } },
  { code: "bh", dial: "973", name: { ar: "البحرين", en: "Bahrain" } },
  { code: "om", dial: "968", name: { ar: "عُمان", en: "Oman" } },
  { code: "eg", dial: "20", name: { ar: "مصر", en: "Egypt" } },
  { code: "jo", dial: "962", name: { ar: "الأردن", en: "Jordan" } },
] as const;

const toDigits = (value: string) => value.replace(/\D/g, "").replace(/^0+/, "");

const isValid = (code: string, digits: string) =>
  code === "sa" ? /^5\d{8}$/.test(digits) : /^\d{6,12}$/.test(digits);

export default function PhoneField({ label, locale }: { label: string; locale: "ar" | "en" }) {
  const t = useScopedI18n("signIn");
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]>(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [national, setNational] = useState("");
  const [touched, setTouched] = useState(false);

  const digits = toDigits(national);
  const invalid = touched && !isValid(country.code, digits);

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control} dir="ltr">
        <div className={styles.picker}>
          <button
            type="button"
            className={styles.country}
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={country.name[locale]}
          >
            <Image src={`https://flagcdn.com/w40/${country.code}.png`} alt="" width={22} height={16} />
            <span>+{country.dial}</span>
            <IconChevronDown size={14} stroke={2} aria-hidden />
          </button>
          {open && (
            <ul className={styles.list} role="listbox">
              {COUNTRIES.map((item) => (
                <li key={item.code} role="option" aria-selected={item.code === country.code}>
                  <button
                    type="button"
                    className={styles.option}
                    onClick={() => {
                      setCountry(item);
                      setOpen(false);
                    }}
                  >
                    <Image src={`https://flagcdn.com/w40/${item.code}.png`} alt="" width={22} height={16} />
                    <span className={styles.name} dir="auto">
                      {item.name[locale]}
                    </span>
                    <span>+{item.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          className={styles.input}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={country.code === "sa" ? "5x xxx xxxx" : ""}
          value={national}
          onChange={(event) => setNational(event.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={invalid || undefined}
          required
        />
      </div>
      <input type="hidden" name="phone" value={digits ? `+${country.dial}${digits}` : ""} />
      {invalid && (
        <span className={styles.error} role="alert">
          {t("phoneInvalid")}
        </span>
      )}
    </div>
  );
}
