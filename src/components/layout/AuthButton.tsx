"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AUTH_CHANGE_EVENT, getAccessToken } from "@/lib/api/client";
import AccountMenu, { type AccountMenuLabels } from "./AccountMenu";
import styles from "./AccountMenu.module.css";

const subscribe = (onChange: () => void) => {
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
};

/**
 * The header's account control. Signed-in state lives in a client-readable cookie, so it's read here
 * rather than on the server — reading cookies in the layout would make every page dynamic. The
 * server snapshot is "signed out", so the first paint matches the static HTML.
 */
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
      <Link href={`/${locale}/sign-in`} className={styles.signIn}>
        {labels.signIn}
      </Link>
    );
  }

  return <AccountMenu locale={locale} labels={labels} />;
}
