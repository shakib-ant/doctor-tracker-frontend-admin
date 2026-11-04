"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Stethoscope,
  Building2,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";

export function DoctorDetailModal({
  doctor,
  isOpen,
  onClose,
  onToggleStatus,
  isToggling = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-surface border border-line rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-medical-blue/15 text-medical-blue flex items-center justify-center font-manrope font-bold text-lg">
              {doctor.name ? doctor.name.replace("Dr. ", "").charAt(0) : "D"}
            </div>
            <div>
              <h3 className="font-manrope text-lg font-bold text-content-primary">
                {doctor.name}
              </h3>
              <p className="text-xs text-content-secondary">
                {doctor.designation || "Medical Specialist"} &bull;{" "}
                {doctor.specialization}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-content-muted hover:text-content-primary hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-surface-elevated border border-line">
              <div className="text-[11px] text-content-muted flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-medical-blue" />
                Experience
              </div>
              <div className="font-manrope text-sm font-semibold text-content-primary">
                {doctor.experienceYears
                  ? `${doctor.experienceYears} Years`
                  : "N/A"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-line">
              <div className="text-[11px] text-content-muted flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-medical-sage" />
                Consultation Fee
              </div>
              <div className="font-manrope text-sm font-semibold text-content-primary">
                {doctor.consultationFee !== undefined
                  ? `$${doctor.consultationFee}`
                  : "N/A"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-line">
              <div className="text-[11px] text-content-muted flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-medical-blue" />
                Department
              </div>
              <div className="font-manrope text-sm font-semibold text-content-primary truncate">
                {doctor.department || "General"}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-line">
              <div className="text-[11px] text-content-muted mb-1">Status</div>
              <div>
                <Badge variant={doctor.isActive ? "active" : "archived"}>
                  {doctor.isActive ? "Active" : "Archived"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Clinical Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-2">
                Clinical Placement
              </h4>
              <div className="p-3.5 rounded-lg bg-surface-elevated/50 border border-line space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-medical-blue mt-0.5 shrink-0" />
                  <div>
                    <span className="text-content-muted">Primary Hospital: </span>
                    <span className="font-medium text-content-primary">
                      {doctor.hospital || "Not assigned"}
                    </span>
                  </div>
                </div>
                {doctor.qualifications && (
                  <div className="flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-medical-sage mt-0.5 shrink-0" />
                    <div>
                      <span className="text-content-muted">Qualifications: </span>
                      <span className="font-medium text-content-primary">
                        {doctor.qualifications}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-2">
                Schedule Days
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {doctor.availableDays && doctor.availableDays.length > 0 ? (
                  doctor.availableDays.map((day) => (
                    <span
                      key={day}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface-elevated text-content-primary border border-line"
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-content-muted">
                    No schedule specified
                  </span>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-2">
                Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-elevated/40 border border-line">
                  <Phone className="w-3.5 h-3.5 text-medical-blue" />
                  <span className="text-content-secondary">
                    {doctor.phone || "No phone listed"}
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-elevated/40 border border-line truncate">
                  <Mail className="w-3.5 h-3.5 text-medical-blue" />
                  <span className="text-content-secondary truncate">
                    {doctor.email || "No email listed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes / About */}
            {doctor.about && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-2">
                  Clinical Background
                </h4>
                <p className="text-xs text-content-secondary bg-surface-elevated/30 p-3 rounded-lg border border-line leading-relaxed">
                  {doctor.about}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-surface-elevated/40">
          <div>
            {onToggleStatus && (
              <Button
                variant={doctor.isActive ? "destructive" : "secondary"}
                size="sm"
                onClick={() => onToggleStatus(doctor._id, !doctor.isActive)}
                disabled={isToggling}
              >
                {doctor.isActive ? (
                  <>
                    <UserX className="w-3.5 h-3.5 mr-1" />
                    Archive Doctor
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5 mr-1" />
                    Activate Doctor
                  </>
                )}
              </Button>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
