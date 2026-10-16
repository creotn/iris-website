import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthToken } from "@/lib/fetch/getAuthToken";

/**
 * Place search and place names for the address map, proxied to OpenStreetMap's Nominatim.
 *
 * A handler, not a server action, because it's an interactive read; server-side because browsers
 * on a broken IPv6 route hang on Nominatim with no fallback, while Node falls back to IPv4. It also
 * lets the request carry the identifying User-Agent Nominatim's policy requires of servers.
 *
 * Gated to signed-in visitors (the proxy's matcher skips `/api`), so it isn't an open geocoding
 * proxy. Caching: each upstream answer is kept a day in the Data Cache, as the policy asks; the
 * response itself is `private`, since it is only ever asked for by the account page.
 */

const NOMINATIM = "https://nominatim.openstreetmap.org";
const DAY = 60 * 60 * 24;

const query = z.union([
  z.object({ q: z.string().trim().min(2).max(120), locale: z.enum(["ar", "en"]) }),
  z.object({
    lat: z.coerce.number().min(-90).max(90),
    lon: z.coerce.number().min(-180).max(180),
    locale: z.enum(["ar", "en"]),
  }),
]);

type NominatimAddress = Partial<
  Record<"house_number" | "road" | "neighbourhood" | "suburb" | "quarter" | "city" | "town" | "village" | "state", string>
>;
type NominatimPlace = { lat: string; lon: string; display_name: string; address?: NominatimAddress };

/** "12 King Fahd Rd, Al Olaya, Riyadh" rather than the full administrative chain. */
function shortName({ address, display_name }: NominatimPlace, locale: string) {
  if (!address) return display_name;
  const street = [address.house_number, address.road].filter(Boolean).join(" ");
  const area = address.neighbourhood ?? address.suburb ?? address.quarter;
  const city = address.city ?? address.town ?? address.village ?? address.state;
  const parts = [street, area, city].filter(Boolean);
  return parts.length ? parts.join(locale === "ar" ? "، " : ", ") : display_name;
}

async function nominatim<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${NOMINATIM}${path}`, {
      headers: { "User-Agent": `IRIS-Web (${process.env.NEXT_PUBLIC_URL ?? "iris"})` },
      next: { revalidate: DAY },
      // Generous: a slow route to Nominatim (an IPv6 attempt before IPv4) can take several seconds.
      signal: AbortSignal.timeout(12_000),
    });
    if (response.ok) return (await response.json()) as T;
    console.warn(`[geo] Nominatim answered ${response.status}`);
    return null;
  } catch (error) {
    const cause = (error as { cause?: { code?: string } }).cause?.code;
    console.warn(`[geo] Nominatim unreachable: ${cause ?? (error as Error).name}`);
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!(await getAuthToken())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = query.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  const headers = { "Cache-Control": "private, max-age=3600" };
  const { locale } = parsed.data;

  if ("q" in parsed.data) {
    const found = await nominatim<NominatimPlace[]>(
      `/search?format=jsonv2&addressdetails=1&limit=5&accept-language=${locale}&q=${encodeURIComponent(parsed.data.q)}`,
    );
    if (!found) return NextResponse.json({ error: "unavailable" }, { status: 502 });
    const places = found.map((place) => ({
      latitude: Number(place.lat),
      longitude: Number(place.lon),
      name: shortName(place, locale),
      detail: place.display_name,
    }));
    return NextResponse.json({ places }, { headers });
  }

  const { lat, lon } = parsed.data;
  const place = await nominatim<NominatimPlace>(`/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lon}&accept-language=${locale}`);
  return NextResponse.json({ name: place?.display_name ? shortName(place, locale) : null }, { headers });
}
