"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconCurrentLocation, IconMapPin } from "@tabler/icons-react";
import { saveAddress } from "@/api/BookingAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { nextStepPath } from "@/config/booking";
import { numberInRange, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import StepShell from "./StepShell";

export default function AddressForm() {
  const t = useScopedI18n("book");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [locating, setLocating] = useState(false);

  const form = useValidatedForm({
    address: required,
    latitude: numberInRange(-90, 90, "errLatitude"),
    longitude: numberInRange(-180, 180, "errLongitude"),
  });

  const field = (key: keyof typeof form.values) => {
    const { props, error: fieldError } = form.field(key);
    return { ...props, error: fieldError ? t(fieldError) : undefined };
  };

  const locate = () => {
    setLocating(true);
    setNotice("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        form.setValue("latitude", coords.latitude.toFixed(6));
        form.setValue("longitude", coords.longitude.toFixed(6));
        setLocating(false);
      },
      () => {
        setNotice(t("locationDenied"));
        setLocating(false);
      },
    );
  };

  const save = () =>
    startTransition(async () => {
      const result = await saveAddress(form.values);
      if (!result.ok) {
        setError(translateError(result.error, locale));
        setNotice("");
      } else if (result.data.covered) {
        router.push(nextStepPath(locale, "address"));
      } else {
        setError("");
        setNotice(t("notCovered"));
      }
    });

  return (
    <StepShell step="address">
      <form className={formStyles.form} action={save}>
        <div className={formStyles.heading}>
          <h1 className={formStyles.title}>{t("addressTitle")}</h1>
          <p className={formStyles.subtitle}>{t("addressSubtitle")}</p>
        </div>

        <AuthField
          label={t("address")}
          icon={<IconMapPin size={18} stroke={1.75} />}
          dir="auto"
          autoComplete="street-address"
          {...field("address")}
        />

        <div className={formStyles.row}>
          <AuthField label={t("latitude")} icon={<IconMapPin size={18} stroke={1.75} />} inputMode="decimal" {...field("latitude")} />
          <AuthField label={t("longitude")} icon={<IconMapPin size={18} stroke={1.75} />} inputMode="decimal" {...field("longitude")} />
        </div>

        <button type="button" className={formStyles.ghost} onClick={locate} disabled={locating}>
          <IconCurrentLocation size={16} stroke={1.75} aria-hidden /> {locating ? t("locating") : t("useLocation")}
        </button>

        <p className="errorMessage" role="alert">
          {error}
        </p>
        {notice && (
          <p className={formStyles.notice} role="status">
            {notice}
          </p>
        )}

        <SubmitButton className={formStyles.submit} disabled={!form.isValid || pending}>
          {t("addressSubmit")}
          <IconArrowRight className={formStyles.arrow} size={18} stroke={2} aria-hidden />
        </SubmitButton>
      </form>
    </StepShell>
  );
}
