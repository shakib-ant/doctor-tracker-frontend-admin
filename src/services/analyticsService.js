import { Env } from "@/utils/env";
import { getAuthHeaders } from "@/utils/auth";

const BASE_URL = `${Env.backend_url}/v1/analytics`;

export const fetchDashboardAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch dashboard analytics (HTTP ${res.status})`);
  }
  return data;
};

