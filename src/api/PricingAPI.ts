import { httpClient } from "@/lib/fetch/httpClient";

const FIVE_MINUTES_REVALIDATE = 60 * 5;

type L10n = { en?: string; ar?: string; ur?: string } | null;

export type MembershipPlan = {
  pubkey: string;
  name: L10n;
  description: L10n;
  washCount: number;
  validityDays: number;
  price: string;
  averageWashPrice: string | null;
  monthlyWashes: number | null;
  extraWashPrice: string | null;
  maxCars: number | null;
  badgeLabel: string | null;
  cardColor: string | null;
  displayOrder: number;
};

export const fetchMembershipPlans = async (): Promise<MembershipPlan[]> => {
  const response = await httpClient<MembershipPlan[] | { data: MembershipPlan[] }>(
    `${process.env.API_URL}/v1/api/packages`,
    { revalidate: FIVE_MINUTES_REVALIDATE, tags: ["packages"] },
  );
  if (!response.success || !response.data) return [];
  const plans = Array.isArray(response.data) ? response.data : response.data.data;
  return [...(plans ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);
};
