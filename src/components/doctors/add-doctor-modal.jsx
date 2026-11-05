"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createDoctor } from "@/services/doctorService";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const COMMON_SPECIALTIES = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Internal Medicine",
  "General Surgery",
  "Ophthalmology",
  "ENT",
  "Gynecology",
];

export function AddDoctorModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    hospital: "",
    department: "",
    designation: "",
    qualifications: "",
    experienceYears: "",
    consultationFee: "",
    phone: "",
    email: "",
    about: "",
    availableDays: [],
  });

  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day],
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Doctor name is required";
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        specialization: formData.specialization.trim(),
        hospital: formData.hospital.trim() || undefined,
        department: formData.department.trim() || undefined,
        designation: formData.designation.trim() || undefined,
        qualifications: formData.qualifications.trim() || undefined,
        experienceYears: formData.experienceYears
          ? Number(formData.experienceYears)
          : 0,
        consultationFee: formData.consultationFee
          ? Number(formData.consultationFee)
          : 0,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        about: formData.about.trim() || undefined,
        availableDays: formData.availableDays,
      };

      const result = await createDoctor(payload);

      setSuccessMessage("Doctor created successfully");
      setTimeout(() => {
        onSuccess(result.data);
        onClose();
      }, 700);
    } catch (err) {
      setApiError(err.message || "Failed to create doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-[calc((14/375)*100vw)] lg:p-[calc((27/1920)*100vw)] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((365/375)*100vw)] lg:max-w-[calc((700/1920)*100vw)] bg-white border border-slate-200/90 rounded-[calc((18/375)*100vw)] lg:rounded-[calc((22/1920)*100vw)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[calc((18/375)*100vw)] lg:px-[calc((27/1920)*100vw)] py-[calc((16/375)*100vw)] lg:py-[calc((20/1920)*100vw)] border-b border-line shrink-0">
          <div>
            <h3 className="font-manrope text-[calc((18/375)*100vw)] lg:text-[calc((22/1920)*100vw)] font-bold text-content-primary">
              Register New Doctor
            </h3>
            <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary mt-0.5">
              Add doctor profile to the verified clinical roster.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-[calc((18/375)*100vw)] lg:p-[calc((27/1920)*100vw)] space-y-[calc((14/375)*100vw)] lg:space-y-[calc((18/1920)*100vw)] overflow-y-auto no-scrollbar">
            {apiError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{apiError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Doctor Name & Specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Doctor Name <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="e.g. Dr. Sarah Mitchell"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-red-400 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Specialization <span className="text-red-400">*</span>
                </label>
                <Input
                  type="text"
                  name="specialization"
                  list="specialties-list"
                  placeholder="e.g. Cardiology"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={errors.specialization ? "border-red-500" : ""}
                />
                <datalist id="specialties-list">
                  {COMMON_SPECIALTIES.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
                {errors.specialization && (
                  <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-red-400 mt-1">
                    {errors.specialization}
                  </p>
                )}
              </div>
            </div>

            {/* Hospital & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Hospital / Chamber
                </label>
                <Input
                  type="text"
                  name="hospital"
                  placeholder="e.g. City Central Hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Department
                </label>
                <Input
                  type="text"
                  name="department"
                  placeholder="e.g. Cardiovascular Care"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Designation & Qualifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Designation
                </label>
                <Input
                  type="text"
                  name="designation"
                  placeholder="e.g. Senior Consultant"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Qualifications
                </label>
                <Input
                  type="text"
                  name="qualifications"
                  placeholder="e.g. MBBS, FCPS (Cardiology)"
                  value={formData.qualifications}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Experience & Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Experience (Years)
                </label>
                <Input
                  type="number"
                  name="experienceYears"
                  min="0"
                  max="70"
                  placeholder="e.g. 10"
                  value={formData.experienceYears}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Consultation Fee ($)
                </label>
                <Input
                  type="number"
                  name="consultationFee"
                  min="0"
                  placeholder="e.g. 120"
                  value={formData.consultationFee}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. doctor@hospital.org"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = formData.availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium rounded-md border transition-colors duration-150 ${
                        isSelected
                          ? "bg-medical-blue text-canvas border-medical-blue font-semibold"
                          : "bg-surface-elevated text-content-secondary border-line hover:text-content-primary hover:border-line"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* About / Clinical Bio */}
            <div>
              <label className="block text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium text-content-secondary mb-1.5">
                Clinical Background & Notes
              </label>
              <textarea
                name="about"
                rows={3}
                placeholder="Brief summary of clinical specialties, chamber hours, and affiliations..."
                value={formData.about}
                onChange={handleChange}
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-primary placeholder:text-content-disabled focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-medical-blue"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((18/375)*100vw)] lg:px-[calc((27/1920)*100vw)] py-[calc((14/375)*100vw)] lg:py-[calc((18/1920)*100vw)] border-t border-line bg-surface-elevated/40 shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[calc((34/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
              className="h-[calc((36/375)*100vw)] lg:h-[calc((40/1920)*100vw)] px-[calc((16/375)*100vw)] lg:px-[calc((20/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-[0_6px_18px_rgba(37,99,235,0.3)] hover:shadow-[0_10px_22px_rgba(37,99,235,0.4)] cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
                  Save Doctor
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

