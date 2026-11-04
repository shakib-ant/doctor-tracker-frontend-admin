"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  FileText,
  Edit2,
  Activity,
  Printer,
  Archive,
  ArchiveRestore,
  ChevronRight,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "Active", label: "Active Treatment", color: "text-blue-400" },
  { value: "Under Observation", label: "Under Observation", color: "text-amber-400" },
  { value: "Critical", label: "Critical / ICU", color: "text-red-400" },
  { value: "Recovered", label: "Recovered / Stable", color: "text-emerald-400" },
];

export function PatientActionMenu({
  patient,
  onViewDetails,
  onEdit,
  onArchiveToggle,
  onStatusChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowStatusSubmenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowStatusSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handlePrintSlip = () => {
    setIsOpen(false);
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Admission Slip - ${patient.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; }
            .header { border-bottom: 2px solid #333; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin: 0; }
            .sub { color: #666; font-size: 14px; margin-top: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px; }
            .card { background: #f9f9f9; padding: 14px; border-radius: 8px; border: 1px solid #ddd; }
            .label { font-size: 11px; text-transform: uppercase; color: #777; font-weight: bold; }
            .val { font-size: 16px; font-weight: 600; margin-top: 4px; }
            .notes { margin-top: 20px; padding: 16px; background: #fafafa; border: 1px dashed #ccc; border-radius: 8px; }
            .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 16px; font-size: 12px; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">DOCTOR TRACKER — CLINICAL ADMISSION RECORD</h1>
            <div class="sub">Central Hospital Administration & Patient Inpatient Record</div>
          </div>
          <div class="grid">
            <div class="card">
              <div class="label">Patient Name</div>
              <div class="val">${patient.name}</div>
            </div>
            <div class="card">
              <div class="label">Age & Gender</div>
              <div class="val">${patient.age} Years • ${patient.gender}</div>
            </div>
            <div class="card">
              <div class="label">Diagnosis / Condition</div>
              <div class="val">${patient.condition}</div>
            </div>
            <div class="card">
              <div class="label">Care Status</div>
              <div class="val">${patient.status}</div>
            </div>
            <div class="card">
              <div class="label">Assigned Medical Specialist</div>
              <div class="val">${patient.doctor?.name || "Unassigned"} (${patient.doctor?.specialization || "General"})</div>
            </div>
            <div class="card">
              <div class="label">Hospital / Chamber</div>
              <div class="val">${patient.doctor?.hospital || "Main Ward"}</div>
            </div>
          </div>
          <div class="notes">
            <div class="label">Clinical Case & Triage Notes</div>
            <div style="margin-top: 8px; font-size: 14px; line-height: 1.5;">${patient.notes || "Standard clinical protocol observed."}</div>
          </div>
          <div class="footer">
            Generated on ${new Date().toLocaleString()} &bull; Doctor Tracker Healthcare Network
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExportData = () => {
    setIsOpen(false);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(patient, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `Patient_${patient.name.replace(/\s+/g, "_")}_Dossier.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div ref={menuRef} className="relative inline-block text-left select-none">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowStatusSubmenu(false);
        }}
        className="h-7 w-7 p-0 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-elevated/80 transition-colors"
        title="More clinical actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-line bg-surface/98 p-1.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onViewDetails(patient);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-medical-blue" />
            <span>View Clinical Chart</span>
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit(patient);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-content-secondary" />
            <span>Edit Information</span>
          </button>

          {/* Quick Care Status Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusSubmenu(!showStatusSubmenu)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-3.5 h-3.5 text-medical-sage" />
                <span>Update Care Status</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 text-content-muted transition-transform ${showStatusSubmenu ? "rotate-90" : ""}`} />
            </button>

            {showStatusSubmenu && (
              <div className="my-1 ml-2 pl-2 border-l border-line/80 space-y-0.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setShowStatusSubmenu(false);
                      onStatusChange(patient, opt.value);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-surface-elevated transition-colors text-left cursor-pointer ${
                      patient.status === opt.value
                        ? "bg-surface-elevated font-semibold text-content-primary"
                        : "text-content-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${opt.color.replace("text-", "bg-")}`} />
                      {opt.label}
                    </span>
                    {patient.status === opt.value && (
                      <Check className="w-3 h-3 text-medical-blue" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Print Admission Slip */}
          <button
            type="button"
            onClick={handlePrintSlip}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-content-secondary" />
            <span>Print Clinical Record</span>
          </button>

          {/* Export Medical Dossier */}
          <button
            type="button"
            onClick={handleExportData}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-content-secondary" />
            <span>Export Patient Dossier</span>
          </button>

          <div className="my-1 border-t border-line/60" />

          {/* Archive / Unarchive */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onArchiveToggle(patient);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
              patient.isArchived
                ? "text-medical-sage hover:bg-medical-sage/15"
                : "text-amber-400 hover:bg-amber-950/30"
            }`}
          >
            {patient.isArchived ? (
              <>
                <ArchiveRestore className="w-3.5 h-3.5" />
                <span>Restore (Unarchive)</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5" />
                <span>Archive Patient Record</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

