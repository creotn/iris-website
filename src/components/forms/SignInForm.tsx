"use client";

import { useActionState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { IconLock, IconMail } from "@tabler/icons-react";
import { SignInAction } from "@/actions/auth";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { errorsMap, translateError } from "@/utils/error";
import styles from "./SignInForm.module.css";

const subscribeNever = () => () => {};
const readReason = () => new URLSearchParams(window.location.search).get("reason");

export default function SignInForm() {
  const t = useScopedI18n("signIn");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [state, formAction] = useActionState(SignInAction, null);

  // Read off the URL rather than `useSearchParams`, which would force this static route to client
  // rendering and a Suspense boundary. The server snapshot is null, so hydration stays consistent.
  const reason = useSyncExternalStore(subscribeNever, readReason, () => null);

  const signedIn = state !== null && "access_token" in state;

  useEffect(() => {
    if (!signedIn) return;
    router.replace(`/${locale}`);
    router.refresh();
  }, [signedIn, locale, router]);

  let error = "";
  if (state && !signedIn) {
    error = translateError(state.message, locale);
  } else if (!state && reason) {
    error = Object.hasOwn(errorsMap, reason)
      ? translateError(reason, locale)
      : t("sessionEnded");
  }

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{t("title")}</h1>
        <p className={styles.subtitle}>{t("subtitle")}</p>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>{t("email")}</span>
        <span className={styles.inputWrap}>
          <IconMail className={styles.icon} size={18} stroke={1.75} aria-hidden />
          <input
            className={styles.input}
            type="email"
            name="identifier"
            placeholder="name@example.com"
            autoComplete="email"
            dir="ltr"
            required
          />
        </span>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>{t("password")}</span>
        <span className={styles.inputWrap}>
          <IconLock className={styles.icon} size={18} stroke={1.75} aria-hidden />
          <input
            className={styles.input}
            type="password"
            name="password"
            placeholder="••••••••"
            autoComplete="current-password"
            dir="ltr"
            required
          />
        </span>
      </label>

      <p className="errorMessage" role="alert">
        {error}
      </p>

      <SubmitButton className={styles.submit}>{t("submit")}</SubmitButton>
    </form>
  );
}
