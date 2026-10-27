"use client";

import { useState, type ChangeEvent } from "react";

export type BookError = "errRequired" | "errEmail" | "errPassword" | "errOtp" | "errYear" | "errLatitude" | "errLongitude";
export type Rule = (value: string) => BookError | null;

export const required: Rule = (value) => (value.trim() ? null : "errRequired");

export const optional =
  (rule: Rule): Rule =>
  (value) =>
    value.trim() ? rule(value) : null;

export const numberInRange =
  (min: number, max: number, error: BookError): Rule =>
  (value) => {
    const n = Number(value);
    return value.trim() !== "" && Number.isFinite(n) && n >= min && n <= max ? null : error;
  };

export function useValidatedForm<K extends string>(rules: Record<K, Rule>, initial?: Partial<Record<K, string>>) {
  const keys = Object.keys(rules) as K[];
  const [values, setValues] = useState(
    () => Object.fromEntries(keys.map((key) => [key, initial?.[key] ?? ""])) as Record<K, string>,
  );
  const [touched, setTouched] = useState<Partial<Record<K, boolean>>>({});

  const setValue = (key: K, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const field = (key: K) => ({
    props: {
      name: key,
      value: values[key],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setValue(key, event.target.value),
      onBlur: () => setTouched((prev) => ({ ...prev, [key]: true })),
    },
    error: touched[key] ? rules[key](values[key]) : null,
  });

  return {
    values,
    setValue,
    field,
    isValid: keys.every((key) => !rules[key](values[key])),
  };
}
