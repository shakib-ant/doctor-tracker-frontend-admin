"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Archive, ArchiveRestore, Loader2 } from "lucide-react";
import { archivePatient } from "@/services/patientService";

export function PatientDeleteDialog({ patient, isOpen, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !patient || !mounted) return null;

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

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-[calc((12/375)*100vw)] lg:p-[calc((24/1920)*100vw)] bg-black/80 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((340/375)*100vw)] lg:max-w-[calc((460/1920)*100vw)] bg-surface border border-line rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] shadow-2xl p-[calc((16/375)*100vw)] lg:p-[calc((24/1920)*100vw)] space-y-[calc((12/375)*100vw)] lg:space-y-[calc((16/1920)*100vw)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
          <div
            className={`p-[calc((8/375)*100vw)] lg:p-[calc((10/1920)*100vw)] rounded-full border shrink-0 ${
              isCurrentlyArchived
                ? "bg-medical-sage/20 border-medical-sage/40 text-medical-sage"
                : "bg-amber-950/40 border-amber-800 text-amber-400"
            }`}
          >
            {isCurrentlyArchived ? (
              <ArchiveRestore className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
            ) : (
              <Archive className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)]" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-manrope text-[calc((14/375)*100vw)] lg:text-[calc((16/1920)*100vw)] font-bold text-content-primary">
              {isCurrentlyArchived ? "Restore Patient Record" : "Archive Patient Record"}
            </h3>
            <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-content-secondary leading-relaxed">
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
          <p className="text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] text-red-400 bg-red-950/30 p-2.5 rounded border border-red-800">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-[calc((8/375)*100vw)] pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant={isCurrentlyArchived ? "default" : "outline"}
            size="sm"
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer ${
              !isCurrentlyArchived
                ? "border-amber-700 text-amber-300 hover:bg-amber-950/50 hover:text-amber-200"
                : ""
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] animate-spin mr-1.5" />
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
    </div>,
    document.body
  );
}
