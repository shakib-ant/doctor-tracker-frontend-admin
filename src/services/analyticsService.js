import { Env } from "@/utils/env";
import { getAuthHeaders } from "@/utils/auth";
import { getCachedData, setCachedData, clearCache } from "@/utils/apiCache";

const BASE_URL = `${Env.backend_url}/v1/analytics`;
const CACHE_KEY = "dashboard_analytics";

export const fetchDashboardAnalytics = async (forceRefresh = false) => {
  if (!forceRefresh) {
    const cached = getCachedData(CACHE_KEY);
    if (cached) return cached;
  }

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

  setCachedData(CACHE_KEY, data);
  return data;
};

export const clearAnalyticsCache = () => clearCache(CACHE_KEY);
