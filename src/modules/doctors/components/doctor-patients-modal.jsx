"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  X,
  Users,
  Plus,
  Trash2,
  Search,
  Loader2,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { fetchPatientsByDoctor, createPatient, deletePatient } from "@/services/patientService";

export function DoctorPatientsModal({ doctor, isOpen, onClose, onPatientCountChange }) {
  const [mounted, setMounted] = useState(false);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // New patient inline form
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    condition: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadPatients = useCallback(async () => {
    if (!doctor?._id) return;
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await fetchPatientsByDoctor(doctor._id, { search });
      setPatients(res.data || []);
    } catch (err) {
      setActionError(err.message || "Failed to load doctor patients");
    } finally {
      setIsLoading(false);
    }
  }, [doctor?._id, search]);

  useEffect(() => {
    if (isOpen && doctor) {
      loadPatients();
    }
  }, [isOpen, doctor, loadPatients]);

  if (!isOpen || !doctor || !mounted) return null;

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name.trim() || !newPatient.age || !newPatient.condition.trim()) {
      setActionError("Name, age, and condition are required");
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      await createPatient({
        name: newPatient.name.trim(),
        age: Number(newPatient.age),
        gender: newPatient.gender,
        condition: newPatient.condition.trim(),
        phone: newPatient.phone.trim() || undefined,
        doctor: doctor._id,
        status: "Active",
      });

      setActionSuccess("Patient registered under " + doctor.name);
      setNewPatient({ name: "", age: "", gender: "Male", condition: "", phone: "" });
      setIsAdding(false);
      loadPatients();
      if (onPatientCountChange) onPatientCountChange();
    } catch (err) {
      setActionError(err.message || "Failed to add patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient from this doctor's roster?")) {
      return;
    }

    setActionError(null);
    try {
      await deletePatient(patientId);
      setActionSuccess("Patient removed from doctor roster");
      loadPatients();
      if (onPatientCountChange) onPatientCountChange();
    } catch (err) {
      setActionError(err.message || "Failed to delete patient");
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-[calc((12/375)*100vw)] lg:p-[calc((24/1920)*100vw)] bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((355/375)*100vw)] lg:max-w-[calc((800/1920)*100vw)] bg-surface border border-line rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[calc((16/375)*100vw)] lg:px-[calc((24/1920)*100vw)] py-[calc((14/375)*100vw)] lg:py-[calc((16/1920)*100vw)] border-b border-line shrink-0">
          <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] min-w-0">
            <div className="w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] lg:w-[calc((36/1920)*100vw)] lg:h-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] bg-medical-sage/15 text-medical-sage flex items-center justify-center shrink-0">
              <Users className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-manrope text-[calc((14/375)*100vw)] lg:text-[calc((17/1920)*100vw)] font-bold text-content-primary truncate">
                Assigned Patients &mdash; {doctor.name}
              </h3>
              <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary truncate">
                {doctor.specialization} &bull; {doctor.hospital || "General Practice"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-[calc((4/375)*100vw)] lg:p-[calc((6/1920)*100vw)] rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-[calc((14/375)*100vw)] lg:px-[calc((20/1920)*100vw)] py-[calc((10/375)*100vw)] lg:py-[calc((12/1920)*100vw)] border-b border-line/60 bg-surface-elevated/30 flex items-center justify-between gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] shrink-0">
          <div className="relative flex-1 max-w-[calc((240/375)*100vw)] lg:max-w-[calc((280/1920)*100vw)]">
            <Search className="absolute left-[calc((10/375)*100vw)] lg:left-[calc((12/1920)*100vw)] top-1/2 -translate-y-1/2 w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] text-content-disabled" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-[calc((28/375)*100vw)] lg:pl-[calc((32/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]"
            />
          </div>

          <Button
            variant={isAdding ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer shrink-0"
          >
            <Plus className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] mr-1 shrink-0" />
            {isAdding ? "Cancel" : "Add Patient to Doctor"}
          </Button>
        </div>

        {/* Feedback Alerts */}
        <div className="px-[calc((16/375)*100vw)] lg:px-[calc((24/1920)*100vw)] pt-[calc((8/375)*100vw)] lg:pt-[calc((10/1920)*100vw)]">
          {actionError && (
            <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] bg-red-950/40 border border-red-800 text-red-200 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] flex items-center gap-2">
              <AlertCircle className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] text-red-400 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
          {actionSuccess && (
            <div className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] flex items-center gap-2">
              <CheckCircle2 className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}
        </div>

        {/* Inline Add Patient Form */}
        {isAdding && (
          <form
            onSubmit={handleAddPatient}
            className="p-[calc((12/375)*100vw)] lg:p-[calc((16/1920)*100vw)] mx-[calc((16/375)*100vw)] lg:mx-[calc((24/1920)*100vw)] my-[calc((8/375)*100vw)] rounded-[calc((8/375)*100vw)] bg-surface-elevated border border-line space-y-[calc((8/375)*100vw)] shrink-0"
          >
            <h4 className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-primary uppercase tracking-wider">
              Register Patient under {doctor.name}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Patient Full Name *"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)]"
                required
              />
              <Input
                type="number"
                placeholder="Age *"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)]"
                required
              />
              <CustomSelect
                value={newPatient.gender}
                onChange={(val) => setNewPatient({ ...newPatient, gender: val })}
                options={["Male", "Female", "Other"]}
                size="sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder="Medical Condition (e.g. Hypertension) *"
                value={newPatient.condition}
                onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)]"
                required
              />
              <Input
                placeholder="Phone (optional)"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="h-[calc((28/375)*100vw)] lg:h-[calc((30/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="sage"
                size="sm"
                disabled={isSubmitting}
                className="h-[calc((28/375)*100vw)] lg:h-[calc((30/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  "Save Patient"
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Patients List Body */}
        <div className="p-[calc((14/375)*100vw)] lg:p-[calc((20/1920)*100vw)] space-y-[calc((8/375)*100vw)] lg:space-y-[calc((10/1920)*100vw)] overflow-y-auto flex-1 no-scrollbar">
          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 bg-surface-elevated rounded-lg" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="py-10 text-center text-xs text-content-muted">
              No patients assigned to {doctor.name} yet.
            </div>
          ) : (
            patients.map((p) => (
              <div
                key={p._id}
                className="p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] bg-surface-elevated/60 border border-line flex items-center justify-between gap-[calc((8/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] min-w-0 hover:border-[#384A5C] transition-colors"
              >
                {/* Left: Patient Details (flex-1 min-w-0) */}
                <div className="flex-1 min-w-0 space-y-[calc((3/375)*100vw)] lg:space-y-[calc((4/1920)*100vw)]">
                  {/* Top Row: Name, Age/Gender, Condition badge */}
                  <div className="flex items-center gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)] min-w-0 flex-nowrap overflow-hidden">
                    <span
                      className="font-semibold text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)] text-content-primary whitespace-nowrap truncate max-w-[calc((120/375)*100vw)] sm:max-w-[calc((150/375)*100vw)] lg:max-w-[calc((180/1920)*100vw)] shrink-0"
                      title={p.name}
                    >
                      {p.name}
                    </span>

                    <span className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-muted whitespace-nowrap shrink-0">
                      ({p.age} yrs, {p.gender})
                    </span>

                    <Badge
                      variant="default"
                      className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] py-0 px-[calc((6/375)*100vw)] lg:px-[calc((8/1920)*100vw)] font-medium truncate max-w-[calc((100/375)*100vw)] sm:max-w-[calc((140/375)*100vw)] lg:max-w-[calc((200/1920)*100vw)] whitespace-nowrap shrink min-w-0 inline-block align-middle"
                      title={p.condition}
                    >
                      {p.condition}
                    </Badge>
                  </div>

                  {/* Bottom Row: Admission date & Phone */}
                  <div className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] text-content-secondary flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] min-w-0 truncate">
                    <span className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                      <Calendar className="w-[calc((11/375)*100vw)] h-[calc((11/375)*100vw)] lg:w-[calc((12/1920)*100vw)] lg:h-[calc((12/1920)*100vw)] text-medical-sage shrink-0" />
                      {new Date(p.admissionDate || p.createdAt).toLocaleDateString()}
                    </span>
                    {p.phone && (
                      <span className="shrink-0 whitespace-nowrap text-content-muted truncate max-w-[calc((120/375)*100vw)] lg:max-w-[calc((150/1920)*100vw)]">
                        {p.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Status badge & Delete button (shrink-0) */}
                <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)] shrink-0 ml-auto pl-[calc((6/375)*100vw)]">
                  <Badge
                    variant={p.status === "Active" ? "active" : "secondary"}
                    className="text-[calc((10/375)*100vw)] lg:text-[calc((11/1920)*100vw)] whitespace-nowrap shrink-0"
                  >
                    {p.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePatient(p._id)}
                    className="h-[calc((28/375)*100vw)] w-[calc((28/375)*100vw)] lg:h-[calc((30/1920)*100vw)] lg:w-[calc((30/1920)*100vw)] p-0 text-red-400 hover:text-red-300 hover:bg-red-950/40 shrink-0 cursor-pointer flex items-center justify-center rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)]"
                    title="Delete patient from doctor roster"
                  >
                    <Trash2 className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)]" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-[calc((16/375)*100vw)] lg:px-[calc((24/1920)*100vw)] py-[calc((10/375)*100vw)] lg:py-[calc((14/1920)*100vw)] border-t border-line bg-surface-elevated/40 text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary shrink-0">
          <span>Total Assigned: {patients.length} patients</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="h-[calc((28/375)*100vw)] lg:h-[calc((32/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
          >
            Close
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
