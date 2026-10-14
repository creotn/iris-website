"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useScopedI18n } from "@/locales/client";
import styles from "./SignInForm.module.css";

type AuthFieldProps = ComponentProps<"input"> & {
  label: string;
  icon: ReactNode;
  aside?: ReactNode;
  error?: string;
};

export default function AuthField({ label, icon, aside, error, type, required = true, ...input }: AuthFieldProps) {
  const t = useScopedI18n("signIn");
  const [shown, setShown] = useState(false);
  const isPassword = type === "password";

  return (
    <label className={styles.field}>
      <span className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        {aside}
      </span>
      <span className={styles.inputWrap}>
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
        <input
          dir="ltr"
          {...input}
          className={styles.input}
          type={isPassword && shown ? "text" : type}
          required={required}
          aria-invalid={error ? true : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShown((v) => !v)}
            aria-label={shown ? t("hidePassword") : t("showPassword")}
          >
            {shown ? (
              <IconEyeOff size={18} stroke={1.75} aria-hidden />
            ) : (
              <IconEye size={18} stroke={1.75} aria-hidden />
            )}
          </button>
        )}
      </span>
      {error && (
        <span className={styles.fieldError} role="alert">
          {error}
        </span>
      )}
    </label>
  );
}
