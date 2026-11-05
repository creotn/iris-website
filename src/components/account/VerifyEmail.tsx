"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { verifyEmail } from "@/api/AuthAPI";
import formStyles from "@/components/forms/SignInForm.module.css";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";

type State = "checking" | "done" | "failed";

// A token works once; share the request so a re-run effect (dev Strict Mode) doesn't spend it twice.
const requests = new Map<string, ReturnType<typeof verifyEmail>>();
const redeem = (token: string) => {
  if (!requests.has(token)) requests.set(token, verifyEmail(token));
  return requests.get(token)!;
};

/** Redeems the emailed token once, then says whether the address is confirmed. */
export default function VerifyEmail({ token }: { token: string }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [state, setState] = useState<State>(token ? "checking" : "failed");

  useEffect(() => {
    if (!token) return;
    let active = true;
    redeem(token).then((result) => {
      if (active) setState(result.ok ? "done" : "failed");
    });
    return () => {
      active = false;
    };
  }, [token]);

  const title = state === "checking" ? t("emailCheckTitle") : state === "done" ? t("emailDoneTitle") : t("emailFailedTitle");
  const text = state === "checking" ? "" : state === "done" ? t("emailDoneText") : t("emailFailedText");

  return (
    <div className={formStyles.form} role="status">
      <div className={formStyles.heading}>
        <h1 className={formStyles.title}>{title}</h1>
        {text && <p className={formStyles.subtitle}>{text}</p>}
      </div>
      {state !== "checking" && (
        <Link href={`/${locale}/account?view=profile`} className={formStyles.submit}>
          {t("toProfile")}
        </Link>
      )}
    </div>
  );
}
