"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconShieldCheck } from "@tabler/icons-react";
import { sendOtp, verifyPhone } from "@/api/AuthAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import StepShell from "./StepShell";

const RESEND_SECONDS = 30;

export default function VerifyForm({ identifier }: { identifier: string }) {
  const t = useScopedI18n("book");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  const form = useValidatedForm({
    otp: (value) => (/^\d{4}$/.test(value) ? null : "errOtp"),
  });
  const otp = form.field("otp");

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const signInPath = `/${locale}/sign-in`;

  const verify = () =>
    startTransition(async () => {
      const result = await verifyPhone(identifier, form.values.otp);
      if (result.ok) router.replace(`${signInPath}?verified=1`);
      else setError(translateError(result.error, locale));
    });

  const resend = () =>
    startTransition(async () => {
      const result = await sendOtp(identifier);
      setResent(result.ok);
      setError(result.ok ? "" : translateError(result.error, locale));
      if (result.ok) setSeconds(RESEND_SECONDS);
    });

  return (
    <StepShell step="verify">
      <form
        className={formStyles.form}
        action={verify}
        onSubmit={(event) => {
          if (!form.isValid) event.preventDefault();
        }}
      >
        <div className={formStyles.heading}>
          <h1 className={formStyles.title}>{t("verifyTitle")}</h1>
          <p className={formStyles.subtitle}>{t("verifySubtitle")}</p>
        </div>

        <AuthField
          label={t("otp")}
          icon={<IconShieldCheck size={18} stroke={1.75} />}
          {...otp.props}
          error={otp.error ? t(otp.error) : undefined}
          inputMode="numeric"
          maxLength={4}
          autoComplete="one-time-code"
          placeholder="••••"
        />

        <p className="errorMessage" role="alert">
          {error}
        </p>
        {resent && !error && <p role="status">{t("resent")}</p>}

        <SubmitButton className={formStyles.submit} disabled={!form.isValid || pending}>
          {t("verifySubmit")}
          <IconArrowRight className={formStyles.arrow} size={18} stroke={2} aria-hidden />
        </SubmitButton>

        <button
          type="button"
          className={formStyles.ghost}
          onClick={resend}
          disabled={seconds > 0 || pending}
        >
          {seconds > 0 ? t("resendIn", { seconds }) : t("resend")}
        </button>
        <button type="button" className={formStyles.ghost} onClick={() => router.push(signInPath)}>
          {t("verifyLater")}
        </button>
      </form>
    </StepShell>
  );
}
