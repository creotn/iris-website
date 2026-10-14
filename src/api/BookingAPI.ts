import { apiRequest, type ApiResult } from "@/lib/api/client";

/** Optional form fields arrive as empty strings; the API wants them absent. */
const blankToUndefined = (value: string) => (value.trim() === "" ? undefined : value.trim());

export function addVehicle(input: {
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  color: string;
  type: string;
}): Promise<ApiResult> {
  const year = blankToUndefined(input.year);
  return apiRequest("/vehicles", {
    method: "POST",
    auth: true,
    body: {
      make: input.make.trim(),
      model: input.model.trim(),
      year: year === undefined ? undefined : Number(year),
      plateNumber: blankToUndefined(input.plateNumber),
      color: blankToUndefined(input.color),
      type: input.type,
    },
  });
}

export async function saveAddress(input: {
  address: string;
  latitude: string;
  longitude: string;
}): Promise<ApiResult<{ covered: boolean }>> {
  const result = await apiRequest<{ area: unknown }>("/customers/me/address", {
    method: "PUT",
    auth: true,
    body: {
      address: input.address.trim(),
      latitude: Number(input.latitude),
      longitude: Number(input.longitude),
    },
  });
  if (!result.ok) return result;
  return { ok: true, data: { covered: result.data?.area != null } };
}

// ---------- the wash flow: catalog → quote → booking → payment ----------

export type L10n = { en?: string; ar?: string; ur?: string } | null;

export type Variable = {
  pubkey: string;
  title: L10n;
  price: string;
  minSurface: number | null;
  maxSurface: number | null;
  displayOrder: number;
};

export type ServiceOption = {
  pubkey: string;
  title: L10n;
  kind: "CATEGORY" | "SELECT" | "INPUT";
  selectionMode: "SINGLE" | "MULTIPLE";
  isRequired: boolean;
  displayOrder: number;
  variables: Variable[];
};

export type CatalogService = {
  pubkey: string;
  title: L10n;
  description: L10n;
  categoryPubkey: string | null;
  indicativePrice: string | null;
  estimatedMinutes: number | null;
  displayOrder: number;
  options: ServiceOption[];
};

export type CatalogCategory = { pubkey: string; label: L10n; displayOrder: number };

export const fetchCatalog = () =>
  apiRequest<{ categories: CatalogCategory[]; services: CatalogService[] }>("/catalog");

export type BookingItem = {
  variablePubkey?: string;
  servicePubkey?: string;
  quantity: number;
  dimension?: number;
};

export type Quote = {
  /** Tax-exclusive sum. */
  total: string;
  tax: { currency: string; taxableAmount: string; taxAmount: string; amountDue: string; amountDueMinor: number };
};

export const requestQuote = (lines: BookingItem[]) =>
  apiRequest<Quote>("/catalog/quote", {
    method: "POST",
    // The quote DTO has no `dimension` field and would strip it anyway.
    body: { lines: lines.map(({ dimension: _dimension, ...line }) => line) },
  });

export type Vehicle = { pubkey: string; make: string; model: string; year: number | null; plateNumber: string | null; type: string };

export async function fetchVehicles(): Promise<ApiResult<Vehicle[]>> {
  const result = await apiRequest<Vehicle[] | { data: Vehicle[] }>("/vehicles", { auth: true });
  if (!result.ok) return result;
  return { ok: true, data: Array.isArray(result.data) ? result.data : result.data.data };
}

export type SavedAddress = {
  address: { pubkey: string; address: string } | null;
  /** Null with an address present means the address is outside coverage. */
  area: { pubkey: string; city: string } | null;
};

export const fetchAddress = () => apiRequest<SavedAddress>("/customers/me/address", { auth: true });

export type SlotInfo = { timeSlot: string; capacity: number; occupancy: number; available: boolean };

export const fetchSlots = (areaPubkey: string, date: string) =>
  apiRequest<SlotInfo[]>(`/scheduling/slots?areaPubkey=${encodeURIComponent(areaPubkey)}&date=${date}`, { auth: true });

export type DiscountCheck =
  | { valid: true; discount: { code: string; discountType: string; value: string }; preview?: { discountAmount: string; finalPrice: string } }
  | { valid: false; reason: string; message: string };

