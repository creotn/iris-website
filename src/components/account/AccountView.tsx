"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProfile, type CustomerProfile } from "@/api/AuthAPI";
import formStyles from "@/components/forms/SignInForm.module.css";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import styles from "./AccountView.module.css";

type State = { status: "loading" } | { status: "error"; error: string } | { status: "ready"; profile: CustomerProfile };

export default function AccountView() {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    fetchProfile().then((result) => {
      if (!active) return;
      setState(
        result.ok
          ? { status: "ready", profile: result.data }
          : { status: "error", error: translateError(result.error, locale) },
      );
    });
    return () => {
      active = false;
    };
  }, [locale]);

  const rows =
    state.status === "ready"
      ? [
          [t("name"), `${state.profile.firstName ?? ""} ${state.profile.lastName ?? ""}`.trim()],
          [t("email"), state.profile.email],
          [t("phone"), state.profile.phone],
          [t("address"), state.profile.address?.address],
        ].filter(([, value]) => value)
      : [];

  return (
    <div className={formStyles.form}>
      <div className={formStyles.heading}>
        <h1 className={formStyles.title}>{t("title")}</h1>
        <p className={formStyles.subtitle}>{t("subtitle")}</p>
      </div>

      {state.status === "loading" && <p role="status">{t("loading")}</p>}
      {state.status === "error" && (
        <p className="errorMessage" role="alert">
          {state.error}
        </p>
      )}
      {rows.length > 0 && (
        <dl className={styles.list}>
          {rows.map(([label, value]) => (
            <div key={label} className={styles.row}>
              <dt>{label}</dt>
              <dd dir="auto">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <Link href={`/${locale}/book/wash`} className={`btn btn-primary ${formStyles.submit}`}>
        {t("book")}
      </Link>
    </div>
  );
}
