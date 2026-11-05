"use client";

import { useState, useTransition } from "react";
import { IconCircleCheck, IconMail, IconPencil, IconPhone } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { updateProfile, type Customer } from "@/api/AccountAPI";
import { resendEmailVerification, sendOtp, verifyPhone } from "@/api/AuthAPI";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import { optional, required, useValidatedForm, type Rule } from "@/hooks/useValidatedForm";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { ProfileSkeleton } from "./AccountSkeletons";
import Dialog from "./Dialog";
import ErrorRow from "./ErrorRow";
import styles from "./Account.module.css";

const email: Rule = (value) => (/^\S+@\S+\.\S+$/.test(value.trim()) ? null : "errEmail");
const otp: Rule = (value) => (/^\d{4}$/.test(value) ? null : "errOtp");

/** The customer's own details, with editing and the verification of an unverified email or phone. */
export default function ProfilePanel({
  customer,
  error,
  reload,
  onToast,
}: {
  customer: Customer | null;
  error: string;
  reload: () => void;
  onToast: (message: string) => void;
}) {
  const t = useScopedI18n("account");
  const ts = useScopedI18n("signIn");
  const locale = useCurrentLocale();
  const [editing, setEditing] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [busy, startTransition] = useTransition();
  const [actionError, setActionError] = useState("");

  // A failed first load is already reported above the panels.
  if (!customer) return error ? null : <ProfileSkeleton />;

  const { user } = customer;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const initials = [user.firstName, user.lastName].map((part) => part?.trim()[0] ?? "").join("").toUpperCase() || "?";
  const dateFormat = (value: string) =>
    new Date(value).toLocaleDateString(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const contacts = [user.email, user.phone].filter(Boolean).length;
  const verified = [user.email && user.emailVerifiedAt, user.phone && user.phoneVerifiedAt].filter(Boolean).length;

  const sendLink = () =>
    startTransition(async () => {
      setActionError("");
      const result = await resendEmailVerification(user.email!);
      if (!result.ok) return setActionError(translateError(result.error, locale));
      setLinkSent(true);
      onToast(t("linkSent", { email: user.email! }));
    });

  const startPhone = () =>
    startTransition(async () => {
      setActionError("");
      const result = await sendOtp(user.phone!);
      if (!result.ok) return setActionError(translateError(result.error, locale));
      setCodeOpen(true);
    });

  return (
    <>
      <div className={styles.mainHead}>
        <h1 className={styles.mainTitle}>{t("profile")}</h1>
      </div>

      {error && <ErrorRow message={error} onRetry={reload} />}

      {/* Who you are */}
      <section className={`${styles.idCard} ${styles.reveal}`}>
        <span className={styles.idAvatar} aria-hidden>
          {initials}
        </span>
        <span className={styles.idText}>
          <b dir="auto">{name || t("notSet")}</b>
          <span>{t("memberSinceDate", { date: dateFormat(customer.createdAt) })}</span>
        </span>
        <button type="button" className={styles.button} onClick={() => setEditing(true)}>
          <IconPencil size={16} stroke={1.75} aria-hidden />
          {t("editProfile")}
        </button>
      </section>

      {/* How we reach you, and whether it is confirmed */}
      <div className={styles.contactHead}>
        <h2>{t("contactDetails")}</h2>
        {contacts > 0 && (
          <span className={styles.contactMeter}>
            <span className={styles.meterTrack} aria-hidden>
              <span style={{ inlineSize: `${(verified / contacts) * 100}%` }} />
            </span>
            {t("verifiedCount", { done: verified, total: contacts })}
          </span>
        )}
      </div>

      <div className={styles.contactGrid}>
        <ContactCard
          icon={<IconMail size={20} stroke={1.75} aria-hidden />}
          label={ts("email")}
          value={user.email}
          verifiedAt={user.emailVerifiedAt}
          formatDate={dateFormat}
          hint={t("emailHint")}
          action={linkSent ? t("linkSentShort") : t("sendLink")}
          onAction={sendLink}
          disabled={busy || linkSent}
          onAdd={() => setEditing(true)}
        />
        <ContactCard
          icon={<IconPhone size={20} stroke={1.75} aria-hidden />}
          label={ts("phone")}
          value={user.phone}
          verifiedAt={user.phoneVerifiedAt}
          formatDate={dateFormat}
          hint={t("phoneHint")}
          action={t("verifyPhone")}
          onAction={startPhone}
          disabled={busy}
          onAdd={() => setEditing(true)}
        />
      </div>

      {actionError && (
        <p className="errorMessage" role="alert">
          {actionError}
        </p>
      )}

      <Dialog open={editing} onClose={() => setEditing(false)} title={t("editProfile")}>
        {editing && (
          <EditForm
            customer={customer}
            onCancel={() => setEditing(false)}
            onSaved={() => {
              setEditing(false);
              onToast(t("profileSaved"));
              reload();
            }}
          />
        )}
      </Dialog>

      {user.phone && (
        <Dialog open={codeOpen} onClose={() => setCodeOpen(false)} title={t("phoneCodeTitle")} description={t("phoneCodeSent", { phone: user.phone })}>
          {codeOpen && (
            <PhoneCode
              phone={user.phone}
              onCancel={() => setCodeOpen(false)}
              onDone={() => {
                setCodeOpen(false);
                onToast(t("phoneVerified"));
                reload();
              }}
            />
          )}
        </Dialog>
      )}
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  verifiedAt,
  formatDate,
  hint,
  action,
  onAction,
  disabled,
  onAdd,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  verifiedAt?: string | null;
  formatDate: (value: string) => string;
  hint: string;
  action: string;
  onAction: () => void;
  disabled: boolean;
  onAdd: () => void;
}) {
  const t = useScopedI18n("account");
  const ok = !!value && !!verifiedAt;

  return (
    <article className={`${styles.contact} ${ok ? styles.contactOk : ""} ${styles.reveal}`}>
      <div className={styles.contactTop}>
        <span className={styles.contactIcon}>{icon}</span>
        {value && <Status verified={ok} />}
      </div>
      <span className={styles.contactLabel}>{label}</span>
      <b className={styles.contactValue} dir={value ? "ltr" : undefined}>
        {value || t("notSet")}
      </b>
      <div className={styles.contactFoot}>
        {ok ? (
          <span className={styles.contactNote}>
            <IconCircleCheck size={16} stroke={2} aria-hidden />
            {t("verifiedOn", { date: formatDate(verifiedAt!) })}
          </span>
        ) : (
          <>
            <span className={styles.contactNote}>{value ? hint : t("addHint")}</span>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={value ? onAction : onAdd} disabled={value ? disabled : false}>
              {value ? action : t("add")}
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function Status({ verified }: { verified: boolean }) {
  const t = useScopedI18n("account");
  return <span className={`${styles.badge} ${verified ? styles.badge_success : styles.badge_warn}`}>{verified ? t("verified") : t("notVerified")}</span>;
}

function EditForm({ customer, onCancel, onSaved }: { customer: Customer; onCancel: () => void; onSaved: () => void }) {
  const t = useScopedI18n("account");
  const ts = useScopedI18n("signIn");
  const tb = useScopedI18n("book");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { user } = customer;

  const form = useValidatedForm(
    { firstName: required, lastName: required, email, phone: optional(required) },
    { firstName: user.firstName ?? "", lastName: user.lastName ?? "", email: user.email ?? "", phone: user.phone ?? "" },
  );
  const field = (key: keyof typeof form.values) => {
    const { props, error: fieldError } = form.field(key);
    return { ...props, error: fieldError ? tb(fieldError) : undefined };
  };

  const save = () =>
    startTransition(async () => {
      const result = await updateProfile(form.values);
      if (result.ok) onSaved();
      else setError(translateError(result.error, locale));
    });

  return (
    <form className={formStyles.fields} action={save}>
      <div className={formStyles.row}>
        <AuthField label={ts("firstName")} dir="auto" autoComplete="given-name" {...field("firstName")} />
        <AuthField label={ts("lastName")} dir="auto" autoComplete="family-name" {...field("lastName")} />
      </div>
      <AuthField label={ts("email")} type="email" autoComplete="email" {...field("email")} />
      <AuthField label={ts("phone")} type="tel" inputMode="tel" autoComplete="tel" required={false} {...field("phone")} />
      <p className={styles.muted}>{t("contactChangeNote")}</p>

      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}

      <div className={styles.dialogActions}>
        <button type="button" className={styles.button} onClick={onCancel} disabled={pending}>
          {t("cancel")}
        </button>
        <button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!form.isValid || pending}>
          {t("save")}
        </button>
      </div>
    </form>
  );
}

function PhoneCode({ phone, onCancel, onDone }: { phone: string; onCancel: () => void; onDone: () => void }) {
  const t = useScopedI18n("account");
  const tb = useScopedI18n("book");
  const locale = useCurrentLocale();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const form = useValidatedForm({ otp });
  const { props, error: fieldError } = form.field("otp");

  const verify = () =>
    startTransition(async () => {
      const result = await verifyPhone(phone, form.values.otp);
      if (result.ok) onDone();
      else setError(translateError(result.error, locale));
    });

  const resend = () =>
    startTransition(async () => {
      const result = await sendOtp(phone);
      setResent(result.ok);
      setError(result.ok ? "" : translateError(result.error, locale));
    });

  return (
    <form className={formStyles.fields} action={verify}>
      <AuthField
        label={t("code")}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={4}
        {...props}
        error={fieldError ? tb(fieldError) : undefined}
      />
      <button type="button" className={styles.profileAction} onClick={resend} disabled={pending || resent}>
        {resent ? t("codeResent") : t("resendCode")}
      </button>

      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}

      <div className={styles.dialogActions}>
        <button type="button" className={styles.button} onClick={onCancel} disabled={pending}>
          {t("cancel")}
        </button>
        <button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!form.isValid || pending}>
          {t("verify")}
        </button>
      </div>
    </form>
  );
}
