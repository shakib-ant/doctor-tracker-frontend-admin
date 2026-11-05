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
    <div className="overflow-x-auto no-scrollbar rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 border-b border-slate-200/80 hover:bg-slate-50/70">
            <TableHead className="py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Patient Name</TableHead>
            <TableHead className="py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Age / Gender</TableHead>
            <TableHead className="py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Condition</TableHead>
            <TableHead className="py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Assigned Doctor</TableHead>
            <TableHead className="py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Admission Date</TableHead>
            <TableHead className="py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-right py-[calc((10/375)*100vw)] px-[calc((10/375)*100vw)] sm:py-3.5 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider">Actions</TableHead>
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
                  <div className="flex justify-end gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
                    <Skeleton className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]" />
                    <Skeleton className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-14">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <div className="p-3.5 rounded-full bg-surface-elevated text-content-muted border border-line shadow-xs">
                    <Users className="w-[calc((24/375)*100vw)] h-[calc((24/375)*100vw)] lg:w-[calc((28/1920)*100vw)] lg:h-[calc((28/1920)*100vw)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-manrope text-[calc((17/375)*100vw)] lg:text-[calc((19/1920)*100vw)] font-bold text-content-primary">
                      No patient records found
                    </p>
                    <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary">
                      No patients match your current filter or date range.
                    </p>
                  </div>
                  {onAddNew && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={onAddNew}
                      className="mt-2 h-[calc((34/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((12/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
                    >
                      <Plus className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)]" />
                      Register Patient
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            patients.map((p, idx) => (
              <TableRow
                key={p._id}
                className="hover:bg-blue-50/40 transition-colors duration-150 animate-in fade-in slide-in-from-bottom-1"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Patient Name & Avatar */}
                <TableCell className="font-medium text-content-primary py-2.5 sm:py-3.5 px-3 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)]">
                  <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-[calc((12/1920)*100vw)]">
                    <div className="w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] sm:w-9 sm:h-9 lg:w-[calc((40/1920)*100vw)] lg:h-[calc((40/1920)*100vw)] rounded-full bg-slate-100 text-blue-700 font-bold flex items-center justify-center text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((14/1920)*100vw)] shrink-0 border border-slate-200 shadow-xs font-manrope">
                      {p.name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "PT"}
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] font-bold text-slate-900 whitespace-nowrap leading-tight">
                        {p.name}
                      </div>
                      {p.phone && (
                        <div className="text-[calc((11/375)*100vw)] sm:text-xs text-slate-400 whitespace-nowrap leading-tight mt-0.5">
                          {p.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Age & Gender */}
                <TableCell className="py-2.5 sm:py-3.5 px-3 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] text-content-secondary whitespace-nowrap">
                  {p.age} yrs &bull; {p.gender}
                </TableCell>

                {/* Condition */}
                <TableCell className="py-2.5 sm:py-3.5 px-3 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] whitespace-nowrap">
                  <Badge variant="default" className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] font-normal px-2.5 py-0.5 rounded-full leading-none">
                    {p.condition}
                  </Badge>
                </TableCell>

                {/* Assigned Doctor */}
                <TableCell className="py-2.5 sm:py-3.5 px-3 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] text-content-secondary whitespace-nowrap">
                  {p.doctor ? (
                    <div className="flex flex-col justify-center">
                      <div className="font-medium text-content-primary text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((15/1920)*100vw)] leading-tight">
                        {p.doctor.name}
                      </div>
                      <div className="text-[calc((11/375)*100vw)] sm:text-xs text-content-muted leading-tight mt-0.5">
                        {p.doctor.specialization} &bull; {p.doctor.hospital || "Clinic"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-content-muted text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)]">Unassigned</span>
                  )}
                </TableCell>

                {/* Admission Date */}
                <TableCell className="py-2.5 sm:py-3.5 px-3 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] text-content-secondary whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-medical-sage shrink-0" />
                    <span>{formatDate(p.admissionDate || p.createdAt)}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-2.5 sm:py-3.5 px-3 sm:px-4 lg:py-[calc((14/1920)*100vw)] lg:px-[calc((16/1920)*100vw)] whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={getStatusBadgeVariant(p.status)} className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] px-2.5 py-0.5 rounded-full leading-none">
                      {p.status}
                    </Badge>
                    {p.isArchived && (
                      <Badge variant="warning" className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] px-2.5 py-0.5 rounded-full leading-none">
                        Archived
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Actions: Direct Quick Actions + Real-world Clinical Action Menu */}
                <TableCell className="text-right whitespace-nowrap py-2.5 sm:py-3.5 pr-3 sm:pr-4 lg:pr-[calc((18/1920)*100vw)]">
                  <div className="flex items-center justify-end gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails && onViewDetails(p)}
                      className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] text-medical-blue hover:bg-surface-hover rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
                      title="View clinical chart"
                      aria-label="View clinical chart"
                    >
                      <Eye className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2]" />
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
