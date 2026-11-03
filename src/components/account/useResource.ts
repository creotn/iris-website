"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ApiResult } from "@/lib/api/client";
import { useCurrentLocale } from "@/locales/client";
import { translateError } from "@/utils/error";

export function useResource<T>(fetcher: () => Promise<ApiResult<T>>) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const [state, setState] = useState<{ data: T | null; error: string }>({ data: null, error: "" });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    fetcher().then((result) => {
      if (!active) return;
      if (result.ok) return setState({ data: result.data, error: "" });
      if (result.error === "user_not_authenticated") return router.replace(`/${locale}/sign-in`);
      setState((prev) => ({ data: prev.data, error: translateError(result.error, locale) }));
    });
    return () => {
      active = false;
    };
  }, [fetcher, version, locale, router]);

  const reload = useCallback(() => setVersion((n) => n + 1), []);
  return { ...state, reload };
}
