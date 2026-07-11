"use client";

// ============================================================
//  TAGIT — Super Admin Dashboard
//  Provides real-time system metrics, NFC tap analytics, and user access control.
// ============================================================

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  CreditCard,
  Radio,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ArrowLeft,
  Sparkles,
  Award,
  Filter,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../services/api";

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalProfiles: number;
  activeCards: number;
  corporateUsers: number;
  premiumUsers: number;
  totalTaps: number;
  platformHealth: string;
}

interface UserItem {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  authProvider: string;
  subscriptionTier: "FREE" | "PREMIUM" | "CORPORATE";
  createdAt: string;
  profile?: {
    id: string;
    username: string;
    displayName: string;
    company?: string | null;
    jobTitle?: string | null;
    status: "ACTIVE" | "SUSPENDED" | "STEALTH";
    tapCount?: number;
  } | null;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"ALL" | "USER" | "ADMIN">("ALL");

  const fetchAdminData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsRes, usersRes] = await Promise.all([
        apiClient.get("/admin/stats"),
        apiClient.get("/admin/users"),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (usersRes.data.success) setUsers(usersRes.data.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load Admin Dashboard data. Administrator privileges required."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }
      if (user.role !== "ADMIN") {
        router.push("/products");
        return;
      }
      fetchAdminData();
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleToggleRole = async (targetUser: UserItem) => {
    const newRole = targetUser.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      const res = await apiClient.patch(`/admin/users/${targetUser.id}/role`, {
        role: newRole,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
        );
      }
    } catch {
      alert("Failed to update user role.");
    }
  };

  const handleToggleTier = async (
    targetUser: UserItem,
    newTier: "FREE" | "PREMIUM" | "CORPORATE"
  ) => {
    try {
      const res = await apiClient.patch(`/admin/users/${targetUser.id}/role`, {
        subscriptionTier: newTier,
      });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === targetUser.id ? { ...u, subscriptionTier: newTier } : u
          )
        );
      }
    } catch {
      alert("Failed to update subscription tier.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Loading TAGIT Admin Control Center...
        </p>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.profile?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.profile?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.profile?.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "ALL" ? true : u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Admin Navigation */}
      <nav className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-black shadow-md">
              <Shield className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tighter text-white">
                TAGIT <span className="text-amber-400 font-normal">Super Admin</span>
              </span>
              <span className="block text-[10px] font-semibold text-neutral-400">
                Platform Control Portal v1.0
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminData(true)}
            disabled={refreshing}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/products"
            className="py-1.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-rose-500" />
            User Card View
          </Link>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-black text-rose-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header Title & Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900 border border-neutral-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" /> System Operational — Live Analytics
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Platform Overview & User Control
            </h1>
            <p className="text-sm font-medium text-neutral-400 mt-1 max-w-2xl">
              Monitor NFC card tap activity across all user cards, manage subscription levels, and assign administrative roles with real-time sync.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-950/80 backdrop-blur-md p-3.5 rounded-2xl border border-neutral-800 shrink-0">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-black text-white">Database Status</div>
              <div className="text-[11px] font-semibold text-emerald-400">Connected & Synced</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-black block text-sm">Action Required</span>
              {error}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                <span>Total Accounts</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {stats.totalUsers}
              </div>
              <div className="text-xs font-semibold text-neutral-500 mt-1">
                {stats.totalAdmins} Admin {stats.totalAdmins === 1 ? "Role" : "Roles"} Assigned
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                <span>Active NFC Cards</span>
                <CreditCard className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {stats.activeCards}
              </div>
              <div className="text-xs font-semibold text-neutral-500 mt-1">
                {stats.totalProfiles} total profiles created
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                <span>Total NFC Taps</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {stats.totalTaps.toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-emerald-400/80 mt-1 flex items-center gap-1">
                Real-time tap counter
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-lg relative overflow-hidden group hover:border-neutral-700 transition-colors">
              <div className="text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                <span>Premium Members</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {stats.premiumUsers + stats.corporateUsers}
              </div>
              <div className="text-xs font-semibold text-neutral-500 mt-1">
                {stats.corporateUsers} Corporate / {stats.premiumUsers} Premium
              </div>
            </div>
          </div>
        )}

        {/* User Management Section */}
        <div className="rounded-3xl bg-neutral-900/80 border border-neutral-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                User Access & Tier Control
              </h2>
              <p className="text-xs font-semibold text-neutral-400 mt-0.5">
                Search, promote users to Administrator status, or upgrade NFC card tiers.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Role Filter */}
              <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                {(["ALL", "USER", "ADMIN"] as const).map((roleOption) => (
                  <button
                    key={roleOption}
                    onClick={() => setFilterRole(roleOption)}
                    className={`py-1.5 px-3 rounded-lg text-[11px] font-black transition-colors ${
                      filterRole === roleOption
                        ? "bg-amber-400 text-neutral-950 shadow-sm"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {roleOption === "ALL" ? "All Users" : roleOption}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search email or username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-400 text-xs font-semibold text-white placeholder-neutral-500 outline-none transition-all w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[11px] font-black uppercase tracking-wider text-neutral-400">
                  <th className="py-3.5 px-6">User / Identity</th>
                  <th className="py-3.5 px-4">Profile & Card</th>
                  <th className="py-3.5 px-4">Role Status</th>
                  <th className="py-3.5 px-4">Subscription Tier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs font-semibold text-neutral-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-500 font-bold">
                      No users match your search or filter options.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-800/40 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm flex items-center gap-2">
                          {item.email}
                          {item.authProvider !== "EMAIL" && (
                            <span className="text-[10px] py-0.5 px-2 rounded-md bg-neutral-800 text-neutral-300 uppercase font-black tracking-tight">
                              {item.authProvider}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          ID: {item.id.slice(0, 8)}... • Joined{" "}
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {item.profile ? (
                          <div>
                            <div className="font-bold text-neutral-200 flex items-center gap-1.5">
                              @{item.profile.username}
                              <Link
                                href={`/${item.profile.username}`}
                                target="_blank"
                                className="text-neutral-500 hover:text-amber-400 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                            <div className="text-[11px] text-neutral-400">
                              {item.profile.displayName} •{" "}
                              <span className="text-emerald-400 font-bold">
                                {item.profile.tapCount || 0} Taps
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-neutral-500 italic">No Profile Assigned</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[11px] font-black uppercase tracking-wider ${
                            item.role === "ADMIN"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : "bg-neutral-800 text-neutral-300 border border-neutral-700"
                          }`}
                        >
                          {item.role === "ADMIN" && <Shield className="w-3 h-3 fill-current" />}
                          {item.role}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={item.subscriptionTier}
                          onChange={(e) =>
                            handleToggleTier(
                              item,
                              e.target.value as "FREE" | "PREMIUM" | "CORPORATE"
                            )
                          }
                          className="bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-black py-1.5 px-3 rounded-xl text-neutral-200 outline-none cursor-pointer transition-colors"
                        >
                          <option value="FREE">FREE TIER</option>
                          <option value="PREMIUM">PREMIUM CARD</option>
                          <option value="CORPORATE">CORPORATE ENTERPRISE</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleToggleRole(item)}
                          disabled={item.id === user?.id}
                          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            item.role === "ADMIN"
                              ? "bg-neutral-800 hover:bg-neutral-700 text-rose-300 border border-rose-500/30"
                              : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-sm"
                          }`}
                        >
                          {item.role === "ADMIN" ? "Revoke Admin Role" : "Promote to Admin"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
