"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { fetchPatients, updatePatient } from "@/services/patientService";
import { PatientFilterBar } from "./components/patient-filter-bar";
import { PatientTable } from "./components/patient-table";
import { PatientModal } from "./components/patient-modal";
import { PatientDeleteDialog } from "./components/patient-delete-dialog";
import { PatientDetailModal } from "./components/patient-detail-modal";

export function PatientsView() {
  const [patients, setPatients] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [archivedFilter, setArchivedFilter] = useState("active"); // "active" | "archived" | "all"

  const [modalState, setModalState] = useState({ isOpen: false, patient: null });
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, patient: null });
  const [detailPatient, setDetailPatient] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadPatients = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchPatients({
          page,
          limit: 10,
          search: debouncedSearch,
          condition: conditionFilter,
          status: statusFilter,
          startDate,
          endDate,
          archived: archivedFilter,
        });

        setPatients(response.data || []);
        setPagination(
          response.pagination || {
            total: response.data?.length || 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          }
        );
      } catch (err) {
        console.error("Load patients failed:", err);
        setError(err.message || "Failed to load patient records");
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, conditionFilter, statusFilter, startDate, endDate, archivedFilter]
  );

  useEffect(() => {
    loadPatients(1);
  }, [loadPatients]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !isLoading) {
      loadPatients(newPage);
    }
  };

  const handleStatusChange = async (patient, nextStatus) => {
    try {
      await updatePatient(patient._id, { status: nextStatus });
      loadPatients(pagination.page);
    } catch (err) {
      alert(err.message || "Failed to update patient care status");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setConditionFilter("All");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setArchivedFilter("active");
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    conditionFilter !== "All" ||
    statusFilter !== "All" ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    archivedFilter !== "active";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line/60">
        <div>
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-content-primary">
            Patient Management
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary mt-1 leading-relaxed">
            Track patient admissions, medical diagnoses, and assigned clinical specialists across hospital wards.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadPatients(pagination.page)}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setModalState({ isOpen: true, patient: null })}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Register Patient
          </Button>
        </div>
      </div>

      {/* Main Container Card */}
      <Card className="overflow-hidden">
        {/* Title Header */}
        <CardHeader className="p-4 sm:p-5 lg:p-6 pb-3 border-b border-line/60">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg">Registered Patient Records</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Search by patient name or condition, filter by date range, and update clinical status.
            </CardDescription>
          </div>
        </CardHeader>

        {/* Filter Toolbar Section */}
        <div className="p-4 sm:p-5 lg:p-6 py-3.5 border-b border-line/60 bg-surface-elevated/20">
          <PatientFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            conditionFilter={conditionFilter}
            onConditionChange={setConditionFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            archivedFilter={archivedFilter}
            onArchivedChange={setArchivedFilter}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Content Section */}
        <CardContent className="p-4 sm:p-5 lg:p-6 pt-0">
          {error && (
            <div className="my-4 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadPatients(pagination.page)}
                className="h-7 text-xs border-red-700 text-red-200"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="pt-4">
            <PatientTable
              patients={patients}
              isLoading={isLoading}
              onEdit={(p) => setModalState({ isOpen: true, patient: p })}
              onDelete={(p) => setDeleteDialogState({ isOpen: true, patient: p })}
              onViewDetails={(p) => setDetailPatient(p)}
              onStatusChange={handleStatusChange}
              onAddNew={() => setModalState({ isOpen: true, patient: null })}
            />
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-4 border-t border-line/60 text-xs text-content-secondary">
              <div>
                Showing{" "}
                <span className="font-semibold text-content-primary">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-content-primary">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-content-primary">
                  {pagination.total}
                </span>{" "}
                patients
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                <span className="px-3 py-1 text-xs font-semibold text-content-primary bg-surface-elevated rounded-md border border-line">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Add / Edit Modal */}
      <PatientModal
        patient={modalState.patient}
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, patient: null })}
        onSuccess={() => loadPatients(pagination.page)}
      />

      {/* Delete / Archive Confirmation Dialog */}
      <PatientDeleteDialog
        patient={deleteDialogState.patient}
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, patient: null })}
        onSuccess={() => loadPatients(pagination.page)}
      />

      {/* Patient Clinical Dossier Detail Modal */}
      <PatientDetailModal
        patient={detailPatient}
        isOpen={!!detailPatient}
        onClose={() => setDetailPatient(null)}
        onEdit={(p) => setModalState({ isOpen: true, patient: p })}
        onArchive={(p) => setDeleteDialogState({ isOpen: true, patient: p })}
      />
    </div>
  );
}
