import { httpClient } from "@/lib/fetch/httpClient";

export type ServicePrice = {
  pubkey: string;
  indicativePriceAfterTax: string | null;
  comingSoon: boolean;
};

// The page renders without prices, so a down API must not hold it up: fail fast, and the next
// revalidation tries again.
export const fetchServicePrices = async (): Promise<ServicePrice[]> => {
  const response = await httpClient<{ services: ServicePrice[] }>(
    `${process.env.API_URL}/v1/api/catalog`,
    { revalidate: 60 * 5, tags: ["catalog-public"], retries: 0, timeout: 3000 },
  );
  return response.success ? (response.data?.services ?? []) : [];
};
