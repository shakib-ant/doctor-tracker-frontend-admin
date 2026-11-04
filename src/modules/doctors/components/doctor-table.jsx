"use client";

import React from "react";
import Image from "next/image";
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
import { Users, Eye, Stethoscope, Plus, Archive, ArchiveRestore } from "lucide-react";
import { getDoctorInitials } from "../utils/doctorUtils";

export function DoctorTable({
  doctors = [],
  isLoading = false,
  onViewDetails,
  onViewPatients,
  onToggleArchive,
  onAddNew,
}) {
  return (
    <div className="overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Hospital / Chamber</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Available Days</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-6 rounded" />
                    <Skeleton className="h-4 w-6 rounded" />
                    <Skeleton className="h-4 w-6 rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Skeleton className="h-7 w-16 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-14">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <div className="p-3.5 rounded-full bg-surface-elevated text-content-muted border border-line shadow-xs">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-manrope text-base font-bold text-content-primary">
                      No doctors found
                    </p>
                    <p className="text-xs text-content-secondary">
                      No doctor records match your current criteria.
                    </p>
                  </div>
                  {onAddNew && (
                    <Button variant="default" size="sm" onClick={onAddNew} className="mt-2">
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add New Doctor
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            doctors.map((doc) => (
              <TableRow key={doc._id}>
                {/* Doctor Name & Image */}
                <TableCell className="font-medium text-content-primary">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    {doc.image ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-line shrink-0 relative bg-surface-elevated">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-medical-blue/20 text-medical-blue flex items-center justify-center font-manrope font-bold text-[9px] sm:text-xs shrink-0 border border-medical-blue/30">
                        {getDoctorInitials(doc.name)}
                      </div>
                    )}
                    <div>
                      <div className="text-[11px] sm:text-sm font-semibold text-content-primary whitespace-nowrap">
                        {doc.name}
                      </div>
                      <div className="text-[9px] sm:text-[11px] text-content-muted truncate max-w-[130px] sm:max-w-[170px]">
                        {doc.qualifications || doc.designation || "Physician"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Specialization */}
                <TableCell>
                  <Badge variant="default" className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                    {doc.specialization}
                  </Badge>
                </TableCell>

                {/* Hospital */}
                <TableCell className="text-[10px] sm:text-xs text-content-secondary whitespace-nowrap">
                  {doc.hospital || "Not assigned"}
                </TableCell>

                {/* Contact */}
                <TableCell className="text-[10px] sm:text-xs text-content-secondary whitespace-nowrap">
                  <div>{doc.phone || "--"}</div>
                  <div className="text-[9px] sm:text-[10px] text-content-muted truncate max-w-[110px] sm:max-w-[140px]">
                    {doc.email || ""}
                  </div>
                </TableCell>

                {/* Fee */}
                <TableCell className="whitespace-nowrap">
                  <div className="text-[10px] sm:text-xs font-semibold text-content-primary font-manrope">
                    {doc.consultationFee !== undefined && doc.consultationFee !== null
                      ? `$${doc.consultationFee}`
                      : "--"}
                  </div>
                  <div className="text-[8px] sm:text-[10px] text-content-muted">per consult</div>
                </TableCell>

                {/* Available Days */}
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-[120px] sm:max-w-[140px]">
                    {doc.availableDays && doc.availableDays.length > 0 ? (
                      doc.availableDays.map((d) => (
                        <span
                          key={d}
                          title={d}
                          className="px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-medium bg-surface-elevated text-content-secondary border border-line"
                        >
                          {d.length > 3 ? d.slice(0, 3) : d}
                        </span>
                      ))
                    ) : (
                      <span className="text-[8px] sm:text-[10px] text-content-muted">--</span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={doc.isActive ? "active" : "archived"} className="text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5">
                    {doc.isActive ? "Active" : "Archived"}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right whitespace-nowrap pr-3 sm:pr-4">
                  <div className="flex items-center justify-end gap-2.5 sm:gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewPatients(doc)}
                      className="h-6.5 sm:h-7 px-2 sm:px-2.5 text-[10px] sm:text-xs"
                      title="View & manage assigned patients"
                    >
                      <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-medical-sage" />
                      Patients
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(doc)}
                      className="h-6.5 sm:h-7 px-2 sm:px-2 text-[10px] sm:text-xs text-medical-blue hover:bg-surface-hover"
                      title="View doctor profile"
                    >
                      <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                      Profile
                    </Button>
                    {onToggleArchive && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleArchive(doc._id, !doc.isActive)}
                        className={`h-6.5 sm:h-7 px-2 sm:px-2 text-[10px] sm:text-xs transition-colors ${
                          doc.isActive
                            ? "text-content-muted hover:text-amber-400 hover:bg-amber-950/30"
                            : "text-medical-sage hover:bg-medical-sage/20"
                        }`}
                        title={doc.isActive ? "Archive specialist" : "Restore specialist"}
                      >
                        {doc.isActive ? (
                          <Archive className="w-3.5 h-3.5" />
                        ) : (
                          <ArchiveRestore className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    )}
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
