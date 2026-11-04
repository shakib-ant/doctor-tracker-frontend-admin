"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { deletePatient } from "@/services/patientService";

export function PatientDeleteDialog({ patient, isOpen, onClose, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !patient) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await deletePatient(patient._id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete patient");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-surface border border-line rounded-xl shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-red-950/50 border border-red-800 text-red-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-manrope text-base font-bold text-content-primary">
              Delete Patient Record
            </h3>
            <p className="text-xs text-content-secondary leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-content-primary">
                {patient.name}
              </span>
              ? This action cannot be undone.
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
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Record"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

