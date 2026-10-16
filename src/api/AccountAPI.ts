import { apiRequest } from "@/lib/api/client";
import type { CardPayment, L10n, Vehicle, VisitDetails } from "./BookingAPI";

export type Customer = {
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    emailVerifiedAt: string | null;
    phoneVerifiedAt: string | null;
  };
};

export const fetchCustomer = () => apiRequest<Customer>("/customers/me", { auth: true });

export type Balance = { balance: string; currency: string; topUpMin: string; topUpMax: string };

export const fetchBalance = () => apiRequest<Balance>("/wallet/balance", { auth: true });

export const initiateTopUp = (amount: string) =>
  apiRequest<CardPayment & { topUpPubkey: string }>("/wallet/balance/top-ups", {
    method: "POST",
    auth: true,
    body: { amount },
  });

/** Like a booking payment, the API re-reads the payment from the gateway before crediting. */
export const verifyTopUp = (topUpPubkey: string, transactionPubkey: string, moyasarPaymentId: string) =>
  apiRequest(`/wallet/balance/top-ups/${topUpPubkey}/verify`, {
    method: "POST",
    auth: true,
    body: { transactionPubkey, moyasarPaymentId },
  });

export type OrderStatus =
  | "NEW"
  | "PENDING"
  | "ACCEPTED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAID"
  | "CANCELLED"
  | "REJECTED";

export type Order = VisitDetails & {
  pubkey: string;
  status: OrderStatus;
  bookingType: "INSTANT" | "SCHEDULED";
  notes: string | null;
  /** Tax-exclusive line total, before any discount. */
  price: string;
  priceAfterDiscount: string;
  onlineDiscount: string;
  taxAmount: string;
  amountDue: string;
  amountPaid: string | null;
  paymentMethod: string;
  paidAt: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  professional: { user: { firstName: string | null; lastName: string | null } } | null;
  address: { address: string; latitude: number | null; longitude: number | null } | null;
  area: { city: string } | null;
  vehicle: Omit<Vehicle, "pubkey"> | null;
  discount: { code: string } | null;
  items: { pubkey: string; unitPrice: string; quantity: number; variable?: { title: L10n } | null; service?: { title: L10n } | null }[];
  rating: { value: number; note: string | null } | null;
  statusEvents: { status: OrderStatus; createdAt: string }[];
  photos: { pubkey: string; kind: "BEFORE" | "AFTER"; file: { filename: string; thumbnailname: string } }[];
};

export type OrderPage = { data: Order[]; total: number; currentPage: number; limit: number };

export const ORDERS_PER_PAGE = 20;

export const fetchOrders = (page: number) =>
  apiRequest<OrderPage>(`/bookings/mine?page=${page}&limit=${ORDERS_PER_PAGE}`, { auth: true });

export const fetchOrder = (pubkey: string) => apiRequest<Order>(`/bookings/mine/${pubkey}`, { auth: true });

export const rateOrder = (pubkey: string, value: number, note: string) =>
  apiRequest(`/bookings/mine/${pubkey}/rate`, {
    method: "POST",
    auth: true,
    body: { value, note: note.trim() || undefined },
  });

/** Uploaded files are served publicly by the API under `/files/<name>`. */
export const fileUrl = (name: string) => `${process.env.NEXT_PUBLIC_API_URL}/v1/api/files/${name}`;
