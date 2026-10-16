"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconCalendar, IconCar, IconHash, IconPalette } from "@tabler/icons-react";
import { addVehicle } from "@/api/BookingAPI";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { nextStepPath } from "@/config/booking";
import { numberInRange, optional, required, useValidatedForm } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import StepShell from "./StepShell";

const CAR_TYPES = ["SEDAN", "SUV", "TRUCK", "MOTORCYCLE"] as const;
const noRule = () => null;

export default function CarForm() {
  const t = useScopedI18n("book");
  const locale = useCurrentLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [type, setType] = useState<(typeof CAR_TYPES)[number]>("SEDAN");

  const form = useValidatedForm({
    make: required,
    model: required,
    year: optional(numberInRange(1900, 2200, "errYear")),
    plateNumber: noRule,
    color: noRule,
  });

  const field = (key: keyof typeof form.values) => {
    const { props, error: fieldError } = form.field(key);
    return { ...props, error: fieldError ? t(fieldError) : undefined };
  };

  const next = nextStepPath(locale, "car");

  const save = () =>
    startTransition(async () => {
      const result = await addVehicle({ ...form.values, type });
      if (result.ok) router.push(next);
      else setError(translateError(result.error, locale));
    });

  return (
    <StepShell step="car">
      <form className={formStyles.form} action={save}>
        <div className={formStyles.heading}>
          <h1 className={formStyles.title}>{t("carTitle")}</h1>
          <p className={formStyles.subtitle}>{t("carSubtitle")}</p>
        </div>

        <div className={formStyles.row}>
          <AuthField label={t("make")} icon={<IconCar size={18} stroke={1.75} />} {...field("make")} />
          <AuthField label={t("model")} icon={<IconCar size={18} stroke={1.75} />} {...field("model")} />
        </div>

        <div className={formStyles.row}>
          <AuthField
            label={t("year")}
            icon={<IconCalendar size={18} stroke={1.75} />}
            inputMode="numeric"
            required={false}
            {...field("year")}
          />
          <AuthField
            label={t("color")}
            icon={<IconPalette size={18} stroke={1.75} />}
            required={false}
            {...field("color")}
          />
        </div>

        <AuthField
          label={t("plate")}
          icon={<IconHash size={18} stroke={1.75} />}
          required={false}
          {...field("plateNumber")}
        />

        <label className={formStyles.field}>
          <span className={formStyles.label}>{t("type")}</span>
          <select
            className={formStyles.input}
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
          >
            {CAR_TYPES.map((carType) => (
              <option key={carType} value={carType}>
                {t(`type${carType}`)}
              </option>
            ))}
          </select>
        </label>

        <p className="errorMessage" role="alert">
          {error}
        </p>

        <SubmitButton className={formStyles.submit} disabled={!form.isValid || pending}>
          {t("carSubmit")}
          <IconArrowRight className={formStyles.arrow} size={18} stroke={2} aria-hidden />
        </SubmitButton>
        <button type="button" className={formStyles.ghost} onClick={() => router.push(next)}>
          {t("carLater")}
        </button>
      </form>
    </StepShell>
  );
}
