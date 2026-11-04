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
import { Edit2, Trash2, Users, Calendar, Plus } from "lucide-react";
import { getStatusBadgeVariant, formatDate } from "../utils/patientUtils";

export function PatientTable({
  patients = [],
  isLoading = false,
  onEdit,
  onDelete,
  onAddNew,
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age / Gender</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Assigned Doctor</TableHead>
            <TableHead>Admission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell>
                  <div className="h-5 w-32 bg-surface-elevated rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-surface-elevated rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-28 bg-surface-elevated rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-36 bg-surface-elevated rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-24 bg-surface-elevated rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-16 bg-surface-elevated rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-7 w-16 bg-surface-elevated rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : patients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <div className="p-3 rounded-full bg-surface-elevated text-content-muted border border-line">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-manrope text-base font-semibold text-content-primary">
                      No patient records found
                    </p>
                    <p className="text-xs text-content-secondary mt-1">
                      No patients match your current filter or date range.
                    </p>
                  </div>
                  {onAddNew && (
                    <Button variant="default" size="sm" onClick={onAddNew}>
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
                    <div className="font-semibold text-content-primary">
                      {p.name}
                    </div>
                    {p.phone && (
                      <div className="text-[11px] text-content-muted">
                        {p.phone}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Age & Gender */}
                <TableCell className="text-xs text-content-secondary">
                  {p.age} yrs &bull; {p.gender}
                </TableCell>

                {/* Condition */}
                <TableCell>
                  <Badge variant="default" className="text-xs font-normal">
                    {p.condition}
                  </Badge>
                </TableCell>

                {/* Assigned Doctor */}
                <TableCell className="text-xs text-content-secondary">
                  {p.doctor ? (
                    <div>
                      <div className="font-medium text-content-primary">
                        {p.doctor.name}
                      </div>
                      <div className="text-[10px] text-content-muted">
                        {p.doctor.specialization} &bull; {p.doctor.hospital || "Clinic"}
                      </div>
                    </div>
                  ) : (
                    <span className="text-content-muted">Unassigned</span>
                  )}
                </TableCell>

                {/* Admission Date */}
                <TableCell className="text-xs text-content-secondary">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-medical-sage" />
                    <span>{formatDate(p.admissionDate || p.createdAt)}</span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(p.status)}>
                    {p.status}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(p)}
                      className="h-7 w-7 p-0 text-content-secondary hover:text-content-primary hover:bg-surface-hover"
                      title="Edit patient info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(p)}
                      className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-950/40"
                      title="Delete patient record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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

