import { Env } from "@/utils/env";
import { setAuthToken, removeAuthToken, getAuthToken } from "@/utils/auth";

const BASE_URL = `${Env.backend_url || "http://localhost:5000/api"}/v1/auth`;

export const login = async (email, password) => {
  const cleanEmail = email ? email.trim() : "";

  // Clear any existing stale token first
  removeAuthToken();

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: cleanEmail, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (res.ok && data.token) {
    setAuthToken(data.token);
    if (typeof window !== "undefined" && data.employee) {
      localStorage.setItem("current_user", JSON.stringify(data.employee));
    }
    return data;
  }

  throw new Error(data.message || `Login failed (HTTP ${res.status})`);
};

export const logout = () => {
  removeAuthToken();
  if (typeof window !== "undefined") {
    localStorage.removeItem("current_user");
    window.location.href = "/login";
  }
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("current_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
