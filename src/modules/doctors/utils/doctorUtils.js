export const SPECIALTIES = [
  "All",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Internal Medicine",
  "General Surgery",
  "Oncology",
  "Gynecology",
  "Psychiatry",
];

export const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const getDoctorInitials = (name = "") => {
  const clean = name.replace(/^Dr\.\s*/i, "").trim();
  if (!clean) return "D";
  const parts = clean.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const validateDoctorForm = (formData) => {
  const errors = {};
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Doctor name is required";
  }
  if (!formData.specialization || !formData.specialization.trim()) {
    errors.specialization = "Specialization is required";
  }
  return errors;
};
