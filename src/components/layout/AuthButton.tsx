"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { IconUser } from "@tabler/icons-react";
import { AUTH_CHANGE_EVENT, getAccessToken } from "@/lib/api/client";
import AccountMenu, { type AccountMenuLabels } from "./AccountMenu";
import styles from "./AccountMenu.module.css";

const subscribe = (onChange: () => void) => {
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
};

export default function AuthButton({
  locale,
  labels,
  textClassName,
}: {
  locale: Locale;
  labels: AccountMenuLabels & { signIn: string };
  /** When set, signed-out visitors see the words "Sign in" with this class instead of the icon. */
  textClassName?: string;
}) {
  const signedIn = useSyncExternalStore(subscribe, () => getAccessToken() !== null, () => false);

  if (!signedIn && textClassName) {
    return (
      <Link href={`/${locale}/sign-in`} className={textClassName}>
        {labels.signIn}
      </Link>
    );
  }

  if (!signedIn) {
    return (
      <Link href={`/${locale}/sign-in`} className={styles.signIn} aria-label={labels.signIn} title={labels.signIn}>
        <IconUser size={18} stroke={2} aria-hidden="true" />
      </Link>
    );
  }

  // In the header, "My account" is a plain link to the profile page, with no dropdown.
  if (textClassName) {
    return (
      <Link href={`/${locale}/account`} className={textClassName}>
        {labels.account}
      </Link>
    );
  }

  return <AccountMenu locale={locale} labels={labels} />;
}
