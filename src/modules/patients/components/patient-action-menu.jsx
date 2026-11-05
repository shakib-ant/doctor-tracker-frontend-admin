"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [menuCoords, setMenuCoords] = useState({ top: 0, bottom: undefined, right: 0, openUp: false });
  const [isClient, setIsClient] = useState(false);

  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateCoordinates = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Only flip upwards if there is insufficient space below (< 270px) AND more room above
    const openUp = spaceBelow < 270 && spaceAbove > spaceBelow;

    // Right-align with the right edge of the 3-dot button
    let right = window.innerWidth - rect.right;
    if (right < 8) right = 8;

    setMenuCoords({
      top: openUp ? undefined : rect.bottom + 4,
      bottom: openUp ? window.innerHeight - rect.top + 4 : undefined,
      right,
      openUp,
    });
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen) {
      updateCoordinates();
      setIsOpen(true);
      setShowStatusSubmenu(false);
    } else {
      setIsOpen(false);
      setShowStatusSubmenu(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
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

    const handleScrollOrResize = () => {
      setIsOpen(false);
      setShowStatusSubmenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
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

  const menuContent = isOpen && isClient && (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: menuCoords.top !== undefined ? `${menuCoords.top}px` : undefined,
        bottom: menuCoords.bottom !== undefined ? `${menuCoords.bottom}px` : undefined,
        right: `${menuCoords.right}px`,
        zIndex: 99999,
      }}
      className={`w-[calc((240/375)*100vw)] lg:w-[calc((260/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] border border-[#384A5C] bg-[#18232F]/98 p-[calc((7/375)*100vw)] lg:p-[calc((8/1920)*100vw)] shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] select-none animate-in fade-in zoom-in-95 duration-150 ${
        menuCoords.openUp ? "origin-bottom-right" : "origin-top-right"
      }`}
    >
      {/* Patient Mini Title Banner */}
      <div className="px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((7/375)*100vw)] lg:py-[calc((8/1920)*100vw)] mb-1 border-b border-line/60 flex items-center justify-between text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted">
        <span className="font-semibold text-content-primary truncate">{patient.name}</span>
        <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] uppercase font-bold text-medical-blue">Actions</span>
      </div>

      {/* View Details */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          onViewDetails(patient);
        }}
        className="w-full flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
      >
        <FileText className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-medical-blue shrink-0 stroke-[2.2]" />
        <span>View Clinical Chart</span>
      </button>

      {/* Edit */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          onEdit(patient);
        }}
        className="w-full flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
      >
        <Edit2 className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-content-secondary shrink-0 stroke-[2.2]" />
        <span>Edit Information</span>
      </button>

      {/* Quick Care Status Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowStatusSubmenu(!showStatusSubmenu)}
          className="w-full flex items-center justify-between px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
            <Activity className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-medical-sage shrink-0 stroke-[2.2]" />
            <span>Update Care Status</span>
          </div>
          <ChevronRight
            className={`w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-content-muted transition-transform shrink-0 stroke-[2.2] ${
              showStatusSubmenu ? "rotate-90 text-medical-sage" : ""
            }`}
          />
        </button>

        {showStatusSubmenu && (
          <div className="my-1 ml-2 pl-2 border-l border-medical-sage/40 space-y-0.5 animate-in fade-in duration-100">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowStatusSubmenu(false);
                  onStatusChange(patient, opt.value);
                }}
                className={`w-full flex items-center justify-between px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-[calc((7/375)*100vw)] lg:py-[calc((8/1920)*100vw)] rounded-md hover:bg-surface-elevated transition-colors text-left cursor-pointer ${
                  patient.status === opt.value
                    ? "bg-surface-elevated font-semibold text-content-primary"
                    : "text-content-secondary"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className={`w-[calc((8/375)*100vw)] h-[calc((8/375)*100vw)] lg:w-[calc((8/1920)*100vw)] lg:h-[calc((8/1920)*100vw)] rounded-full shrink-0 ${opt.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                  />
                  {opt.label}
                </span>
                {patient.status === opt.value && (
                  <Check className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] text-medical-blue shrink-0 ml-1 stroke-[2.5]" />
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
        className="w-full flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
      >
        <Printer className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-content-secondary shrink-0 stroke-[2.2]" />
        <span>Print Clinical Record</span>
      </button>

      {/* Export Medical Dossier */}
      <button
        type="button"
        onClick={handleExportData}
        className="w-full flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-content-primary hover:bg-surface-elevated text-left transition-colors cursor-pointer"
      >
        <Download className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] text-content-secondary shrink-0 stroke-[2.2]" />
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
        className={`w-full flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] text-left transition-colors cursor-pointer ${
          patient.isArchived
            ? "text-medical-sage hover:bg-medical-sage/15"
            : "text-amber-400 hover:bg-amber-950/30"
        }`}
      >
        {patient.isArchived ? (
          <>
            <ArchiveRestore className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] shrink-0 stroke-[2.2]" />
            <span>Restore (Unarchive)</span>
          </>
        ) : (
          <>
            <Archive className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((17/1920)*100vw)] lg:h-[calc((17/1920)*100vw)] shrink-0 stroke-[2.2]" />
            <span>Archive Patient Record</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="inline-block text-left select-none">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className={`h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] p-0 rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] transition-colors cursor-pointer flex items-center justify-center ${
          isOpen
            ? "bg-surface-elevated text-content-primary ring-1 ring-medical-blue"
            : "text-content-secondary hover:text-content-primary hover:bg-surface-elevated/80"
        }`}
        title="More clinical actions"
      >
        <MoreHorizontal className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] stroke-[2.2]" />
      </Button>

      {isClient && typeof document !== "undefined" && createPortal(menuContent, document.body)}
    </div>
  );
}