export const checkDiscount = (code: string, itemCount: number, price: string) =>
  apiRequest<DiscountCheck>("/discounts/check", { method: "POST", body: { code: code.trim(), itemCount, price } });

export type VisitDetails = {
  scent: "NONE" | "LIGHT" | "MEDIUM";
  vehicleAccess: "OWNER" | "GUARD" | "OPEN";
  doNotDisturb: boolean;
};

export type Booking = {
  pubkey: string;
  status: string;
  bookingType: string;
  scheduledAt: string | null;
  price: string;
  amountDue: string;
  amountPaid: string | null;
  paymentMethod: string;
  paidAt: string | null;
  items: { pubkey: string; quantity: number; variable?: { title: L10n } | null; service?: { title: L10n } | null }[];
};

type BookingInput = {
  items: BookingItem[];
  addressPubkey: string;
  vehiclePubkey: string;
  discountCode?: string;
  notes?: string;
  visit: VisitDetails;
};

const bookingBody = ({ items, addressPubkey, vehiclePubkey, discountCode, notes, visit }: BookingInput) => ({
  items,
  addressPubkey,
  vehiclePubkey,
  discountCode: discountCode || undefined,
  notes: notes?.trim() || undefined,
  ...visit,
});

export const createInstantBooking = (input: BookingInput) =>
  apiRequest<Booking>("/bookings", {
    method: "POST",
    auth: true,
    body: { ...bookingBody(input), bookingType: "INSTANT", source: "WEB" },
  });

/** A scheduled wash must reserve a slot, which `POST /bookings` with SCHEDULED does not do. */
export async function createScheduledBooking(
  input: BookingInput & { areaPubkey: string; date: string; timeSlot: string },
): Promise<ApiResult<Booking>> {
  const { areaPubkey, date, timeSlot } = input;
  const result = await apiRequest<{ booking: Booking }>("/scheduling/slots", {
    method: "POST",
    auth: true,
    body: { ...bookingBody(input), areaPubkey, date, timeSlot },
  });
  return result.ok ? { ok: true, data: result.data.booking } : result;
}

export const fetchBooking = (pubkey: string) => apiRequest<Booking>(`/bookings/mine/${pubkey}`, { auth: true });

export const cancelBooking = (pubkey: string) =>
  apiRequest(`/bookings/mine/${pubkey}/cancel`, { method: "PATCH", auth: true });

type Online = { discount: string; amountDue: string; amountDueMinor: number; taxAmount: string };

export type PaymentSummary = {
  currency: string;
  price: string;
  taxAmount: string;
  amountDue: string;
  amountDueMinor: number;
  requiresPayment: boolean;
  cashAvailable: boolean;
  balanceMinor: number | null;
  online: Online | null;
  split: { balancePart: string; cardPart: string; available: boolean } | null;
};

export const fetchPaymentSummary = (pubkey: string) =>
  apiRequest<PaymentSummary>(`/bookings/mine/${pubkey}/payment/summary`, { auth: true });

export type CardPayment = {
  payment: { transactionPubkey: string };
  givenId: string | null;
  moyasar: {
    amount: number;
    currency: string;
    description: string;
    publishable_api_key: string;
    methods: string[];
    supported_networks: string[];
    metadata: Record<string, unknown>;
  };
};

export const initiateCardPayment = (pubkey: string, useBalance: boolean) =>
  apiRequest<CardPayment>(`/bookings/mine/${pubkey}/payment/initiate`, {
    method: "POST",
    auth: true,
    body: { useBalance },
  });

export const payWithBalance = (pubkey: string) =>
  apiRequest(`/bookings/mine/${pubkey}/payment/balance`, { method: "POST", auth: true });

export const payWithCash = (pubkey: string) =>
  apiRequest(`/bookings/mine/${pubkey}/payment/cash`, { method: "POST", auth: true });

/** The server confirms with the gateway itself; the client-reported status is never trusted. */
export const verifyCardPayment = (pubkey: string, transactionPubkey: string, moyasarPaymentId: string) =>
  apiRequest(`/bookings/mine/${pubkey}/payment/verify`, {
    method: "POST",
    auth: true,
    body: { transactionPubkey, moyasarPaymentId },
  });
