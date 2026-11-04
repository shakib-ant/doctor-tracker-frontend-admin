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
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h2 className="font-manrope text-2xl md:text-3xl font-bold tracking-tight text-content-primary">
            Doctor Registry & Management
          </h2>
          <p className="text-sm text-content-secondary mt-1">
            Register USA specialists, manage clinical assignments, and review patient rosters.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadDoctors(pagination.page)}
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
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Registered Medical Specialists</CardTitle>
          <CardDescription>
            Search, filter by clinical specialty, or click &ldquo;Patients&rdquo; to view and manage assigned cases.
          </CardDescription>

          <DoctorFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedSpecialty={selectedSpecialty}
            onSpecialtyChange={setSelectedSpecialty}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between">
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
            onAddNew={() => setIsAddModalOpen(true)}
          />

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-line text-xs text-content-secondary">
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

              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="h-8 px-2.5 text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                <span className="px-2.5 py-1 text-xs font-medium text-content-primary">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="h-8 px-2.5 text-xs"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
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

