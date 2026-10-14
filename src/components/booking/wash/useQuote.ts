import { useEffect, useState } from "react";
import { requestQuote, type BookingItem, type Quote } from "@/api/BookingAPI";

type Result = { key: string; quote: Quote | null; error: string | null };

/** Price estimate for a set of lines. Loading is derived (no result for the current key yet), so
 *  nothing sets state synchronously inside the effect. */
export function useQuote(items: BookingItem[]) {
  const key = JSON.stringify(items);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const lines = JSON.parse(key) as BookingItem[];
    if (lines.length === 0) return;
    let active = true;
    requestQuote(lines).then((response) => {
      if (active) setResult({ key, quote: response.ok ? response.data : null, error: response.ok ? null : response.error });
    });
    return () => {
      active = false;
    };
  }, [key]);

  const current = result?.key === key ? result : null;
  return { quote: current?.quote ?? null, error: current?.error ?? null, loading: items.length > 0 && !current };
}
