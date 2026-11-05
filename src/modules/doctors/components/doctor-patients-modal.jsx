"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  if (!isOpen || !doctor) return null;

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
    if (!window.confirm("Are you sure you want to delete this patient from this doctor's list?")) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[calc((12/375)*100vw)] lg:p-[calc((24/1920)*100vw)] bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((350/375)*100vw)] lg:max-w-[calc((650/1920)*100vw)] bg-surface border border-line rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[calc((16/375)*100vw)] lg:px-[calc((24/1920)*100vw)] py-[calc((14/375)*100vw)] lg:py-[calc((16/1920)*100vw)] border-b border-line shrink-0">
          <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
            <div className="w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] lg:w-[calc((36/1920)*100vw)] lg:h-[calc((36/1920)*100vw)] rounded-lg bg-medical-sage/15 text-medical-sage flex items-center justify-center shrink-0">
              <Users className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />
            </div>
            <div>
              <h3 className="font-manrope text-[calc((15/375)*100vw)] lg:text-[calc((18/1920)*100vw)] font-bold text-content-primary">
                Assigned Patients &mdash; {doctor.name}
              </h3>
              <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary">
                {doctor.specialization} &bull; {doctor.hospital || "General Practice"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-line/60 bg-surface-elevated/30 flex items-center justify-between gap-3">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-content-disabled" />
            <Input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          <Button
            variant={isAdding ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isAdding ? "Cancel" : "Add Patient to Doctor"}
          </Button>
        </div>

        {/* Feedback Alerts */}
        <div className="px-6 pt-3">
          {actionError && (
            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}
          {actionSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}
        </div>

        {/* Inline Add Patient Form */}
        {isAdding && (
          <form
            onSubmit={handleAddPatient}
            className="p-4 mx-6 my-2 rounded-lg bg-surface-elevated border border-line space-y-3"
          >
            <h4 className="text-xs font-semibold text-content-primary uppercase tracking-wider">
              Register Patient under {doctor.name}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Input
                placeholder="Patient Full Name *"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="text-xs h-8"
                required
              />
              <Input
                type="number"
                placeholder="Age *"
                value={newPatient.age}
                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                className="text-xs h-8"
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
                className="text-xs h-8"
                required
              />
              <Input
                placeholder="Phone (optional)"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="text-xs h-8"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="sage"
                size="sm"
                disabled={isSubmitting}
                className="h-7 text-xs"
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
        <div className="p-6 space-y-2 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-surface-elevated rounded-lg" />
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
                className="p-3 rounded-lg bg-surface-elevated/60 border border-line flex items-center justify-between gap-3 hover:border-[#384A5C] transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-content-primary">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-content-muted">
                      ({p.age} yrs, {p.gender})
                    </span>
                    <Badge variant="default" className="text-[10px] py-0 px-1.5">
                      {p.condition}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-content-secondary flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-medical-sage" />
                      {new Date(p.admissionDate || p.createdAt).toLocaleDateString()}
                    </span>
                    {p.phone && <span>{p.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={p.status === "Active" ? "active" : "secondary"} className="text-[10px]">
                    {p.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePatient(p._id)}
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                    title="Delete patient from doctor"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
}

