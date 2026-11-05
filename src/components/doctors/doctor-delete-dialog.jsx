"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Trash2, ArchiveRestore, Loader2 } from "lucide-react";
import { archiveDoctor } from "@/services/doctorService";

export function DoctorDeleteDialog({ doctor, isOpen, onClose, onSuccess }) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !doctor || !mounted) return null;

  const isCurrentlyActive = doctor.isActive !== false;

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await archiveDoctor(doctor._id, !isCurrentlyActive);
      onSuccess(doctor, !isCurrentlyActive);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update doctor archive status");
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-[calc((14/375)*100vw)] lg:p-[calc((27/1920)*100vw)] bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[calc((365/375)*100vw)] lg:max-w-[calc((480/1920)*100vw)] bg-white border border-slate-200/90 rounded-[calc((18/375)*100vw)] lg:rounded-[calc((22/1920)*100vw)] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] p-[calc((18/375)*100vw)] lg:p-[calc((27/1920)*100vw)] space-y-[calc((14/375)*100vw)] lg:space-y-[calc((18/1920)*100vw)] animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)]">
          <div
            className={`p-[calc((10/375)*100vw)] lg:p-[calc((12/1920)*100vw)] rounded-full border shrink-0 ${
              isCurrentlyActive
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-emerald-50 border-emerald-200 text-emerald-600"
            }`}
          >
            {isCurrentlyActive ? (
              <Trash2 className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
            ) : (
              <ArchiveRestore className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.2]" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-manrope text-[calc((16/375)*100vw)] lg:text-[calc((18/1920)*100vw)] font-bold text-content-primary">
              {isCurrentlyActive ? "Remove / Archive Doctor" : "Restore Doctor to Active Registry"}
            </h3>
            <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary leading-relaxed">
              {isCurrentlyActive ? (
                <>
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-content-primary">
                    {doctor.name}
                  </span>
                  ? This doctor will be removed from the active registry and moved to{" "}
                  <span className="text-amber-300 font-semibold">Archived Doctors</span>. All patient records and clinical history will be safely preserved.
                </>
              ) : (
                <>
                  Restore clinical profile for{" "}
                  <span className="font-semibold text-content-primary">
                    {doctor.name}
                  </span>
                  ? This will return the specialist back to the active medical roster for patient assignment.
                </>
              )}
            </p>
          </div>
        </div>

        {error && (
          <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-red-400 bg-red-950/30 p-2.5 rounded border border-red-800">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-[calc((10/375)*100vw)] pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant={isCurrentlyActive ? "destructive" : "default"}
            size="sm"
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((16/375)*100vw)] lg:px-[calc((18/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer ${
              !isCurrentlyActive ? "bg-medical-sage text-canvas hover:bg-medical-sage/90" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-[calc((15/375)*100vw)] h-[calc((15/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] animate-spin" />
                Processing...
              </>
            ) : isCurrentlyActive ? (
              "Yes, Remove Doctor"
            ) : (
              "Yes, Restore Doctor"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

