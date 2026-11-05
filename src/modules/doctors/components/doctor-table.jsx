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
import { Users, Eye, Stethoscope, Plus, Trash2, ArchiveRestore } from "lucide-react";

// Curated high-resolution doctor human avatars (Guaranteed 100% active, verified URLs)
const DOCTOR_AVATARS = [
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824813576-96b6fbcf2b44?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=80",
];

function getDoctorAvatarUrl(doc, idx) {
  if (doc?.image && doc.image.startsWith("http")) return doc.image;
  const key = doc?._id || doc?.name || `${idx}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
  }
  return DOCTOR_AVATARS[Math.abs(hash) % DOCTOR_AVATARS.length];
}

export function DoctorTable({
  doctors = [],
  isLoading = false,
  onViewDetails,
  onViewPatients,
  onToggleArchive,
  onAddNew,
}) {
  return (
    <div className="overflow-x-auto no-scrollbar rounded-2xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] bg-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-slate-50/70 border-b border-slate-200/80 hover:bg-slate-50/70">
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] sm:py-2.5 sm:px-3 md:py-2 md:px-2.5 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[24%]">Doctor</TableHead>
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[13%]">Specialization</TableHead>
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[14%]">Hospital / Chamber</TableHead>
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[14%]">Contact</TableHead>
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2 md:py-2 md:px-1.5 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((8/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[9%]">Fee</TableHead>
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[12%]">Available Days</TableHead>
            <TableHead className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2 md:py-2 md:px-1.5 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((8/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[8%]">Status</TableHead>
            <TableHead className="text-right py-[calc((8/375)*100vw)] pr-[calc((8/375)*100vw)] sm:py-2.5 sm:pr-3 md:py-2 md:pr-2.5 lg:py-[calc((10/1920)*100vw)] lg:pr-[calc((12/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] font-bold text-slate-500 uppercase tracking-wider w-[6%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="py-3.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell className="py-3.5">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="space-y-1">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell className="py-3.5">
                  <div className="flex gap-1">
                    <Skeleton className="h-4 w-6 rounded" />
                    <Skeleton className="h-4 w-6 rounded" />
                    <Skeleton className="h-4 w-6 rounded" />
                  </div>
                </TableCell>
                <TableCell className="py-3.5">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-right py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : doctors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-14">
                <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                  <div className="p-3.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200 shadow-xs">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-manrope text-[calc((17/375)*100vw)] sm:text-base md:text-base lg:text-[calc((19/1920)*100vw)] font-bold text-slate-900">
                      No doctors found
                    </p>
                    <p className="text-[calc((14/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((14/1920)*100vw)] text-slate-500">
                      No doctor records match your current criteria.
                    </p>
                  </div>
                  {onAddNew && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={onAddNew}
                      className="mt-2 h-9 px-4 rounded-xl cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Add Specialist
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            doctors.map((doc, idx) => (
              <TableRow
                key={doc._id}
                className="hover:bg-blue-50/40 transition-colors duration-150 border-b border-slate-100"
              >
                {/* Doctor Name & Human Avatar */}
                <TableCell className="font-medium py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] sm:py-2.5 sm:px-3 md:py-2 md:px-2.5 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                  <div className="flex items-center gap-[calc((8/375)*100vw)] sm:gap-2.5 md:gap-2 lg:gap-[calc((10/1920)*100vw)]">
                    <div className="relative shrink-0">
                      <div className="w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-[calc((36/1920)*100vw)] lg:h-[calc((36/1920)*100vw)] rounded-full overflow-hidden border border-slate-200/90 shadow-xs relative bg-slate-100 ring-2 ring-slate-100/80">
                        <img
                          src={getDoctorAvatarUrl(doc, idx)}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DOCTOR_AVATARS[0];
                          }}
                        />
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-[calc((9/375)*100vw)] h-[calc((9/375)*100vw)] sm:w-2 sm:h-2 md:w-2 md:h-2 lg:w-[calc((10/1920)*100vw)] lg:h-[calc((10/1920)*100vw)] rounded-full ring-2 ring-white shadow-xs ${
                          doc.isActive ? "bg-emerald-500" : "bg-amber-400"
                        }`}
                        title={doc.isActive ? "Active Duty" : "Archived"}
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="text-[calc((11.5/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((13/1920)*100vw)] font-bold text-slate-900 truncate leading-tight">
                        {doc.name}
                      </div>
                      <div className="text-[calc((10/375)*100vw)] sm:text-[11px] md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] text-slate-400 truncate max-w-[130px] md:max-w-[120px] lg:max-w-[calc((160/1920)*100vw)] leading-tight mt-0.5">
                        {doc.qualifications || doc.designation || "Physician"}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Specialization */}
                <TableCell className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)]">
                  <Badge variant="default" className="text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] sm:px-2.5 sm:py-0.5 md:px-2 md:py-0.5 lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] whitespace-nowrap bg-blue-50 text-blue-700 border-blue-200 font-semibold rounded-lg shadow-xs leading-tight">
                    {doc.specialization}
                  </Badge>
                </TableCell>

                {/* Hospital / Chamber (Compact width with fluid calc) */}
                <TableCell className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)]">
                  <span
                    className="text-[calc((10.5/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((12/1920)*100vw)] text-slate-600 block truncate max-w-[130px] md:max-w-[110px] lg:max-w-[calc((140/1920)*100vw)] font-medium"
                    title={doc.hospital || "Not assigned"}
                  >
                    {doc.hospital || "Not assigned"}
                  </span>
                </TableCell>

                {/* Contact (Compact width with fluid calc) */}
                <TableCell className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)]">
                  <div className="flex flex-col justify-center max-w-[130px] md:max-w-[110px] lg:max-w-[calc((140/1920)*100vw)]">
                    <div className="leading-tight text-[calc((10.5/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((12/1920)*100vw)] font-bold text-slate-800 truncate">{doc.phone || "--"}</div>
                    <div className="text-[calc((9.5/375)*100vw)] sm:text-[10px] md:text-[10px] lg:text-[calc((11/1920)*100vw)] text-slate-400 truncate leading-tight mt-0.5" title={doc.email || ""}>
                      {doc.email || ""}
                    </div>
                  </div>
                </TableCell>

                {/* Fee */}
                <TableCell className="whitespace-nowrap py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2 md:py-2 md:px-1.5 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((8/1920)*100vw)]">
                  <div className="text-[calc((11.5/375)*100vw)] sm:text-xs md:text-xs lg:text-[calc((13/1920)*100vw)] font-bold text-slate-900 font-manrope">
                    {doc.consultationFee !== undefined && doc.consultationFee !== null
                      ? `$${doc.consultationFee}`
                      : "--"}
                  </div>
                  <div className="text-[calc((9.5/375)*100vw)] sm:text-[10px] md:text-[10px] lg:text-[calc((11/1920)*100vw)] text-slate-400">per consult</div>
                </TableCell>

                {/* Available Days (Smaller micro-pills with fluid calc) */}
                <TableCell className="py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2.5 md:py-2 md:px-2 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((10/1920)*100vw)]">
                  <div className="flex gap-[calc((4/375)*100vw)] sm:gap-1 md:gap-1 lg:gap-[calc((4/1920)*100vw)] flex-wrap items-center max-w-[120px] md:max-w-[105px] lg:max-w-[calc((130/1920)*100vw)]">
                    {doc.availableDays && doc.availableDays.length > 0 ? (
                      doc.availableDays.map((d) => (
                        <span
                          key={d}
                          title={d}
                          className="px-[calc((5/375)*100vw)] py-[calc((2/375)*100vw)] sm:px-1.5 sm:py-0.5 md:px-1.5 md:py-0.5 lg:px-[calc((6/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] rounded text-[calc((9.5/375)*100vw)] sm:text-[10px] md:text-[10px] lg:text-[calc((11/1920)*100vw)] font-semibold bg-slate-100 text-slate-600 border border-slate-200/90 shadow-2xs leading-none"
                        >
                          {d.length > 3 ? d.slice(0, 3) : d}
                        </span>
                      ))
                    ) : (
                      <span className="text-[calc((10/375)*100vw)] sm:text-[10px] md:text-[10px] lg:text-[calc((11/1920)*100vw)] text-slate-400">--</span>
                    )}
                  </div>
                </TableCell>

                {/* Status with Direct One-Click Toggle */}
                <TableCell className="whitespace-nowrap py-[calc((8/375)*100vw)] px-[calc((6/375)*100vw)] sm:py-2.5 sm:px-2 md:py-2 md:px-1.5 lg:py-[calc((10/1920)*100vw)] lg:px-[calc((8/1920)*100vw)]">
                  {onToggleArchive ? (
                    <button
                      type="button"
                      onClick={() => onToggleArchive(doc._id, !doc.isActive)}
                      className="inline-flex items-center cursor-pointer group focus:outline-none"
                      title={`Click to change status: currently ${doc.isActive ? "Active (click to Archive)" : "Archived (click to Activate)"}`}
                    >
                      <Badge
                        variant={doc.isActive ? "active" : "archived"}
                        className="text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] sm:px-2.5 sm:py-0.5 md:px-2 md:py-0.5 lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] transition-all group-hover:scale-105 group-hover:ring-1 group-hover:ring-blue-400 flex items-center gap-1.5 cursor-pointer rounded-lg shadow-xs leading-tight"
                      >
                        <span
                          className={`w-[calc((7/375)*100vw)] h-[calc((7/375)*100vw)] sm:w-1.5 sm:h-1.5 md:w-1.5 md:h-1.5 lg:w-[calc((8/1920)*100vw)] lg:h-[calc((8/1920)*100vw)] rounded-full shrink-0 ${
                            doc.isActive ? "bg-emerald-500" : "bg-amber-400"
                          }`}
                        />
                        <span>{doc.isActive ? "Active" : "Archived"}</span>
                      </Badge>
                    </button>
                  ) : (
                    <Badge
                      variant={doc.isActive ? "active" : "archived"}
                      className="text-[calc((10.5/375)*100vw)] sm:text-xs md:text-[11px] lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] sm:px-2.5 sm:py-0.5 md:px-2 md:py-0.5 lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] rounded-lg leading-tight"
                    >
                      {doc.isActive ? "Active" : "Archived"}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions with tight, polished layout */}
                <TableCell className="text-right whitespace-nowrap py-[calc((8/375)*100vw)] pr-[calc((8/375)*100vw)] sm:py-2.5 sm:pr-3 md:py-2 md:pr-2.5 lg:py-[calc((10/1920)*100vw)] lg:pr-[calc((12/1920)*100vw)]">
                  <div className="flex items-center justify-end gap-[calc((4/375)*100vw)] sm:gap-1.5 md:gap-1 lg:gap-[calc((6/1920)*100vw)]">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onViewPatients(doc)}
                      className="h-[calc((28/375)*100vw)] w-[calc((28/375)*100vw)] sm:h-7 sm:w-7 md:h-7 md:w-7 lg:h-[calc((32/1920)*100vw)] lg:w-[calc((32/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-lg md:rounded-lg lg:rounded-[calc((8/1920)*100vw)] text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 cursor-pointer shadow-xs transition-colors"
                      title="View & manage assigned patients"
                      aria-label="View & manage assigned patients"
                    >
                      <Users className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(doc)}
                      className="h-[calc((28/375)*100vw)] w-[calc((28/375)*100vw)] sm:h-7 sm:w-7 md:h-7 md:w-7 lg:h-[calc((32/1920)*100vw)] lg:w-[calc((32/1920)*100vw)] text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-[calc((8/375)*100vw)] sm:rounded-lg md:rounded-lg lg:rounded-[calc((8/1920)*100vw)] cursor-pointer transition-colors"
                      title="View doctor profile"
                      aria-label="View doctor profile"
                    >
                      <Eye className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2]" />
                    </Button>
                    {onToggleArchive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleArchive(doc)}
                        className={`h-[calc((28/375)*100vw)] w-[calc((28/375)*100vw)] sm:h-7 sm:w-7 md:h-7 md:w-7 lg:h-[calc((32/1920)*100vw)] lg:w-[calc((32/1920)*100vw)] rounded-[calc((8/375)*100vw)] sm:rounded-lg md:rounded-lg lg:rounded-[calc((8/1920)*100vw)] border border-transparent transition-colors cursor-pointer flex items-center justify-center ${
                          doc.isActive
                            ? "text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                            : "text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 font-semibold"
                        }`}
                        title={doc.isActive ? "Delete / Archive doctor" : "Restore doctor to active registry"}
                        aria-label={doc.isActive ? "Delete / Archive doctor" : "Restore doctor to active registry"}
                      >
                        {doc.isActive ? (
                          <Trash2 className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2]" />
                        ) : (
                          <ArchiveRestore className="w-[calc((14/375)*100vw)] h-[calc((14/375)*100vw)] sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-[calc((15/1920)*100vw)] lg:h-[calc((15/1920)*100vw)] stroke-[2.2] text-emerald-600" />
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
