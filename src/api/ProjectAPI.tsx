import { httpClient } from "@/lib/fetch/httpClient";

const FIVE_MINUTES_REVALIDATE = 60 * 5;

const EMPTY_PROJECTS: FetchProjectsReturn = {
  data: [],
  total: 0,
  currentPage: 1,
};

export const fetchProjects = async (
  limit = 20,
): Promise<FetchProjectsReturn> => {
  const response = await httpClient<FetchProjectsReturn>(
    `${process.env.API_URL}/v1/api/projects/public?limit=${limit}`,
    { revalidate: FIVE_MINUTES_REVALIDATE, tags: ["projects-public"] },
  );
  return response.success ? response.data || EMPTY_PROJECTS : EMPTY_PROJECTS;
};
