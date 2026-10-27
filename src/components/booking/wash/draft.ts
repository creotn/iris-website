import type { BookingItem, CatalogService, L10n, ServiceOption, VisitDetails } from "@/api/BookingAPI";

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
