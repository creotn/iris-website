import type { CSSProperties } from "react";
import type { Order, OrderStatus } from "@/api/AccountAPI";
import { joinNames, pick } from "@/components/booking/wash/draft";

/** The account page's sections; here rather than in the client component so the server page can read them. */
export const VIEWS = ["live", "cars", "address", "history"] as const;
export type View = (typeof VIEWS)[number];

/** Position in a list, so `.reveal` items enter one after another. */
export const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

export const STAGES =["booked", "assigned", "onTheWay", "arrived", "washing", "done"] as const;
export type Stage = (typeof STAGES)[number];

const STAGE_STATUSES: Record<Stage, OrderStatus[]> = {
  booked: ["NEW", "PENDING"],
  assigned: ["ACCEPTED"],
  onTheWay: ["EN_ROUTE"],
  arrived: ["ARRIVED"],
  washing: ["IN_PROGRESS"],
  done: ["COMPLETED", "PAID"],
};

const CLOSED: OrderStatus[] = ["COMPLETED", "PAID", "CANCELLED", "REJECTED"];

/** Mirrors the API's `CANCELLABLE_STATUSES`; it refuses any other status anyway. */
const CANCELLABLE: OrderStatus[] = ["NEW", "PENDING", "ACCEPTED", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"];

export const isActive = (status: OrderStatus) => !CLOSED.includes(status);
export const isCancellable = (status: OrderStatus) => CANCELLABLE.includes(status);
export const isDone = (status: OrderStatus) => STAGE_STATUSES.done.includes(status);
export const isStopped = (status: OrderStatus) => status === "CANCELLED" || status === "REJECTED";

/** Created but not paid for: the wash flow takes it back to its payment step. */
export const awaitsPayment = (order: Order) => order.status === "NEW" && order.paymentMethod === "UNPAID";

/** -1 for a cancelled or declined order, which left the happy path. */
export const stageIndex = (status: OrderStatus) => STAGES.findIndex((stage) => STAGE_STATUSES[stage].includes(status));

/** When the order reached each stage, from its status history; the first stage is the order itself. */
export function stageTimes(order: Order): Partial<Record<Stage, string>> {
  const times: Partial<Record<Stage, string>> = { booked: order.createdAt };
  for (const event of order.statusEvents) {
    const stage = STAGES.find((candidate) => STAGE_STATUSES[candidate].includes(event.status));
    if (stage && !times[stage]) times[stage] = event.createdAt;
  }
  if (order.completedAt && !times.done) times.done = order.completedAt;
  return times;
}

export type Tone = "accent" | "success" | "warn" | "muted";

export function statusTone(status: OrderStatus): Tone {
  if (status === "NEW") return "warn";
  if (isDone(status)) return "success";
  if (isStopped(status)) return "muted";
  return "accent";
}

export const orderNumber = (pubkey: string) => pubkey.slice(0, 8).toUpperCase();

export const orderTitle = (order: Order, locale: string) =>
  joinNames(order.items.map((item) => pick(item.variable?.title ?? item.service?.title ?? null, locale)).filter(Boolean));

export const fullName = (user: { firstName: string | null; lastName: string | null }) =>
  `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

const intlLocale = (locale: string) => (locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US");

export const formatDateTime = (iso: string, locale: string) =>
  new Date(iso).toLocaleString(intlLocale(locale), {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatTime = (iso: string | number, locale: string) =>
  new Date(iso).toLocaleTimeString(intlLocale(locale), { hour: "2-digit", minute: "2-digit" });

export const formatMonth = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(intlLocale(locale), { month: "long", year: "numeric" });
