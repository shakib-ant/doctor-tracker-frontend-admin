export const COMMON_CONDITIONS = [
  "All",
  "Hypertension",
  "Type 2 Diabetes",
  "Coronary Artery Disease",
  "Arrhythmia",
  "Pediatric Asthma",
  "Migraine",
  "Osteoarthritis",
  "Severe Eczema",
  "Psoriasis",
  "Gallstones (Cholelithiasis)",
  "Major Depressive Disorder",
  "Generalized Anxiety Disorder",
  "Breast Cancer (Stage I)",
];

export const PATIENT_STATUSES = [
  "All",
  "Active",
  "Under Observation",
  "Recovered",
  "Critical",
];

export const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Active":
      return "active";
    case "Recovered":
      return "sage";
    case "Critical":
      return "destructive";
    case "Under Observation":
    default:
      return "secondary";
  }
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const validatePatientForm = (formData) => {
  const errors = {};
  if (!formData.name || !formData.name.trim()) {
    errors.name = "Patient name is required";
  }
  if (formData.age === "" || formData.age === null || formData.age === undefined) {
    errors.age = "Age is required";
  }
  if (!formData.condition || !formData.condition.trim()) {
    errors.condition = "Medical condition is required";
  }
  if (!formData.doctor) {
    errors.doctor = "Please assign a doctor";
  }
  return errors;
};

