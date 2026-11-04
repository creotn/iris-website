import type { BookingItem, CatalogService, L10n, SavedAddress, ServiceOption, VisitDetails } from "@/api/BookingAPI";

export type Draft = {
  service: CatalogService | null;
  picks: Record<string, string[]>;
  dims: Record<string, string>;
  qty: number;
  when: "now" | "later";
  date: string;
  slot: string | null;
  visit: VisitDetails;
  notes: string;
  promo: string;
};

export const MAX_QTY = 5;

export const emptyDraft: Draft = {
  service: null,
  picks: {},
  dims: {},
  qty: 1,
  when: "now",
  date: "",
  slot: null,
  visit: { scent: "NONE", vehicleAccess: "OPEN", doNotDisturb: false },
  notes: "",
  promo: "",
};

// ---- The steps and their links ----

export type Phase = "car" | "address" | "service" | "checkout" | "done";

/** Each step has its own link (?step=service) and history entry, so the browser Back button moves one step back. */
export const STEP_SLUG: Record<Phase, string> = { car: "car", address: "location", service: "service", checkout: "review", done: "confirmation" };

/** The step named in the address bar, if any. */
export function urlPhase(): Phase | null {
  const slug = new URLSearchParams(window.location.search).get("step");
  return (Object.keys(STEP_SLUG) as Phase[]).find((phase) => STEP_SLUG[phase] === slug) ?? null;
}

// ---- Keeping the flow across a refresh ----
// Only identifiers and form values are stored, never API objects or payment data.

const STORAGE_KEY = "iris.washDraft";
const STORAGE_VERSION = 1;

/** The steps a refresh may return to. Checkout and done come back through the ?booking= URL instead. */
export type StoredPhase = "car" | "address" | "service";

export type StoredFlow = Omit<Draft, "service"> & {
  version: number;
  phase: StoredPhase;
  vehiclePubkey: string | null;
  place: { address: NonNullable<SavedAddress["address"]>; area: NonNullable<SavedAddress["area"]> } | null;
  servicePubkey: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const isStringOrNull = (value: unknown) => value === null || typeof value === "string";

function isStoredFlow(value: unknown): value is StoredFlow {
  if (!isRecord(value) || value.version !== STORAGE_VERSION) return false;
  const visit = value.visit;
  return (
    ["car", "address", "service"].includes(value.phase as string) &&
    isStringOrNull(value.vehiclePubkey) &&
    isStringOrNull(value.servicePubkey) &&
    (value.place === null || (isRecord(value.place) && isRecord(value.place.address) && isRecord(value.place.area))) &&
    isRecord(value.picks) &&
    Object.values(value.picks).every((list) => Array.isArray(list) && list.every((key) => typeof key === "string")) &&
    isRecord(value.dims) &&
    Object.values(value.dims).every((dim) => typeof dim === "string") &&
    typeof value.qty === "number" &&
    (value.when === "now" || value.when === "later") &&
    typeof value.date === "string" &&
    isStringOrNull(value.slot) &&
    isRecord(visit) &&
    typeof visit.scent === "string" &&
    typeof visit.vehicleAccess === "string" &&
    typeof visit.doNotDisturb === "boolean" &&
    typeof value.notes === "string" &&
    typeof value.promo === "string"
  );
}

// sessionStorage can throw (private mode, blocked storage); any failure just means "no draft".
export function readFlow(): StoredFlow | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const value: unknown = raw ? JSON.parse(raw) : null;
    return isStoredFlow(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveFlow(flow: Omit<StoredFlow, "version">) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...flow, version: STORAGE_VERSION }));
  } catch {}
}

export function clearFlow() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/** The draft for `service` from what was stored, dropping choices the catalog no longer offers. */
export function restoreDraft(service: CatalogService, stored: StoredFlow): Draft {
  const offered = (option: ServiceOption) => new Set(option.variables.map((variable) => variable.pubkey));
  const picks = Object.fromEntries(
    service.options.flatMap((option) => {
      const kept = (stored.picks[option.pubkey] ?? []).filter((key) => offered(option).has(key));
      return kept.length > 0 ? [[option.pubkey, kept]] : [];
    }),
  );
  const dims = Object.fromEntries(service.options.filter((option) => stored.dims[option.pubkey]).map((option) => [option.pubkey, stored.dims[option.pubkey]]));
  // A scheduled day that has passed is no longer bookable.
  const expired = stored.when === "later" && stored.date !== "" && stored.date < dateKey(new Date());

  return {
    service,
    picks,
    dims,
    qty: 1, // quantity is no longer user-selectable; ignore any older stored value
    when: stored.when,
    date: expired ? "" : stored.date,
    slot: expired ? null : stored.slot,
    visit: stored.visit,
    notes: stored.notes,
    promo: stored.promo,
  };
}

export const pick = (value: L10n, locale: string) =>
  (value as Record<string, string | undefined> | null)?.[locale] ?? value?.ar ?? value?.en ?? "";

export const joinNames = (names: string[]) => names.join(" + ");

export const formatMoney = (value: string | number, locale: string) => {
  const amount = Number(value);
  if (locale !== "ar") return new Intl.NumberFormat("en-US", { style: "currency", currency: "SAR" }).format(amount);
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} ر.س`;
};

const sortByOrder = <T extends { displayOrder: number }>(list: T[]) => [...list].sort((a, b) => a.displayOrder - b.displayOrder);
export const sorted = sortByOrder;

function variableForDimension(option: ServiceOption, dimension: number) {
  return option.variables.find(
    (variable) =>
      (variable.minSurface == null || dimension >= variable.minSurface) &&
      (variable.maxSurface == null || dimension <= variable.maxSurface),
  );
}

export function buildItems(draft: Draft): BookingItem[] {
  const { service, qty } = draft;
  if (!service) return [];
  if (service.options.length === 0) return [{ servicePubkey: service.pubkey, quantity: qty }];

  return service.options.flatMap((option): BookingItem[] => {
    if (option.kind === "INPUT") {
      const dimension = Number(draft.dims[option.pubkey]);
      const variable = dimension > 0 ? variableForDimension(option, dimension) : undefined;
      return variable ? [{ variablePubkey: variable.pubkey, quantity: qty, dimension }] : [];
    }
    return (draft.picks[option.pubkey] ?? []).map((variablePubkey) => ({ variablePubkey, quantity: qty }));
  });
}

export function isConfigured(draft: Draft): boolean {
  const { service } = draft;
  if (!service) return false;
  if (service.options.length === 0) return service.indicativePrice != null;

  const answered = (option: ServiceOption) =>
    option.kind === "INPUT"
      ? buildItems({ ...draft, service: { ...service, options: [option] } }).length > 0
      : (draft.picks[option.pubkey]?.length ?? 0) > 0;

  return service.options.every((option) => !option.isRequired || answered(option)) && buildItems(draft).length > 0;
}

export const itemCount = (items: BookingItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);

export const dateKey = (date: Date) => date.toLocaleDateString("en-CA");

export function slotLabel(slot: string) {
  const [, from, to] = slot.split("_");
  return `${from}:00 – ${to}:00`;
}
