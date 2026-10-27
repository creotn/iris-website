"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconLock, IconMail, IconShieldCheck } from "@tabler/icons-react";
import { requestPasswordReset, resetPassword, validateResetCode } from "@/api/AuthAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import AuthField from "./AuthField";
import styles from "./SignInForm.module.css";

type Stage = "request" | "code" | "password";

export default function ForgotPasswordForm() {
  const t = useScopedI18n("forgot");
  const tb = useScopedI18n("book");
  const ts = useScopedI18n("signIn");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("request");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const emailForm = useValidatedForm({
    email: (value) => (/^\S+@\S+\.\S+$/.test(value.trim()) ? null : "errEmail"),
  });
  const codeForm = useValidatedForm({
    otp: (value) => (/^\d{4}$/.test(value) ? null : "errOtp"),
  });
  const passwordForm = useValidatedForm({
    password: (value) => (value.length >= 8 ? null : "errPassword"),
  });

  const fail = (code: string) => setError(translateError(code, locale));

  const request = async () => {
    const result = await requestPasswordReset(emailForm.values.email);
    if (!result.ok) return fail(result.error);
    setEmail(emailForm.values.email.trim().toLowerCase());
    setError("");
    setStage("code");
  };

  const verify = async () => {
    const result = await validateResetCode(email, codeForm.values.otp);
    if (!result.ok) return fail(result.error);
    setError("");
    setStage("password");
  };

  const save = async () => {
    const result = await resetPassword(email, passwordForm.values.password);
    if (!result.ok) return fail(result.error);
    router.replace(`/${locale}/sign-in?reset=1`);
  };

  const emailField = emailForm.field("email");
  const otpField = codeForm.field("otp");
  const passwordField = passwordForm.field("password");

  const heading = {
    request: [t("title"), t("subtitle")],
    code: [t("codeTitle"), t("codeSubtitle")],
    password: [t("newTitle"), t("newSubtitle")],
  }[stage];

  const submit = (label: string, valid: boolean) => (
    <SubmitButton className={styles.submit} disabled={!valid}>
      {label}
      <IconArrowRight className={styles.arrow} size={18} stroke={2} aria-hidden />
    </SubmitButton>
  );

  const errorLine = (
    <p className="errorMessage" role="alert">
      {error}
    </p>
  );

  return (
    <div className={styles.form}>
      <div className={styles.heading}>
        <h1 className={styles.title}>{heading[0]}</h1>
        <p className={styles.subtitle}>{heading[1]}</p>
      </div>

      {stage === "request" && (
        <form className={styles.fields} action={request}>
          <AuthField
            label={ts("email")}
            icon={<IconMail size={18} stroke={1.75} />}
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            {...emailField.props}
            error={emailField.error ? tb(emailField.error) : undefined}
          />
          {errorLine}
          {submit(t("send"), emailForm.isValid)}
        </form>
      )}

      {stage === "code" && (
        <form className={styles.fields} action={verify}>
          <AuthField
            label={tb("otp")}
            icon={<IconShieldCheck size={18} stroke={1.75} />}
            inputMode="numeric"
            maxLength={4}
            autoComplete="one-time-code"
            placeholder="••••"
            {...otpField.props}
            error={otpField.error ? tb(otpField.error) : undefined}
          />
          {errorLine}
          {submit(t("codeSubmit"), codeForm.isValid)}
        </form>
      )}

      {stage === "password" && (
        <form className={styles.fields} action={save}>
          <AuthField
            label={t("newPassword")}
            icon={<IconLock size={18} stroke={1.75} />}
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...passwordField.props}
            error={passwordField.error ? tb(passwordField.error) : undefined}
          />
          {errorLine}
          {submit(t("save"), passwordForm.isValid)}
        </form>
      )}

      <Link href={`/${locale}/sign-in`} className={styles.ghost}>
        {t("backToSignIn")}
      </Link>
    </div>
  );
}
