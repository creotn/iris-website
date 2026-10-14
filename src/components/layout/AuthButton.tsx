"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/api/AuthAPI";
import { AUTH_CHANGE_EVENT, getAccessToken } from "@/lib/api/client";

const subscribe = (onChange: () => void) => {
  window.addEventListener(AUTH_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, onChange);
};

/**
 * The header's account button. Signed-in state lives in a client-readable cookie, so it's read here
 * rather than on the server — reading cookies in the layout would make every page dynamic. The
 * server snapshot is "signed out", so the first paint matches the static HTML.
 */
export default function AuthButton({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { signIn: string; book: string; account: string; signOut: string };
}) {
  const router = useRouter();
  const signedIn = useSyncExternalStore(subscribe, () => getAccessToken() !== null, () => false);

  if (!signedIn) {
    return (
      <Link href={`/${locale}/sign-in`} className="btn btn-primary btn-sm">
        {labels.signIn}
      </Link>
    );
  }

  return (
    <>
      <Link href={`/${locale}/book/wash`} className="btn btn-primary btn-sm">
        {labels.book}
      </Link>
      <Link href={`/${locale}/account`} className="btn btn-secondary btn-sm">
        {labels.account}
      </Link>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={async () => {
          await signOut();
          router.replace(`/${locale}`);
          router.refresh();
        }}
      >
        {labels.signOut}
      </button>
    </>
  );
}
