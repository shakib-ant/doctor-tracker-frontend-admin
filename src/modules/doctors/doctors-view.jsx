"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, RefreshCw, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { fetchDoctors, archiveDoctor } from "@/services/doctorService";
import { DoctorFilterBar } from "./components/doctor-filter-bar";
import { DoctorTable } from "./components/doctor-table";
import { DoctorDetailModal } from "@/components/doctors/doctor-detail-modal";
import { AddDoctorModal } from "@/components/doctors/add-doctor-modal";
import { DoctorPatientsModal } from "./components/doctor-patients-modal";

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
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [patientsModalDoctor, setPatientsModalDoctor] = useState(null);

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

  const handleToggleArchive = async (id, nextStatus) => {
    try {
      await archiveDoctor(id, nextStatus);
      if (selectedDoctor && selectedDoctor._id === id) {
        setSelectedDoctor((prev) => ({ ...prev, isActive: nextStatus }));
      }
      loadDoctors(pagination.page);
    } catch (err) {
      alert(err.message || "Failed to update doctor status");
    }
  };

  return (
    <div className="space-y-[calc((16/375)*100vw)] lg:space-y-[calc((24/1920)*100vw)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((12/375)*100vw)] lg:gap-[calc((16/1920)*100vw)] pb-2 border-b border-line/60">
        <div>
          <h2 className="font-manrope text-[calc((20/375)*100vw)] lg:text-[calc((28/1920)*100vw)] font-extrabold tracking-tight text-content-primary">
            Doctor Registry & Management
          </h2>
          <p className="text-[calc((12/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary mt-1 leading-relaxed">
            Register medical specialists, manage clinical chamber hours, and assign patient rosters.
          </p>
        </div>
        <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)] shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadDoctors(pagination.page)}
            disabled={isLoading}
            className="h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
          >
            <RefreshCw
              className={`w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] mr-[calc((6/375)*100vw)] lg:mr-[calc((6/1920)*100vw)] ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-[calc((34/375)*100vw)] lg:h-[calc((36/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((14/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
          >
            <Plus className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] lg:w-[calc((16/1920)*100vw)] lg:h-[calc((16/1920)*100vw)] mr-[calc((6/375)*100vw)] lg:mr-[calc((6/1920)*100vw)]" />
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Main Container Card */}
      <Card className="overflow-hidden">
        {/* Title Header */}
        <CardHeader className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pb-4 border-b border-line/60">
          <div className="space-y-1">
            <CardTitle className="text-[calc((16/375)*100vw)] lg:text-[calc((18/1920)*100vw)]">Registered Medical Specialists</CardTitle>
            <CardDescription className="text-[calc((12/375)*100vw)] lg:text-[calc((13/1920)*100vw)]">
              Search by doctor name or hospital, filter by clinical specialty, or click &ldquo;Patients&rdquo; to manage assigned cases.
            </CardDescription>
          </div>
        </CardHeader>

        {/* Filter Toolbar Section */}
        <div className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] py-3.5 border-b border-line/60 bg-surface-elevated/20">
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
        <CardContent className="p-[calc((14/375)*100vw)] lg:p-[calc((24/1920)*100vw)] pt-0">
          {error && (
            <div className="my-4 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDoctors(pagination.page)}
                className="h-7 text-xs border-red-700 text-red-200"
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
              onToggleArchive={handleToggleArchive}
              onAddNew={() => setIsAddModalOpen(true)}
            />
          </div>

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 mt-4 border-t border-line/60 text-xs text-content-secondary">
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

              <div className="flex items-center gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="h-[calc((30/375)*100vw)] lg:h-[calc((32/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] cursor-pointer"
                >
                  <ChevronLeft className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] mr-[calc((4/375)*100vw)] lg:mr-[calc((4/1920)*100vw)]" />
                  Previous
                </Button>

                <span className="px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-[calc((4/375)*100vw)] lg:py-[calc((4/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] font-semibold text-content-primary bg-surface-elevated rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] border border-line">
                  {pagination.page} / {pagination.totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="h-[calc((30/375)*100vw)] lg:h-[calc((32/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] ml-[calc((4/375)*100vw)] lg:mr-[calc((4/1920)*100vw)]" />
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
        onToggleStatus={handleToggleArchive}
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
    </div>
  );
}
