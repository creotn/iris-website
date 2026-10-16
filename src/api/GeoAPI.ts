/**
 * Place search and place names for the address map, through the site's own `/api/geo` handler
 * (which asks OpenStreetMap's Nominatim). Search runs only when the customer submits — Nominatim's
 * policy forbids search-as-you-type — and every call gives up after a few seconds rather than
 * leaving the map waiting.
 */

export type Place = { latitude: number; longitude: number; name: string; detail: string };

/** Longer than the handler's own upstream limit, so its answer — even "unavailable" — arrives. */
const TIMEOUT_MS = 15_000;

async function geo<T>(params: Record<string, string>, signal?: AbortSignal): Promise<T | null> {
  try {
    const timeout = AbortSignal.timeout(TIMEOUT_MS);
    const response = await fetch(`/api/geo?${new URLSearchParams(params)}`, {
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function placeName(latitude: number, longitude: number, locale: string, signal?: AbortSignal): Promise<string | null> {
  const result = await geo<{ name: string | null }>({ lat: String(latitude), lon: String(longitude), locale }, signal);
  return result?.name ?? null;
}

/** `null` when the search itself failed, as opposed to an empty list of matches. */
export async function searchPlaces(query: string, locale: string, signal?: AbortSignal): Promise<Place[] | null> {
  const result = await geo<{ places: Place[] }>({ q: query.trim(), locale }, signal);
  return result?.places ?? null;
}
