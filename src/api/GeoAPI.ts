export type Place = { latitude: number; longitude: number; name: string; detail: string };

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

export async function searchPlaces(query: string, locale: string, signal?: AbortSignal): Promise<Place[] | null> {
  const result = await geo<{ places: Place[] }>({ q: query.trim(), locale }, signal);
  return result?.places ?? null;
}
