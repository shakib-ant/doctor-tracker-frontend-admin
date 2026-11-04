"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Users, Calendar, Plus } from "lucide-react";
import { getStatusBadgeVariant, formatDate } from "../utils/patientUtils";
import { PatientActionMenu } from "./patient-action-menu";

export function PatientTable({
  patients = [],
  isLoading = false,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
  onAddNew,
}) {
  return (
    <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs sm:text-sm font-semibold">Patient Name</TableHead>
            <TableHead className="text-xs sm:text-sm font-semibold">Age / Gender</TableHead>
            <TableHead className="text-xs sm:text-sm font-semibold">Condition</TableHead>
            <TableHead className="text-xs sm:text-sm font-semibold">Assigned Doctor</TableHead>
            <TableHead className="text-xs sm:text-sm font-semibold">Admission Date</TableHead>
            <TableHead className="text-xs sm:text-sm font-semibold">Status</TableHead>
            <TableHead className="text-right text-xs sm:text-sm font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-14">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <div className="p-3.5 rounded-full bg-surface-elevated text-content-muted border border-line shadow-xs">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-manrope text-base sm:text-lg font-bold text-content-primary">
                      No patient records found
                    </p>
                    <p className="text-xs sm:text-sm text-content-secondary">
                      No patients match your current filter or date range.
                    </p>
                  </div>
                  {onAddNew && (
                    <Button variant="default" size="sm" onClick={onAddNew} className="mt-2">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Register Patient
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            patients.map((p) => (
              <TableRow key={p._id}>
                {/* Patient Name & Contact */}
                <TableCell className="font-medium text-content-primary">
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-content-primary whitespace-nowrap">
                      {p.name}
                    </div>
                    {p.phone && (
                      <div className="text-[11px] sm:text-xs text-content-muted whitespace-nowrap mt-0.5">
                        {p.phone}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Age & Gender */}
                <TableCell className="text-xs sm:text-sm text-content-secondary whitespace-nowrap">
                  {p.age} yrs &bull; {p.gender}
                </TableCell>

                {/* Condition */}
                <TableCell className="whitespace-nowrap">
                  <Badge variant="default" className="text-xs font-normal px-2 py-0.5">
                    {p.condition}
                  </Badge>
                </TableCell>

                {/* Assigned Doctor */}
                <TableCell className="text-xs sm:text-sm text-content-secondary whitespace-nowrap">
                  {p.doctor ? (
                    <div>
                      <div className="font-medium text-content-primary text-xs sm:text-sm">
                        {p.doctor.name}
                      </div>
                      <div className="text-[11px] sm:text-xs text-content-muted mt-0.5">
                        {p.doctor.specialization} &bull; {p.doctor.hospital || "Clinic"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-content-muted text-xs">Unassigned</span>
                  )}
                </TableCell>

                {/* Admission Date */}
                <TableCell className="text-xs sm:text-sm text-content-secondary whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-medical-sage shrink-0" />
                    <span>{formatDate(p.admissionDate || p.createdAt)}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={getStatusBadgeVariant(p.status)} className="text-xs px-2 py-0.5">
                      {p.status}
                    </Badge>
                    {p.isArchived && (
                      <Badge variant="warning" className="text-xs px-2 py-0.5">
                        Archived
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Actions: Direct Quick Actions + Real-world Clinical Action Menu */}
                <TableCell className="text-right whitespace-nowrap pr-3 sm:pr-4">
                  <div className="flex items-center justify-end gap-2 sm:gap-2.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails && onViewDetails(p)}
                      className="h-7 px-2.5 text-xs text-medical-blue hover:bg-surface-hover"
                      title="View clinical chart"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Chart
                    </Button>
                    <PatientActionMenu
                      patient={p}
                      onViewDetails={onViewDetails}
                      onEdit={onEdit}
                      onArchiveToggle={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
