import type { BookingItem, CatalogService, L10n, ServiceOption, VisitDetails } from "@/api/BookingAPI";

export type Draft = {
  service: CatalogService | null;
  /** Option pubkey → chosen variable pubkeys. */
  picks: Record<string, string[]>;
  /** INPUT option pubkey → the measurement the customer typed. */
  dims: Record<string, string>;
  qty: number;
  when: "now" | "later";
  date: string;
  slot: string | null;
  visit: VisitDetails;
  notes: string;
  /** The promo code that was checked and accepted. */
  promo: string;
};

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

export const pick = (value: L10n, locale: string) =>
  (value as Record<string, string | undefined> | null)?.[locale] ?? value?.ar ?? value?.en ?? "";

/** Latin digits in both languages; Arabic gets the plain "ر.س" suffix Intl's own symbol would pad with marks. */
export const formatMoney = (value: string | number, locale: string) => {
  const amount = Number(value);
  if (locale !== "ar") return new Intl.NumberFormat("en-US", { style: "currency", currency: "SAR" }).format(amount);
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)} ر.س`;
};

const sortByOrder = <T extends { displayOrder: number }>(list: T[]) => [...list].sort((a, b) => a.displayOrder - b.displayOrder);
export const sorted = sortByOrder;

/** The variable an INPUT option resolves to for a typed measurement, if any. */
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
  // A service without options is priced as a whole.
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

/** Every required option has an answer, and there is something to price. */
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

/** Local calendar date as YYYY-MM-DD — `toISOString` would shift it by the UTC offset. */
export const dateKey = (date: Date) => date.toLocaleDateString("en-CA");

/** `SLOT_08_10` → `08:00 – 10:00`. */
export function slotLabel(slot: string) {
  const [, from, to] = slot.split("_");
  return `${from}:00 – ${to}:00`;
}
