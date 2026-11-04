"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { archivePatient } from "@/services/patientService";

export function PatientDeleteDialog({ patient, isOpen, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !patient) return null;

  const isCurrentlyArchived = !!patient.isArchived;

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Toggle archive state
      await archivePatient(patient._id, !isCurrentlyArchived);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update patient archive status");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface border border-line rounded-xl shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-full border shrink-0 ${
              isCurrentlyArchived
                ? "bg-medical-sage/20 border-medical-sage/40 text-medical-sage"
                : "bg-amber-950/40 border-amber-800 text-amber-400"
            }`}
          >
            {isCurrentlyArchived ? (
              <ArchiveRestore className="w-5 h-5" />
            ) : (
              <Archive className="w-5 h-5" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-manrope text-base font-bold text-content-primary">
              {isCurrentlyArchived ? "Restore Patient Record" : "Archive Patient Record"}
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              {isCurrentlyArchived ? (
                <>
                  Restore clinical record for{" "}
                  <span className="font-semibold text-content-primary">
                    {patient.name}
                  </span>
                  ? This will move the patient back to the active care registry.
                </>
              ) : (
                <>
                  Are you sure you want to archive{" "}
                  <span className="font-semibold text-content-primary">
                    {patient.name}
                  </span>
                  ? The medical record will be safely preserved in database archives and can be restored anytime without data loss.
                </>
              )}
            </p>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded border border-red-800">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={isCurrentlyArchived ? "default" : "outline"}
            size="sm"
            onClick={handleConfirm}
            disabled={isProcessing}
            className={
              !isCurrentlyArchived
                ? "border-amber-700 text-amber-300 hover:bg-amber-950/50 hover:text-amber-200"
                : ""
            }
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Processing...
              </>
            ) : isCurrentlyArchived ? (
              "Yes, Restore Record"
            ) : (
              "Yes, Archive Record"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
