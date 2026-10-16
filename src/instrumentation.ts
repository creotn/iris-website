/**
 * Server-side outbound requests prefer IPv4 when a host has both. Node's default ("verbatim") tries
 * the IPv6 address first, and on a network with a broken IPv6 route those requests — the address
 * map's place search, through `/api/geo` — stall or fail instead of falling back. IPv6-only hosts
 * still resolve; this only changes the order.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { setDefaultResultOrder } = await import("node:dns");
  setDefaultResultOrder("ipv4first");
}
