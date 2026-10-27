"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { register } from "@/api/AuthAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import AuthField from "./AuthField";
import PhoneField from "./PhoneField";
import styles from "./SignInForm.module.css";

export default function RegisterForm() {
  const t = useScopedI18n("signIn");
  const locale = useCurrentLocale();

  const router = useRouter();
  const [failure, setFailure] = useState<string | null>(null);

  const submit = async (formData: FormData) => {
    const field = (name: string) => String(formData.get(name) ?? "").trim();
    const email = field("email").toLowerCase();
    const result = await register({
      firstName: field("firstName"),
      lastName: field("lastName"),
      phone: field("phone"),
      email,
      password: String(formData.get("password") ?? ""),
    });
    if (result.ok) router.push(`/${locale}/book/verify?identifier=${encodeURIComponent(email)}`);
    else setFailure(result.error);
  };

  const error = failure ? translateError(failure, locale) : "";

  return (
    <form className={styles.fields} action={submit}>
      <div className={styles.row}>
        <AuthField label={t("firstName")} icon={<IconUser size={18} stroke={1.75} />} name="firstName" autoComplete="given-name" />
        <AuthField label={t("lastName")} icon={<IconUser size={18} stroke={1.75} />} name="lastName" autoComplete="family-name" />
      </div>
      <PhoneField label={t("phone")} locale={locale} />
      <AuthField label={t("email")} icon={<IconMail size={18} stroke={1.75} />} type="email" name="email" placeholder="name@example.com" autoComplete="email" />
      <AuthField label={t("password")} icon={<IconLock size={18} stroke={1.75} />} type="password" name="password" placeholder="••••••••" autoComplete="new-password" minLength={6} />

      <p className="errorMessage" role="alert">
        {error}
      </p>

      <SubmitButton className={styles.submit}>
        {t("registerSubmit")}
        <IconArrowRight className={styles.arrow} size={18} stroke={2} aria-hidden />
      </SubmitButton>
    </form>
  );
}
