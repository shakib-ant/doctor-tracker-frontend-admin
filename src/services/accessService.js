import { Env } from "@/utils/env";
import { getAuthHeaders } from "@/utils/auth";

const PUBLIC_BASE_URL = `${Env.backend_url || "http://localhost:5000/api"}/v1/auth`;
const PROTECTED_BASE_URL = `${Env.backend_url || "http://localhost:5000/api"}/v1/access`;

// Submit a join / access request (Public)
export const submitAccessRequest = async (payload) => {
  const res = await fetch(`${PUBLIC_BASE_URL}/request-access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (HTTP ${res.status})`);
  }
  return data;
};

// Get pending access requests (SuperAdmin / Admin)
export const fetchAccessRequests = async () => {
  const res = await fetch(`${PROTECTED_BASE_URL}/requests`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch access requests (HTTP ${res.status})`);
  }
  return data;
};

// Approve an access request with specific role ('admin' or 'employee')
export const approveAccessRequest = async (id, role = "admin") => {
  const res = await fetch(`${PROTECTED_BASE_URL}/approve/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to approve request (HTTP ${res.status})`);
  }
  return data;
};

// Reject an access request
export const rejectAccessRequest = async (id) => {
  const res = await fetch(`${PROTECTED_BASE_URL}/reject/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to reject request (HTTP ${res.status})`);
  }
  return data;
};

// Get all admins and staff directory
export const fetchAllStaffUsers = async (search = "", role = "all") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (role && role !== "all") params.append("role", role);

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`${PROTECTED_BASE_URL}/users${queryStr}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch staff directory (HTTP ${res.status})`);
  }
  return data;
};

// Update user role
export const updateUserRole = async (id, role) => {
  const res = await fetch(`${PROTECTED_BASE_URL}/role/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ role }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to update user role (HTTP ${res.status})`);
  }
  return data;
};

// Toggle user status (active / suspended)
export const toggleUserStatus = async (id, isActive) => {
  const res = await fetch(`${PROTECTED_BASE_URL}/status/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ isActive }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to update user status (HTTP ${res.status})`);
  }
  return data;
};

// Direct add an administrator
export const directAddAdmin = async (payload) => {
  const res = await fetch(`${PROTECTED_BASE_URL}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to register administrator (HTTP ${res.status})`);
  }
  return data;
};

