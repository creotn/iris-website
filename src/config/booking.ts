/** Booking-flow steps in order, one route per step under `/book`. Add the next step here. */
export const BOOKING_STEPS = ["verify", "car", "address"] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];

export const stepPath = (locale: string, step: BookingStep) => `/${locale}/book/${step}`;

/** Where a step leads; past the last onboarding step the flow continues to the wash booking. */
export function nextStepPath(locale: string, step: BookingStep): string {
  const next = BOOKING_STEPS[BOOKING_STEPS.indexOf(step) + 1];
  return next ? stepPath(locale, next) : `/${locale}/book/wash`;
}
