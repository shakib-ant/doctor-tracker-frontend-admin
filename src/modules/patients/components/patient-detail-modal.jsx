"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !patient || !mounted) return null;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 lg:p-[calc((27/1920)*100vw)] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((365/375)*100vw)] sm:max-w-lg md:max-w-xl lg:max-w-[calc((700/1920)*100vw)] bg-white border border-slate-200/90 rounded-[calc((18/375)*100vw)] sm:rounded-2xl lg:rounded-[calc((22/1920)*100vw)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-line bg-surface-elevated/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-medical-blue/20 text-medical-blue border border-medical-blue/30 shrink-0 font-manrope font-bold text-sm">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-manrope text-sm sm:text-base md:text-lg font-bold text-content-primary">
                  {patient.name}
                </h3>
                <Badge variant={getStatusBadgeVariant(patient.status)} className="text-xs px-2 py-0.5">
                  {patient.status}
                </Badge>
                {patient.isArchived && (
                  <Badge variant="warning" className="text-xs px-2 py-0.5">
                    Archived
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-xs md:text-sm text-content-secondary mt-0.5">
                Patient ID: <span className="font-mono text-content-primary">{patient._id}</span>
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-content-secondary hover:text-content-primary shrink-0 h-[calc((34/375)*100vw)] w-[calc((34/375)*100vw)] rounded-lg cursor-pointer"
          >
            <X className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)]" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Patient Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                Age & Gender
              </span>
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-content-primary mt-1 block">
                {patient.age} yrs &bull; {patient.gender}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                Diagnosis
              </span>
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-medical-blue mt-1 block truncate">
                {patient.condition}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                Admission Date
              </span>
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-content-primary mt-1 block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-medical-sage" />
                {formatDate(patient.admissionDate || patient.createdAt)}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-line bg-surface-elevated/20">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-muted uppercase tracking-wider block">
                Care Status
              </span>
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-content-primary mt-1 block">
                {patient.status}
              </span>
            </div>
          </div>

          {/* Assigned Specialist Card */}
          <div className="p-4 rounded-xl border border-line bg-surface-elevated/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-medical-blue" />
                Assigned Medical Specialist
              </span>
              {patient.doctor?.hospital && (
                <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {patient.doctor.hospital}
                </span>
              )}
            </div>
            {patient.doctor ? (
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-manrope font-bold text-[calc((15/375)*100vw)] lg:text-[calc((16/1920)*100vw)] text-content-primary">
                    {patient.doctor.name}
                  </h4>
                  <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-medical-sage font-medium">
                    {patient.doctor.specialization}
                  </p>
                </div>
                {patient.doctor.phone && (
                  <div className="text-right text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary">
                    <span>{patient.doctor.phone}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted">No physician currently assigned.</p>
            )}
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-line bg-surface-elevated/15 space-y-1">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-medical-sage" />
                Primary Contact Phone
              </span>
              <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-primary font-mono">
                {patient.phone || "Not recorded"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-line bg-surface-elevated/15 space-y-1">
              <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-medical-blue" />
                Emergency / Contact Email
              </span>
              <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-primary font-mono truncate">
                {patient.email || "Not recorded"}
              </p>
            </div>
          </div>

          {/* Clinical Case Notes */}
          <div className="p-4 rounded-xl border border-line bg-surface-elevated/20 space-y-2">
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-secondary flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-medical-blue" />
              Clinical Observation & Triage Notes
            </span>
            <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-primary leading-relaxed bg-surface/80 p-3 rounded-lg border border-line/60">
              {patient.notes || "No additional clinical notes filed for this patient admission."}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-[calc((18/375)*100vw)] lg:px-[calc((27/1920)*100vw)] py-[calc((14/375)*100vw)] lg:py-[calc((16/1920)*100vw)] border-t border-line bg-surface-elevated/40 flex flex-wrap items-center justify-between gap-[calc((10/375)*100vw)] shrink-0">
          <div className="flex items-center gap-[calc((10/375)*100vw)]">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] gap-1.5 cursor-pointer rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)]"
            >
              <Printer className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
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
                className={`text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] gap-1.5 rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer ${
                  patient.isArchived ? "text-medical-sage" : "text-amber-400 border-amber-900/50"
                }`}
              >
                <Archive className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)]" />
                {patient.isArchived ? "Restore Patient" : "Archive Patient"}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-[calc((10/375)*100vw)]">
            {onEdit && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  onClose();
                  onEdit(patient);
                }}
                className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
              >
                Edit Record
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

