"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";
import { X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createPatient, updatePatient } from "@/services/patientService";
import { fetchDoctors } from "@/services/doctorService";
import { COMMON_CONDITIONS, PATIENT_STATUSES, validatePatientForm } from "../utils/patientUtils";

const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export function PatientModal({ patient, isOpen, onClose, onSuccess }) {
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    email: "",
    condition: "",
    doctor: "",
    status: "Active",
    admissionDate: "",
    notes: "",
  });

  const [doctorsList, setDoctorsList] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadDoctorsForSelect = async () => {
      try {
        const res = await fetchDoctors({ limit: 50, status: "active" });
        setDoctorsList(res.data || []);
      } catch (err) {
        console.error("Failed to load doctors for select:", err);
      }
    };
    if (isOpen) {
      loadDoctorsForSelect();
    }
  }, [isOpen]);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        age: patient.age !== undefined ? String(patient.age) : "",
        gender: patient.gender || "Male",
        phone: patient.phone || "",
        email: patient.email || "",
        condition: patient.condition || "",
        doctor: patient.doctor?._id || patient.doctor || "",
        status: patient.status || "Active",
        admissionDate: patient.admissionDate
          ? new Date(patient.admissionDate).toISOString().split("T")[0]
          : "",
        notes: patient.notes || "",
      });
    } else {
      setFormData({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        email: "",
        condition: "",
        doctor: "",
        status: "Active",
        admissionDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
    setErrors({});
    setApiError(null);
    setSuccessMessage(null);
  }, [patient, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSelectField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    const validationErrors = validatePatientForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        condition: formData.condition.trim(),
        doctor: formData.doctor,
        status: formData.status,
        admissionDate: formData.admissionDate ? new Date(formData.admissionDate) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (isEditing) {
        await updatePatient(patient._id, payload);
        setSuccessMessage("Patient updated successfully");
      } else {
        await createPatient(payload);
        setSuccessMessage("Patient registered successfully");
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 600);
    } catch (err) {
      setApiError(err.message || "Failed to save patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const doctorOptions = doctorsList.map((doc) => ({
    value: doc._id,
    label: `${doc.name} (${doc.specialization})`,
  }));

  const statusOptions = PATIENT_STATUSES.filter((s) => s !== "All").map((s) => ({
    value: s,
    label: s,
  }));

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-[calc((12/375)*100vw)] lg:p-[calc((24/1920)*100vw)] bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((350/375)*100vw)] lg:max-w-[calc((620/1920)*100vw)] bg-surface border border-line rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[calc((16/375)*100vw)] lg:px-[calc((24/1920)*100vw)] py-[calc((14/375)*100vw)] lg:py-[calc((16/1920)*100vw)] border-b border-line shrink-0">
          <div>
            <h3 className="font-manrope text-[calc((15/375)*100vw)] lg:text-[calc((18/1920)*100vw)] font-bold text-content-primary">
              {isEditing ? "Edit Patient Information" : "Register New Patient"}
            </h3>
            <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary mt-0.5">
              Enter clinical and demographic details for patient management.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            {apiError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <Input
                  name="name"
                  placeholder="e.g. Eleanor Brooks"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Age <span className="text-red-400">*</span>
                </label>
                <Input
                  type="number"
                  name="age"
                  min="0"
                  max="130"
                  placeholder="e.g. 45"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? "border-red-500" : ""}
                />
                {errors.age && <p className="text-[11px] text-red-400 mt-1">{errors.age}</p>}
              </div>
            </div>

            {/* Gender & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Gender
                </label>
                <CustomSelect
                  value={formData.gender}
                  onChange={(val) => handleSelectField("gender", val)}
                  options={GENDER_OPTIONS}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  placeholder="e.g. +1 (555) 234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Condition & Doctor Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Medical Condition <span className="text-red-400">*</span>
                </label>
                <Input
                  name="condition"
                  list="condition-options"
                  placeholder="e.g. Hypertension"
                  value={formData.condition}
                  onChange={handleChange}
                  className={errors.condition ? "border-red-500" : ""}
                />
                <datalist id="condition-options">
                  {COMMON_CONDITIONS.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                {errors.condition && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.condition}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Assigned Doctor <span className="text-red-400">*</span>
                </label>
                <CustomSelect
                  value={formData.doctor}
                  onChange={(val) => handleSelectField("doctor", val)}
                  options={doctorOptions}
                  placeholder="Assign Medical Specialist..."
                  buttonClassName={errors.doctor ? "border-red-500" : ""}
                />
                {errors.doctor && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.doctor}</p>
                )}
              </div>
            </div>

            {/* Status & Admission Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Care Status
                </label>
                <CustomSelect
                  value={formData.status}
                  onChange={(val) => handleSelectField("status", val)}
                  options={statusOptions}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-content-secondary mb-1">
                  Admission / Visit Date
                </label>
                <CustomDatePicker
                  value={formData.admissionDate}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, admissionDate: val }))
                  }
                  placeholder="Select admission date"
                  className="w-full"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1">
                Clinical Notes
              </label>
              <textarea
                name="notes"
                rows={2}
                placeholder="Diagnostic notes, treatment progress, or prescription details..."
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-xs text-content-primary placeholder:text-content-disabled focus:outline-none focus:ring-2 focus:ring-medical-blue"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] px-[calc((16/375)*100vw)] lg:px-[calc((24/1920)*100vw)] py-[calc((12/375)*100vw)] lg:py-[calc((16/1920)*100vw)] border-t border-line bg-surface-elevated/40 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="h-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] animate-spin mr-1.5" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Patient"
              ) : (
                "Save Patient"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
