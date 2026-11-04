"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Stethoscope,
  Users,
  CalendarCheck,
  Building2,
  Search,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
} from "lucide-react";
import { fetchDoctors, archiveDoctor } from "@/services/doctorService";
import { DoctorDetailModal } from "@/components/doctors/doctor-detail-modal";
import { AddDoctorModal } from "@/components/doctors/add-doctor-modal";

const FILTER_SPECIALTIES = [
  "All",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Internal Medicine",
  "General Surgery",
];

export default function DashboardPage() {
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
  const [isTogglingArchive, setIsTogglingArchive] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadDoctors = useCallback(async (page = 1) => {
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
      setError(err.message || "Failed to load doctors from backend");
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedSpecialty, statusFilter]);

  useEffect(() => {
    loadDoctors(1);
  }, [loadDoctors]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !isLoading) {
      loadDoctors(newPage);
    }
  };

  const handleToggleArchive = async (id, nextStatus) => {
    setIsTogglingArchive(true);
    try {
      await archiveDoctor(id, nextStatus);
      if (selectedDoctor && selectedDoctor._id === id) {
        setSelectedDoctor((prev) => ({ ...prev, isActive: nextStatus }));
      }
      loadDoctors(pagination.page);
    } catch (err) {
      alert(err.message || "Failed to update doctor status");
    } finally {
      setIsTogglingArchive(false);
    }
  };

  const distinctSpecialtiesCount = useMemo(() => {
    if (!doctors.length) return 0;
    const unique = new Set(doctors.map((d) => d.specialization).filter(Boolean));
    return unique.size;
  }, [doctors]);

  return (
    <DashboardLayout title="Operations Overview">
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="font-manrope text-2xl md:text-3xl font-bold tracking-tight text-content-primary">
            Healthcare Operations
          </h2>
          <p className="text-sm text-content-secondary mt-1">
            Real-time management for clinical staff, chambers, and schedules.
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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Active Doctors (API live) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-content-secondary">
              Total Doctors
            </CardTitle>
            <div className="p-2 rounded-md bg-medical-blue/15 text-medical-blue">
              <Stethoscope className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-manrope text-2xl font-bold text-content-primary">
              {isLoading ? "--" : pagination.total}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-medical-sage">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-medical-sage" />
              <span>
                {pagination.total > 0
                  ? "Live API synchronized"
                  : "Database verified empty"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Clinical Specialties (API live) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-content-secondary">
              Clinical Specialties
            </CardTitle>
            <div className="p-2 rounded-md bg-medical-sage/15 text-medical-sage">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-manrope text-2xl font-bold text-content-primary">
              {isLoading ? "--" : distinctSpecialtiesCount}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-content-secondary">
              <span>Active in current roster</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Scheduled Today (Honest unavailable state) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-content-secondary">
              Scheduled Today
            </CardTitle>
            <div className="p-2 rounded-md bg-surface-elevated text-content-muted">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-manrope text-2xl font-bold text-content-muted">
              --
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-content-muted">
              <span>Chamber scheduling unlinked</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Tracked Consultations (Honest unavailable state) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-content-secondary">
              Tracked Consultations
            </CardTitle>
            <div className="p-2 rounded-md bg-surface-elevated text-content-muted">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-manrope text-2xl font-bold text-content-muted">
              --
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-content-muted">
              <span>Consultation module unlinked</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Roster & Schedule Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle>Doctor Roster & Availability</CardTitle>
              <CardDescription>
                Overview of verified medical specialists, chambers, and weekly schedules.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-content-disabled" />
                <Input
                  type="text"
                  placeholder="Search doctor or hospital..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs"
                />
              </div>

              {/* Status filter dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-line bg-surface px-3 py-1 text-xs text-content-primary focus:outline-none focus:ring-2 focus:ring-medical-blue"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="archived">Archived Only</option>
              </select>
            </div>
          </div>

          {/* Specialization Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            {FILTER_SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-150 border ${
                    isSelected
                      ? "bg-medical-blue text-canvas border-medical-blue font-semibold"
                      : "bg-surface text-content-secondary border-line hover:bg-surface-hover hover:text-content-primary"
                  }`}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent>
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDoctors(pagination.page)}
                className="h-7 text-xs border-red-700 hover:bg-red-900/30 text-red-200"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Hospital / Chamber</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Available Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="animate-pulse">
                    <TableCell>
                      <div className="h-4 w-32 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-20 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-28 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-12 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-14 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-16 bg-surface-elevated rounded" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-6 w-16 bg-surface-elevated rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : doctors.length > 0 ? (
                doctors.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell className="font-medium text-content-primary">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-medical-blue/15 text-medical-blue flex items-center justify-center font-manrope font-semibold text-xs shrink-0">
                          {doc.name ? doc.name.replace("Dr. ", "").charAt(0) : "D"}
                        </div>
                        <div>
                          <div className="font-semibold">{doc.name}</div>
                          {doc.qualifications && (
                            <div className="text-[11px] text-content-muted truncate max-w-[180px]">
                              {doc.qualifications}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{doc.specialization}</Badge>
                    </TableCell>
                    <TableCell className="text-content-secondary text-xs">
                      {doc.hospital || "Not assigned"}
                    </TableCell>
                    <TableCell className="text-content-secondary text-xs">
                      {doc.experienceYears ? `${doc.experienceYears} yrs` : "--"}
                    </TableCell>
                    <TableCell className="font-semibold text-content-primary text-xs">
                      {doc.consultationFee !== undefined && doc.consultationFee !== null
                        ? `$${doc.consultationFee}`
                        : "--"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[160px]">
                        {doc.availableDays && doc.availableDays.length > 0 ? (
                          doc.availableDays.map((d) => (
                            <span
                              key={d}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated text-content-secondary border border-line"
                            >
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-content-muted">--</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.isActive ? "active" : "archived"}>
                        {doc.isActive ? "Active" : "Archived"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setIsDetailModalOpen(true);
                        }}
                        className="h-7 px-2.5 text-xs text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-medical-blue" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-content-secondary"
                  >
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="p-3 rounded-full bg-surface-elevated text-content-muted border border-line">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-manrope text-base font-semibold text-content-primary">
                          No doctors found
                        </p>
                        <p className="text-xs text-content-secondary mt-1">
                          {debouncedSearch || selectedSpecialty !== "All"
                            ? "No doctor profiles match your current search criteria."
                            : "No doctor records have been registered in the system yet."}
                        </p>
                      </div>
                      <div className="pt-2">
                        {debouncedSearch || selectedSpecialty !== "All" ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSearchQuery("");
                              setSelectedSpecialty("All");
                            }}
                          >
                            Clear Filters
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setIsAddModalOpen(true)}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" />
                            Register First Doctor
                          </Button>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
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

      {/* Modals */}
      <DoctorDetailModal
        doctor={selectedDoctor}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDoctor(null);
        }}
        onToggleStatus={handleToggleArchive}
        isToggling={isTogglingArchive}
      />

      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          loadDoctors(1);
        }}
      />
    </DashboardLayout>
  );
}
