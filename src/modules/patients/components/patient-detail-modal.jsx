"use client";

import React from "react";
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  Stethoscope,
  Building,
  FileText,
  ShieldAlert,
  Printer,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant, formatDate } from "../utils/patientUtils";

export function PatientDetailModal({ patient, isOpen, onClose, onEdit, onArchive }) {
  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-line bg-surface-elevated/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-medical-blue/20 text-medical-blue border border-medical-blue/30 shrink-0 font-manrope font-bold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-manrope text-base sm:text-lg font-bold text-content-primary">
                  {patient.name}
                </h3>
                <Badge variant={getStatusBadgeVariant(patient.status)}>
                  {patient.status}
                </Badge>
                {patient.isArchived && (
                  <Badge variant="warning" className="text-[10px]">
                    Archived
                  </Badge>
                )}
              </div>
              <p className="text-xs text-content-secondary mt-0.5">
                Patient ID: <span className="font-mono text-content-primary">{patient._id}</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-content-secondary hover:text-content-primary shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Patient Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[10px] font-semibold text-content-muted uppercase tracking-wider block">
                Age & Gender
              </span>
              <span className="text-xs sm:text-sm font-semibold text-content-primary mt-1 block">
                {patient.age} yrs &bull; {patient.gender}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[10px] font-semibold text-content-muted uppercase tracking-wider block">
                Diagnosis
              </span>
              <span className="text-xs sm:text-sm font-semibold text-medical-blue mt-1 block truncate">
                {patient.condition}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[10px] font-semibold text-content-muted uppercase tracking-wider block">
                Admission Date
              </span>
              <span className="text-xs sm:text-sm font-semibold text-content-primary mt-1 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-medical-sage" />
                {formatDate(patient.admissionDate || patient.createdAt)}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[10px] font-semibold text-content-muted uppercase tracking-wider block">
                Care Status
              </span>
              <span className="text-xs sm:text-sm font-semibold text-content-primary mt-1 block">
                {patient.status}
              </span>
            </div>
          </div>

          {/* Assigned Specialist Card */}
          <div className="p-4 rounded-xl border border-line bg-surface-elevated/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-content-secondary flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-medical-blue" />
                Assigned Medical Specialist
              </span>
              {patient.doctor?.hospital && (
                <span className="text-[11px] text-content-muted flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {patient.doctor.hospital}
                </span>
              )}
            </div>
            {patient.doctor ? (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-manrope font-bold text-sm text-content-primary">
                    {patient.doctor.name}
                  </h4>
                  <p className="text-xs text-medical-sage font-medium">
                    {patient.doctor.specialization}
                  </p>
                </div>
                {patient.doctor.phone && (
                  <div className="text-right text-xs text-content-secondary">
                    <span>{patient.doctor.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-content-muted">No physician currently assigned.</p>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-line bg-surface-elevated/15 space-y-1">
              <span className="text-[11px] text-content-muted flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-medical-sage" />
                Primary Contact Phone
              </span>
              <p className="text-xs font-semibold text-content-primary font-mono">
                {patient.phone || "Not recorded"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-line bg-surface-elevated/15 space-y-1">
              <span className="text-[11px] text-content-muted flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-medical-blue" />
                Emergency / Contact Email
              </span>
              <p className="text-xs font-semibold text-content-primary font-mono truncate">
                {patient.email || "Not recorded"}
              </p>
            </div>
          </div>

          {/* Clinical Case Notes */}
          <div className="p-4 rounded-xl border border-line bg-surface-elevated/20 space-y-2">
            <span className="text-xs font-semibold text-content-secondary flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-medical-blue" />
              Clinical Observation & Triage Notes
            </span>
            <p className="text-xs text-content-primary leading-relaxed bg-surface/80 p-3 rounded-lg border border-line/60">
              {patient.notes || "No additional clinical notes filed for this patient admission."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-line bg-surface-elevated/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Chart
            </Button>
            {onArchive && (
              <Button
                variant={patient.isArchived ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  onArchive(patient);
                  onClose();
                }}
                className={`text-xs gap-1.5 ${
                  patient.isArchived ? "text-medical-sage" : "text-amber-400 border-amber-900/50"
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                {patient.isArchived ? "Restore Patient" : "Archive Patient"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(patient);
                }}
                className="text-xs"
              >
                Edit Record
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

