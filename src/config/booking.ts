export const BOOKING_STEPS = ["verify", "car", "address"] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];

export const stepPath = (locale: string, step: BookingStep) => `/${locale}/book/${step}`;

export function nextStepPath(locale: string, step: BookingStep): string {
  const next = BOOKING_STEPS[BOOKING_STEPS.indexOf(step) + 1];
  return next ? stepPath(locale, next) : `/${locale}/book/wash`;
}
