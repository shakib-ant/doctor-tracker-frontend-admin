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
import { Users, Eye, Stethoscope, Plus, Trash2, ArchiveRestore } from "lucide-react";
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
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Doctor</TableHead>
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Specialization</TableHead>
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Hospital / Chamber</TableHead>
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Contact</TableHead>
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Fee</TableHead>
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Available Days</TableHead>
            <TableHead className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Status</TableHead>
            <TableHead className="text-right text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="w-[calc((34/375)*100vw)] h-[calc((34/375)*100vw)] lg:w-[calc((38/1920)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-full shrink-0" />
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
                  <div className="flex justify-end gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
                    <Skeleton className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]" />
                    <Skeleton className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]" />
                    <Skeleton className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)]" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-14">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <div className="p-3.5 rounded-full bg-surface-elevated text-content-muted border border-line shadow-xs">
                    <Stethoscope className="w-[calc((24/375)*100vw)] h-[calc((24/375)*100vw)] lg:w-[calc((28/1920)*100vw)] lg:h-[calc((28/1920)*100vw)]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-manrope text-[calc((17/375)*100vw)] lg:text-[calc((19/1920)*100vw)] font-bold text-content-primary">
                      No doctors found
                    </p>
                    <p className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary">
                      No doctor records match your current criteria.
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
                      Add Specialist
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
                  <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
                    {doc.image ? (
                      <div className="w-[calc((34/375)*100vw)] h-[calc((34/375)*100vw)] lg:w-[calc((38/1920)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-full overflow-hidden border border-line shrink-0 relative bg-surface-elevated">
                        <Image
                          src={doc.image}
                          alt={doc.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-[calc((34/375)*100vw)] h-[calc((34/375)*100vw)] lg:w-[calc((38/1920)*100vw)] lg:h-[calc((38/1920)*100vw)] rounded-full bg-medical-blue/20 text-medical-blue flex items-center justify-center font-manrope font-bold text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] shrink-0 border border-medical-blue/30">
                        {getDoctorInitials(doc.name)}
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <div className="text-[calc((14/375)*100vw)] lg:text-[calc((16/1920)*100vw)] font-semibold text-content-primary whitespace-nowrap leading-tight">
                        {doc.name}
                      </div>
                      <div className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted truncate max-w-[calc((150/375)*100vw)] lg:max-w-[calc((200/1920)*100vw)] leading-tight mt-[calc((2/375)*100vw)] lg:mt-[calc((2/1920)*100vw)]">
                        {doc.qualifications || doc.designation || "Physician"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Specialization */}
                <TableCell>
                  <Badge variant="default" className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-0.5 whitespace-nowrap">
                    {doc.specialization}
                  </Badge>
                </TableCell>

                {/* Hospital */}
                <TableCell className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary whitespace-nowrap">
                  {doc.hospital || "Not assigned"}
                </TableCell>

                {/* Contact */}
                <TableCell className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary whitespace-nowrap">
                  <div className="flex flex-col justify-center">
                    <div className="leading-tight">{doc.phone || "--"}</div>
                    <div className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted truncate max-w-[calc((140/375)*100vw)] lg:max-w-[calc((180/1920)*100vw)] leading-tight mt-[calc((2/375)*100vw)] lg:mt-[calc((2/1920)*100vw)]">
                      {doc.email || ""}
                    </div>
                  </div>
                </TableCell>

                {/* Fee */}
                <TableCell className="whitespace-nowrap">
                  <div className="text-[calc((14/375)*100vw)] lg:text-[calc((15/1920)*100vw)] font-semibold text-content-primary font-manrope">
                    {doc.consultationFee !== undefined && doc.consultationFee !== null
                      ? `$${doc.consultationFee}`
                      : "--"}
                  </div>
                  <div className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted">per consult</div>
                </TableCell>

                {/* Available Days */}
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-[calc((150/375)*100vw)] lg:max-w-[calc((180/1920)*100vw)]">
                    {doc.availableDays && doc.availableDays.length > 0 ? (
                      doc.availableDays.map((d) => (
                        <span
                          key={d}
                          title={d}
                          className="px-1.5 py-0.5 rounded text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-medium bg-surface-elevated text-content-secondary border border-line"
                        >
                          {d.length > 3 ? d.slice(0, 3) : d}
                        </span>
                      ))
                    ) : (
                      <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted">--</span>
                    )}
                  </div>
                </TableCell>

                {/* Status with Direct One-Click Toggle */}
                <TableCell className="whitespace-nowrap">
                  {onToggleArchive ? (
                    <button
                      type="button"
                      onClick={() => onToggleArchive(doc._id, !doc.isActive)}
                      className="inline-flex items-center cursor-pointer group focus:outline-none"
                      title={`Click to change status: currently ${doc.isActive ? "Active (click to Archive)" : "Archived (click to Activate)"}`}
                    >
                      <Badge
                        variant={doc.isActive ? "active" : "archived"}
                        className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-0.5 transition-all group-hover:scale-105 group-hover:ring-1 group-hover:ring-medical-blue/40 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span
                          className={`w-[calc((8/375)*100vw)] h-[calc((8/375)*100vw)] lg:w-[calc((8/1920)*100vw)] lg:h-[calc((8/1920)*100vw)] rounded-full shrink-0 ${
                            doc.isActive ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                        />
                        <span>{doc.isActive ? "Active" : "Archived"}</span>
                      </Badge>
                    </button>
                  ) : (
                    <Badge
                      variant={doc.isActive ? "active" : "archived"}
                      className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] px-[calc((10/375)*100vw)] lg:px-[calc((12/1920)*100vw)] py-0.5"
                    >
                      {doc.isActive ? "Active" : "Archived"}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right whitespace-nowrap pr-[calc((12/375)*100vw)] lg:pr-[calc((18/1920)*100vw)]">
                  <div className="flex items-center justify-end gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onViewPatients(doc)}
                      className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] text-medical-sage hover:text-content-primary hover:border-medical-sage/60 cursor-pointer"
                      title="View & manage assigned patients"
                      aria-label="View & manage assigned patients"
                    >
                      <Users className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(doc)}
                      className="h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] text-medical-blue hover:bg-surface-hover hover:border-medical-blue/40 border border-transparent rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] cursor-pointer"
                      title="View doctor profile"
                      aria-label="View doctor profile"
                    >
                      <Eye className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2]" />
                    </Button>
                    {onToggleArchive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleArchive(doc)}
                        className={`h-[calc((32/375)*100vw)] w-[calc((32/375)*100vw)] lg:h-[calc((36/1920)*100vw)] lg:w-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((8/1920)*100vw)] border border-transparent transition-colors cursor-pointer flex items-center justify-center ${
                          doc.isActive
                            ? "text-content-secondary hover:text-red-400 hover:bg-red-950/30 hover:border-red-900/40"
                            : "text-medical-sage hover:bg-medical-sage/20 hover:border-medical-sage/40 font-semibold"
                        }`}
                        title={doc.isActive ? "Delete / Archive doctor" : "Restore doctor to active registry"}
                        aria-label={doc.isActive ? "Delete / Archive doctor" : "Restore doctor to active registry"}
                      >
                        {doc.isActive ? (
                          <Trash2 className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2]" />
                        ) : (
                          <ArchiveRestore className="w-[calc((16/375)*100vw)] h-[calc((16/375)*100vw)] lg:w-[calc((18/1920)*100vw)] lg:h-[calc((18/1920)*100vw)] stroke-[2.2] text-medical-sage" />
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
