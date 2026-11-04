"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/api/AuthAPI";
import { stepPath } from "@/config/booking";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { errorsMap, translateError } from "@/utils/error";
import AuthField from "./AuthField";
import RegisterForm from "./RegisterForm";
import styles from "./SignInForm.module.css";

const subscribeNever = () => () => {};
const readReason = () => new URLSearchParams(window.location.search).get("reason");
const readNotice = () => {
  const params = new URLSearchParams(window.location.search);
  return params.has("verified") ? "verified" : params.has("reset") ? "passwordReset" : null;
};

function SignInFields() {
  const t = useScopedI18n("signIn");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [failure, setFailure] = useState<string | null>(null);

  const reason = useSyncExternalStore(subscribeNever, readReason, () => null);
  const notice = useSyncExternalStore(subscribeNever, readNotice, () => null);

  const submit = async (formData: FormData) => {
    const result = await signIn(String(formData.get("identifier")), String(formData.get("password")));
    if (result.ok) {
      router.replace(stepPath(locale, "car"));
      router.refresh();
    } else {
      setFailure(result.error);
    }
  };

  let error = "";
  if (failure) {
    error = translateError(failure, locale);
  } else if (reason) {
    error = Object.hasOwn(errorsMap, reason)
      ? translateError(reason, locale)
      : t("sessionEnded");
  }

  return (
    <form className={styles.fields} action={submit}>
      {notice && (
        <p className={styles.notice} role="status">
          {t(notice)}
        </p>
      )}

      <AuthField
        label={t("email")}
        type="email"
        name="identifier"
        placeholder="name@example.com"
        autoComplete="email"
      />

      <AuthField
        label={t("password")}
        type="password"
        name="password"
        placeholder="••••••••"
        autoComplete="current-password"
        aside={
          <Link href={`/${locale}/forgot-password`} className={styles.forgot}>
            {t("forgotPassword")}
          </Link>
        }
      />

      <p className="errorMessage" role="alert">
        {error}
      </p>

      <SubmitButton className={styles.submit}>{t("submit")}</SubmitButton>
    </form>
  );
}

export default function SignInForm() {
  const t = useScopedI18n("signIn");
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const signingIn = mode === "signin";

  return (
    <div className={styles.form} data-mode={mode}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{signingIn ? t("title") : t("registerTitle")}</h1>
        <p className={styles.subtitle}>{signingIn ? t("subtitle") : t("registerSubtitle")}</p>
      </div>

      {signingIn ? <SignInFields /> : <RegisterForm />}

      <p className={styles.switch}>
        {signingIn ? t("newToIris") : t("haveAccount")}{" "}
        <button
          type="button"
          className={styles.switchButton}
          onClick={() => setMode(signingIn ? "register" : "signin")}
        >
          {signingIn ? t("createAccount") : t("title")}
        </button>
      </p>
    </div>
  );
}
