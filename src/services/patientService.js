import { Env } from "@/utils/env";
import { getAuthHeaders } from "@/utils/auth";

const BASE_URL = `${Env.backend_url || "http://localhost:5000/api"}/employeeApp/protected/patients`;

export const fetchPatients = async ({
  page = 1,
  limit = 10,
  search = "",
  condition = "",
  status = "",
  doctorId = "",
  startDate = "",
  endDate = "",
} = {}) => {
  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (search && search.trim()) query.set("search", search.trim());
  if (condition && condition !== "All") query.set("condition", condition.trim());
  if (status && status !== "All") query.set("status", status.trim());
  if (doctorId) query.set("doctorId", doctorId);
  if (startDate) query.set("startDate", startDate);
  if (endDate) query.set("endDate", endDate);

  const res = await fetch(`${BASE_URL}?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch patients (HTTP ${res.status})`);
  }
  return data;
};

export const fetchPatientById = async (id) => {
  if (!id) throw new Error("Patient ID is required");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch patient (HTTP ${res.status})`);
  }
  return data;
};

export const createPatient = async (patientData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(patientData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to create patient (HTTP ${res.status})`);
  }
  return data;
};

export const updatePatient = async (id, patientData) => {
  if (!id) throw new Error("Patient ID is required");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(patientData),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to update patient (HTTP ${res.status})`);
  }
  return data;
};

export const deletePatient = async (id) => {
  if (!id) throw new Error("Patient ID is required");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to delete patient (HTTP ${res.status})`);
  }
  return data;
};

export const fetchPatientsByDoctor = async (doctorId, { page = 1, limit = 10, search = "" } = {}) => {
  if (!doctorId) throw new Error("Doctor ID is required");

  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (search && search.trim()) query.set("search", search.trim());

  const res = await fetch(`${BASE_URL}/by-doctor/${doctorId}?${query.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Failed to fetch doctor patients (HTTP ${res.status})`);
  }
  return data;
};
