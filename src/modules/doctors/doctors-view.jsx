"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { fetchDoctors } from "@/services/doctorService";
import { DoctorFilterBar } from "./components/doctor-filter-bar";
import { DoctorTable } from "./components/doctor-table";
import { DoctorDetailModal } from "@/components/doctors/doctor-detail-modal";
import { AddDoctorModal } from "@/components/doctors/add-doctor-modal";
import { DoctorPatientsModal } from "./components/doctor-patients-modal";
import { DoctorDeleteDialog } from "@/components/doctors/doctor-delete-dialog";

export function DoctorsView() {
  const [doctors, setDoctors] = useState([]);
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
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
  const [statusFilter, setStatusFilter] = useState("active");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [patientsModalDoctor, setPatientsModalDoctor] = useState(null);
  const [deleteDialogDoctor, setDeleteDialogDoctor] = useState(null);
  const [actionBanner, setActionBanner] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const loadDoctors = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchDoctors({
          page,
          limit: 10,
          search: debouncedSearch,
          specialization: selectedSpecialty,
          status: statusFilter,
        });

        setDoctors(response.data || []);
        setPagination(
          response.pagination || {
            total: response.totalDoctors || 0,
            page: response.currentPage || 1,
            limit: response.limit || 10,
            totalPages: response.totalPages || 1,
          }
        );
      } catch (err) {
        console.error("Load doctors failed:", err);
        setError(err.message || "Failed to load doctors");
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, selectedSpecialty, statusFilter]
  );

  useEffect(() => {
    loadDoctors(1);
  }, [loadDoctors]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !isLoading) {
      loadDoctors(newPage);
    }
  };

  const handleOpenDeleteDialog = (doc) => {
    setDeleteDialogDoctor(doc);
  };

  const handleArchiveSuccess = (doc, newActiveStatus) => {
    if (selectedDoctor && selectedDoctor._id === doc._id) {
      setSelectedDoctor((prev) => ({ ...prev, isActive: newActiveStatus }));
    }
    setActionBanner({
      type: "success",
      message: newActiveStatus
        ? `Dr. ${doc.name} has been restored to active clinical practice.`
        : `Dr. ${doc.name} has been removed from active doctors and moved to Archived Doctors.`,
    });
    setTimeout(() => setActionBanner(null), 6000);
    loadDoctors(pagination.page);
  };

  return (
    <div className="space-y-[calc((18/375)*100vw)] lg:space-y-[calc((26/1920)*100vw)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((14/375)*100vw)] lg:gap-[calc((18/1920)*100vw)] pb-2 border-b border-line/60">
        <div>
          <h2 className="font-manrope text-[calc((22/375)*100vw)] lg:text-[calc((30/1920)*100vw)] font-extrabold tracking-tight text-content-primary">
            Doctor Registry & Management
          </h2>
          <p className="text-[calc((14/375)*100vw)] lg:text-[calc((16/1920)*100vw)] text-content-secondary mt-1 leading-relaxed">
            Register medical specialists, manage clinical chamber hours, and assign patient rosters.
          </p>
        </div>
        <div className="flex items-center gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)] shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadDoctors(pagination.page)}
            disabled={isLoading}
            className="h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
          >
            <RefreshCw
              className={`w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((21/1920)*100vw)] lg:h-[calc((21/1920)*100vw)] stroke-[2.4] shrink-0 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
          >
            <Plus className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] stroke-[2.6] shrink-0" />
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionBanner && (
        <div className="p-[calc((12/375)*100vw)] lg:p-[calc((16/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
            <CheckCircle2 className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] text-emerald-600 shrink-0" />
            <span>{actionBanner.message}</span>
          </div>
          {actionBanner.message.includes("Archived Doctors") && statusFilter !== "archived" && (
            <button
              onClick={() => setStatusFilter("archived")}
              className="text-blue-600 underline font-semibold hover:text-blue-800 cursor-pointer ml-3 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)]"
            >
              View Archived Doctors &rarr;
            </button>
          )}
        </div>
      )}

      {/* Main Container Card */}
      <Card className="overflow-hidden">
        {/* Title Header */}
        <CardHeader className="p-[calc((16/375)*100vw)] lg:p-[calc((27/1920)*100vw)] pb-4 border-b border-line/60">
          <div className="space-y-1">
            <CardTitle className="text-[calc((18/375)*100vw)] lg:text-[calc((20/1920)*100vw)]">Registered Medical Specialists</CardTitle>
            <CardDescription className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)]">
              Search by doctor name or hospital, filter by clinical specialty, or click &ldquo;Patients&rdquo; to manage assigned cases.
            </CardDescription>
          </div>
        </CardHeader>

        {/* Filter Toolbar Section */}
        <div className="p-[calc((16/375)*100vw)] lg:p-[calc((27/1920)*100vw)] py-3.5 border-b border-line/60 bg-surface-elevated/20">
          <DoctorFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Content Section */}
        <CardContent className="p-[calc((16/375)*100vw)] lg:p-[calc((27/1920)*100vw)] pt-0">
          {error && (
            <div className="my-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDoctors(pagination.page)}
                className="h-8 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] border-red-300 text-red-700 hover:bg-red-100/50"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="pt-4">
            <DoctorTable
              doctors={doctors}
              isLoading={isLoading}
              onViewDetails={(doc) => {
                setSelectedDoctor(doc);
                setIsDetailModalOpen(true);
              }}
              onViewPatients={(doc) => {
                setPatientsModalDoctor(doc);
              }}
              onToggleArchive={handleOpenDeleteDialog}
              onAddNew={() => setIsAddModalOpen(true)}
            />
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-4 border-t border-line/60 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary">
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
                doctors
              </div>

              <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
                >
                  <ChevronLeft
                    strokeWidth={2.8}
                    className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] shrink-0"
                  />
                  <span>Previous</span>
                </Button>

                <span className="px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] py-[calc((6/375)*100vw)] lg:py-[calc((6/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-content-primary bg-surface-elevated rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-line">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="h-[calc((32/375)*100vw)] lg:h-[calc((34/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight
                    strokeWidth={2.8}
                    className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] shrink-0"
                  />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor Details Modal */}
      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDoctor(null);
        }}
        onToggleStatus={() => {
          if (selectedDoctor) {
            handleOpenDeleteDialog(selectedDoctor);
          }
        }}
      />

      {/* Add Doctor Modal */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => loadDoctors(1)}
      />

      {/* Doctor Patients Modal */}
      <DoctorPatientsModal
        doctor={patientsModalDoctor}
        isOpen={!!patientsModalDoctor}
        onClose={() => setPatientsModalDoctor(null)}
        onPatientCountChange={() => loadDoctors(pagination.page)}
      />

      {/* Doctor Delete & Archive Confirmation Dialog */}
      <DoctorDeleteDialog
        doctor={deleteDialogDoctor}
        isOpen={!!deleteDialogDoctor}
        onClose={() => setDeleteDialogDoctor(null)}
        onSuccess={handleArchiveSuccess}
      />
    </div>
  );
}
