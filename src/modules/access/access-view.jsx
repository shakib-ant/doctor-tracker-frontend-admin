"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  RefreshCw,
  Search,
  CheckCircle,
  Building2,
  Clock,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  fetchAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  fetchAllStaffUsers,
  updateUserRole,
  toggleUserStatus,
} from "@/services/accessService";
import { AddAdminModal } from "./components/add-admin-modal";

const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "superAdmin", label: "Super Admins" },
  { value: "admin", label: "Administrators" },
  { value: "employee", label: "Staff Specialists" },
];

const TABLE_ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Staff" },
  { value: "superAdmin", label: "SuperAdmin" },
];

export function AccessView() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reqData, userData] = await Promise.all([
        fetchAccessRequests().catch((e) => {
          console.warn("Requests load warning:", e.message);
          return { requests: [] };
        }),
        fetchAllStaffUsers(search, roleFilter).catch((e) => {
          console.warn("Users load warning:", e.message);
          return { users: [] };
        }),
      ]);

      setRequests(reqData.requests || []);
      setUsers(userData.users || []);
    } catch (err) {
      setError(err.message || "Failed to load access control telemetry");
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Approve Request
  const handleApprove = async (id, targetRole) => {
    setActionLoadingId(id);
    setActionSuccess(null);
    setError(null);
    try {
      const res = await approveAccessRequest(id, targetRole);
      setActionSuccess(res.message || "Request approved successfully");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to approve access request");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject Request
  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to decline and remove this access request?")) return;
    setActionLoadingId(id);
    setActionSuccess(null);
    setError(null);
    try {
      const res = await rejectAccessRequest(id);
      setActionSuccess(res.message || "Request rejected");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to reject access request");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Role Change
  const handleRoleChange = async (id, newRole) => {
    setActionLoadingId(id);
    setActionSuccess(null);
    setError(null);
    try {
      const res = await updateUserRole(id, newRole);
      setActionSuccess(res.message || "User role updated successfully");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update role");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Status Toggle
  const handleToggleStatus = async (id, currentActive) => {
    setActionLoadingId(id);
    setActionSuccess(null);
    setError(null);
    try {
      const res = await toggleUserStatus(id, !currentActive);
      setActionSuccess(res.message || "Status updated successfully");
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to toggle status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics
  const pendingCount = requests.length;
  const adminCount = users.filter((u) => u.level === "superAdmin" || u.level === "admin").length;
  const staffCount = users.filter((u) => u.level === "employee").length;

  return (
    <div className="space-y-[calc((18/375)*100vw)] lg:space-y-[calc((26/1920)*100vw)] select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[calc((14/375)*100vw)] lg:gap-[calc((18/1920)*100vw)] pb-2 border-b border-line/60">
        <div>
          <div className="flex items-center gap-[calc((10/375)*100vw)] lg:gap-[calc((12/1920)*100vw)]">
            <h2 className="font-manrope text-[calc((22/375)*100vw)] lg:text-[calc((30/1920)*100vw)] font-extrabold tracking-tight text-content-primary">
              Access Control & Permissions
            </h2>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-bold border border-amber-500/40 animate-pulse">
                {pendingCount} Pending Approval
              </span>
            )}
          </div>
          <p className="text-[calc((14/375)*100vw)] lg:text-[calc((16/1920)*100vw)] text-content-secondary mt-1 leading-relaxed">
            Review join requests, grant administrator privileges, and manage authenticated hospital staff credentials.
          </p>
        </div>

        <div className="flex items-center gap-[calc((12/375)*100vw)] lg:gap-[calc((14/1920)*100vw)] shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] cursor-pointer"
          >
            <RefreshCw
              strokeWidth={2.4}
              className={`w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((21/1920)*100vw)] lg:h-[calc((21/1920)*100vw)] shrink-0 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-[calc((36/375)*100vw)] lg:h-[calc((38/1920)*100vw)] px-[calc((14/375)*100vw)] lg:px-[calc((16/1920)*100vw)] text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] rounded-[calc((10/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] font-semibold cursor-pointer"
          >
            <UserPlus
              strokeWidth={2.4}
              className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((22/1920)*100vw)] lg:h-[calc((22/1920)*100vw)] shrink-0"
            />
            Direct Add Admin
          </Button>
        </div>
      </div>

      {/* Action Banners */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] flex items-center gap-2 shadow-xs animate-in fade-in">
          <ShieldAlert className="w-[calc((18/375)*100vw)] h-[calc((18/375)*100vw)] lg:w-[calc((20/1920)*100vw)] lg:h-[calc((20/1920)*100vw)] text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[calc((12/375)*100vw)] lg:gap-[calc((18/1920)*100vw)]">
        <div className="p-[calc((16/375)*100vw)] lg:p-[calc((20/1920)*100vw)] rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="font-manrope text-[calc((22/375)*100vw)] lg:text-[calc((28/1920)*100vw)] font-extrabold text-amber-600">
              {pendingCount}
            </div>
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-400">
              {pendingCount > 0 ? "Requires SuperAdmin review" : "Queue clear"}
            </span>
          </div>
          <div className="w-[calc((42/375)*100vw)] h-[calc((42/375)*100vw)] lg:w-[calc((48/1920)*100vw)] lg:h-[calc((48/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)]" />
          </div>
        </div>

        <div className="p-[calc((16/375)*100vw)] lg:p-[calc((20/1920)*100vw)] rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-slate-500 uppercase tracking-wider">
              Active Administrators
            </span>
            <div className="font-manrope text-[calc((22/375)*100vw)] lg:text-[calc((28/1920)*100vw)] font-extrabold text-blue-600">
              {adminCount}
            </div>
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-400">
              Full system privileges
            </span>
          </div>
          <div className="w-[calc((42/375)*100vw)] h-[calc((42/375)*100vw)] lg:w-[calc((48/1920)*100vw)] lg:h-[calc((48/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)]" />
          </div>
        </div>

        <div className="p-[calc((16/375)*100vw)] lg:p-[calc((20/1920)*100vw)] rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-slate-500 uppercase tracking-wider">
              Clinical Staff
            </span>
            <div className="font-manrope text-[calc((22/375)*100vw)] lg:text-[calc((28/1920)*100vw)] font-extrabold text-slate-900">
              {staffCount}
            </div>
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-slate-400">
              Operational roster members
            </span>
          </div>
          <div className="w-[calc((42/375)*100vw)] h-[calc((42/375)*100vw)] lg:w-[calc((48/1920)*100vw)] lg:h-[calc((48/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Users className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)]" />
          </div>
        </div>

        <div className="p-[calc((16/375)*100vw)] lg:p-[calc((20/1920)*100vw)] rounded-[calc((14/375)*100vw)] lg:rounded-[calc((16/1920)*100vw)] bg-white border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] font-semibold text-slate-500 uppercase tracking-wider">
              Security Governance
            </span>
            <div className="font-manrope text-[calc((16/375)*100vw)] lg:text-[calc((18/1920)*100vw)] font-bold text-emerald-600">
              Verified Active
            </div>
            <span className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-muted">
              SuperAdmin policy enforced
            </span>
          </div>
          <div className="w-[calc((42/375)*100vw)] h-[calc((42/375)*100vw)] lg:w-[calc((48/1920)*100vw)] lg:h-[calc((48/1920)*100vw)] rounded-[calc((12/375)*100vw)] lg:rounded-[calc((14/1920)*100vw)] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck className="w-[calc((20/375)*100vw)] h-[calc((20/375)*100vw)] lg:w-[calc((24/1920)*100vw)] lg:h-[calc((24/1920)*100vw)]" />
          </div>
        </div>
      </div>

      {/* SECTION 1: PENDING ACCESS REQUESTS QUEUE */}
      <Card className="overflow-hidden border-line shadow-sm">
        <CardHeader className="p-[calc((16/375)*100vw)] lg:p-[calc((22/1920)*100vw)] border-b border-line/60 bg-surface-elevated/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="font-manrope text-[calc((15/375)*100vw)] sm:text-base lg:text-[calc((18/1920)*100vw)] font-bold text-content-primary">
                  Pending Membership Requests
                </CardTitle>
                <Badge
                  variant={pendingCount > 0 ? "warning" : "default"}
                  className="text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] px-2 py-0.5"
                >
                  {pendingCount} in queue
                </Badge>
              </div>
              <CardDescription className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] text-content-secondary mt-0.5">
                Applicants who submitted a join request from the login portal awaiting SuperAdmin approval.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-surface-elevated mx-auto flex items-center justify-center text-content-muted">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-[calc((13/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] font-semibold text-content-primary">
                All Access Requests Processed
              </p>
              <p className="text-[calc((11/375)*100vw)] sm:text-xs lg:text-[calc((12.5/1920)*100vw)] text-content-secondary max-w-sm mx-auto">
                There are no pending join requests. When a doctor or staff member applies for portal access, their record will appear here for verification.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line/60">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="p-[calc((12/375)*100vw)] sm:p-4 lg:p-[calc((16/1920)*100vw)] flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-surface-elevated/30 transition-colors"
                >
                  {/* Left: Applicant details */}
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-[calc((32/375)*100vw)] h-[calc((32/375)*100vw)] lg:w-[calc((36/1920)*100vw)] lg:h-[calc((36/1920)*100vw)] rounded-full bg-medical-blue/20 text-medical-blue flex items-center justify-center font-manrope font-bold text-[calc((11/375)*100vw)] lg:text-[calc((13/1920)*100vw)] shrink-0 border border-medical-blue/30">
                      {req.name ? req.name.slice(0, 2).toUpperCase() : "DR"}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-manrope font-bold text-[calc((12/375)*100vw)] sm:text-sm lg:text-[calc((14/1920)*100vw)] text-content-primary leading-tight">
                          {req.name}
                        </span>
                        <Badge variant="outline" className="text-[calc((9.5/375)*100vw)] sm:text-xs lg:text-[calc((11/1920)*100vw)] px-1.5 py-0.2">
                          {req.department || "Clinical Staff"}
                        </Badge>
                      </div>

                      <div className="text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((12/1920)*100vw)] text-content-secondary">
                        {req.email}
                      </div>

                      {req.requestNote && (
                        <p className="text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] text-content-muted italic bg-surface-elevated/60 px-2 py-0.5 rounded-md border border-line/40 max-w-md">
                          &ldquo;{req.requestNote}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center gap-1.5 text-[calc((9.5/375)*100vw)] sm:text-xs lg:text-[calc((11/1920)*100vw)] text-content-disabled">
                        <Clock className="w-3 h-3" />
                        <span>
                          Requested on{" "}
                          {req.requestedAt
                            ? new Date(req.requestedAt).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Decision Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    <Button
                      variant="default"
                      size="sm"
                      disabled={actionLoadingId === req._id}
                      onClick={() => handleApprove(req._id, "admin")}
                      className="h-[calc((28/375)*100vw)] sm:h-7 lg:h-[calc((30/1920)*100vw)] px-[calc((8/375)*100vw)] sm:px-3 lg:px-[calc((12/1920)*100vw)] text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] font-semibold rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] cursor-pointer"
                    >
                      <ShieldCheck strokeWidth={2.4} className="w-3 h-3 text-canvas" />
                      Approve as Admin
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={actionLoadingId === req._id}
                      onClick={() => handleApprove(req._id, "employee")}
                      className="h-[calc((28/375)*100vw)] sm:h-7 lg:h-[calc((30/1920)*100vw)] px-[calc((8/375)*100vw)] sm:px-2.5 lg:px-[calc((10/1920)*100vw)] text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] cursor-pointer"
                    >
                      Approve as Staff
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={actionLoadingId === req._id}
                      onClick={() => handleReject(req._id)}
                      className="h-[calc((28/375)*100vw)] sm:h-7 lg:h-[calc((30/1920)*100vw)] px-[calc((7/375)*100vw)] lg:px-[calc((8/1920)*100vw)] text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] cursor-pointer"
                    >
                      <UserX className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SECTION 2: ACTIVE ADMINISTRATORS & STAFF DIRECTORY */}
      <Card className="border-line shadow-sm overflow-visible">
        <CardHeader className="p-[calc((16/375)*100vw)] lg:p-[calc((22/1920)*100vw)] border-b border-line/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="font-manrope text-[calc((17/375)*100vw)] lg:text-[calc((20/1920)*100vw)] font-bold text-content-primary">
                Authorized Personnel Directory
              </CardTitle>
              <CardDescription className="text-[calc((14/375)*100vw)] lg:text-[calc((14/1920)*100vw)] text-content-secondary mt-0.5">
                Staff members and administrators with active credentials in the hospital network.
              </CardDescription>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-disabled" />
                <Input
                  type="text"
                  placeholder="Search staff or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-[calc((11.5/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)] h-[calc((32/375)*100vw)] sm:h-8 lg:h-[calc((36/1920)*100vw)] rounded-[calc((8/375)*100vw)] lg:rounded-[calc((10/1920)*100vw)] w-44 sm:w-56"
                />
              </div>

              {/* Custom Dropdown for Roles (Fixes: "assess control page all roles er dorpdawn custom use koro") */}
              <div className="w-36 sm:w-44 shrink-0">
                <CustomSelect
                  value={roleFilter}
                  onChange={(val) => setRoleFilter(val)}
                  options={ROLE_FILTER_OPTIONS}
                  size="sm"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-visible">
          <div className="overflow-x-auto sm:overflow-visible no-scrollbar">
            <Table>
              <TableHeader className="bg-surface-elevated/40 border-b border-line/60">
                <TableRow className="border-line/60 hover:bg-transparent">
                  <TableHead className="text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] font-bold tracking-wider uppercase text-content-secondary py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                    Name & Email
                  </TableHead>
                  <TableHead className="text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] font-bold tracking-wider uppercase text-content-secondary py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                    Department
                  </TableHead>
                  <TableHead className="text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] font-bold tracking-wider uppercase text-content-secondary py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                    Role & Authority
                  </TableHead>
                  <TableHead className="text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] font-bold tracking-wider uppercase text-content-secondary py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] font-bold tracking-wider uppercase text-content-secondary py-[calc((8/375)*100vw)] pr-[calc((10/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:pr-[calc((16/1920)*100vw)]">
                    Manage Permissions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-line/40">
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-content-muted text-[calc((12/375)*100vw)] sm:text-xs lg:text-[calc((13/1920)*100vw)]">
                      No personnel matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-surface-elevated/20 transition-colors border-b border-line/30">
                      {/* Name & Email */}
                      <TableCell className="py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                        <div className="flex items-center gap-[calc((8/375)*100vw)] lg:gap-[calc((10/1920)*100vw)]">
                          <div className="w-[calc((30/375)*100vw)] h-[calc((30/375)*100vw)] lg:w-[calc((34/1920)*100vw)] lg:h-[calc((34/1920)*100vw)] rounded-full bg-surface-elevated border border-line text-medical-blue flex items-center justify-center font-bold text-[calc((11/375)*100vw)] lg:text-[calc((12/1920)*100vw)] shrink-0 shadow-2xs">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-[calc((11.5/375)*100vw)] sm:text-sm lg:text-[calc((13/1920)*100vw)] text-content-primary leading-tight truncate">
                              {user.name}
                            </span>
                            <span className="text-[calc((9.5/375)*100vw)] sm:text-xs lg:text-[calc((11/1920)*100vw)] text-content-secondary mt-0.5 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Department */}
                      <TableCell className="py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)] text-[calc((10.5/375)*100vw)] sm:text-xs lg:text-[calc((12/1920)*100vw)] text-content-secondary">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="w-[calc((13/375)*100vw)] h-[calc((13/375)*100vw)] lg:w-[calc((14/1920)*100vw)] lg:h-[calc((14/1920)*100vw)] text-content-disabled shrink-0" />
                          <span className="truncate">{user.department || "General Administration"}</span>
                        </div>
                      </TableCell>

                      {/* Role */}
                      <TableCell className="py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                        {user.level === "superAdmin" ? (
                          <span className="inline-flex items-center text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold leading-none whitespace-nowrap">
                            Super Administrator
                          </span>
                        ) : user.level === "admin" ? (
                          <span className="inline-flex items-center text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] rounded-full bg-medical-blue/15 text-medical-blue border border-medical-blue/30 font-semibold leading-none whitespace-nowrap">
                            Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] rounded-full bg-surface-elevated text-content-secondary border border-line font-medium leading-none whitespace-nowrap">
                            Clinical Staff
                          </span>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-[calc((8/375)*100vw)] px-[calc((8/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:px-[calc((12/1920)*100vw)]">
                        <span
                          className={`inline-flex items-center text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] px-[calc((7/375)*100vw)] py-[calc((2/375)*100vw)] lg:px-[calc((9/1920)*100vw)] lg:py-[calc((2.5/1920)*100vw)] rounded-full font-semibold leading-none whitespace-nowrap ${
                            user.isActive !== false
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Suspended"}
                        </span>
                      </TableCell>

                      {/* Management Actions */}
                      <TableCell className="text-right py-[calc((8/375)*100vw)] pr-[calc((10/375)*100vw)] lg:py-[calc((10/1920)*100vw)] lg:pr-[calc((16/1920)*100vw)]">
                        {user.isPermanent || user._id === "admin-default-id" ? (
                          <span className="text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] text-content-disabled italic">
                            Permanent SuperAdmin
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-[calc((6/375)*100vw)] lg:gap-[calc((8/1920)*100vw)]">
                            {/* Role Switcher with Upward Dropdown and High Stacking */}
                            <div className="w-24 sm:w-28 text-left relative z-20">
                              <CustomSelect
                                value={user.level || "employee"}
                                disabled={actionLoadingId === user._id}
                                onChange={(val) => handleRoleChange(user._id, val)}
                                options={TABLE_ROLE_OPTIONS}
                                size="sm"
                                direction="up"
                                buttonClassName="h-[calc((28/375)*100vw)] sm:h-7 lg:h-[calc((30/1920)*100vw)] text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] px-2 py-0"
                              />
                            </div>

                            {/* Status Toggle */}
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={actionLoadingId === user._id}
                              onClick={() => handleToggleStatus(user._id, user.isActive !== false)}
                              className={`h-[calc((28/375)*100vw)] sm:h-7 lg:h-[calc((30/1920)*100vw)] px-[calc((8/375)*100vw)] lg:px-[calc((10/1920)*100vw)] text-[calc((10/375)*100vw)] sm:text-xs lg:text-[calc((11.5/1920)*100vw)] rounded-[calc((6/375)*100vw)] lg:rounded-[calc((6/1920)*100vw)] font-semibold transition-colors cursor-pointer ${
                                user.isActive !== false
                                  ? "text-amber-400 hover:bg-amber-950/30"
                                  : "text-emerald-400 hover:bg-emerald-950/30"
                              }`}
                            >
                              {user.isActive !== false ? "Suspend" : "Activate"}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Direct Add Modal */}
      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setActionSuccess("New administrator created successfully.");
          loadData();
        }}
      />
    </div>
  );
}

