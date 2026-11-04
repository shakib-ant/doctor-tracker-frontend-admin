import { Env } from "@/utils/env";
import { getAuthHeaders } from "@/utils/auth";

const BASE_URL = `${Env.backend_url || "http://localhost:5000/api"}/employeeApp/protected/doctors`;

export const fetchDoctors = async ({
  page = 1,
  limit = 10,
  search = "",
  specialization = "",
  status = "",
} = {}) => {
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (search && search.trim()) query.set("search", search.trim());
  if (specialization && specialization !== "All") {
    query.set("specialization", specialization.trim());
  }
  if (status && status !== "all") query.set("status", status);

  const url = `${BASE_URL}?${query.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch doctors (HTTP ${res.status})`
    );
  }

  return res.json();
};

export const fetchDoctorById = async (id) => {
  if (!id) throw new Error("Doctor ID is required");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch doctor (HTTP ${res.status})`
    );
  }

  return res.json();
};

export const createDoctor = async (doctorData) => {
  const isFormData =
    typeof FormData !== "undefined" && doctorData instanceof FormData;

  const headers = getAuthHeaders();
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers,
    body: isFormData ? doctorData : JSON.stringify(doctorData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.message || `Failed to create doctor (HTTP ${res.status})`
    );
  }

  return data;
};

export const updateDoctor = async (id, doctorData) => {
  if (!id) throw new Error("Doctor ID is required");

  const isFormData =
    typeof FormData !== "undefined" && doctorData instanceof FormData;

  const headers = getAuthHeaders();
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers,
    body: isFormData ? doctorData : JSON.stringify(doctorData),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.message || `Failed to update doctor (HTTP ${res.status})`
    );
  }

  return data;
};

export const archiveDoctor = async (id, isActive) => {
  if (!id) throw new Error("Doctor ID is required");

  const res = await fetch(`${BASE_URL}/archive/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(isActive !== undefined ? { isActive } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data.message || `Failed to toggle doctor archive (HTTP ${res.status})`
    );
  }

  return data;
};
