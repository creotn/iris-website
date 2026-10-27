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
}: {
  locale: Locale;
  labels: AccountMenuLabels & { signIn: string };
}) {
  const signedIn = useSyncExternalStore(subscribe, () => getAccessToken() !== null, () => false);

  if (!signedIn) {
    return (
      <Link href={`/${locale}/sign-in`} className={styles.signIn} aria-label={labels.signIn} title={labels.signIn}>
        <IconUser size={18} stroke={2} aria-hidden="true" />
      </Link>
    );
  }

  return <AccountMenu locale={locale} labels={labels} />;
}
