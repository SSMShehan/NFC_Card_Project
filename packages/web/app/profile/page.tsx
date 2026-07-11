"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Smartphone,
  Building2,
  Briefcase,
  Globe,
  FileText,
  Calendar,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Eye,
  EyeOff,
  LogOut,
  Download,
  Key,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/services/api";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [publicEmail, setPublicEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"ACTIVE" | "SUSPENDED" | "STEALTH">("ACTIVE");

  // UI States
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingPrivacy, setIsTogglingPrivacy] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize form when user loads
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }
    if (user?.profile) {
      setDisplayName(user.profile.displayName || "");
      setUsername(user.profile.username || "");
      setBio(user.profile.bio || "");
      setPhone(user.profile.phone || "");
      setPublicEmail(user.profile.email || "");
      setCompany(user.profile.company || "");
      setJobTitle(user.profile.jobTitle || "");
      setWebsite(user.profile.website || "");
      setStatus(user.profile.status || "ACTIVE");
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white">
          <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
          <p className="text-sm font-medium text-neutral-400">Loading User Account & Profile Data...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      // 1. Instant update for standard fields
      const res = await apiClient.patch("/profile/instant", {
        bio: bio.trim() || undefined,
        phone: phone.trim() || undefined,
        email: publicEmail.trim() || undefined,
        company: company.trim() || undefined,
        jobTitle: jobTitle.trim() || undefined,
        website: website.trim() || undefined,
      });

      // 2. If displayName changed, trigger moderated patch
      if (user.profile?.displayName !== displayName.trim() && displayName.trim().length >= 2) {
        await apiClient.patch("/profile/moderated", {
          displayName: displayName.trim(),
        });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to update profile details.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Privacy Toggle
  const handleTogglePrivacy = async () => {
    setIsTogglingPrivacy(true);
    setErrorMessage(null);
    try {
      const res = await apiClient.patch("/profile/privacy");
      if (res.data?.data?.status) {
        setStatus(res.data.data.status);
      } else {
        setStatus(status === "ACTIVE" ? "STEALTH" : "ACTIVE");
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || "Failed to toggle privacy status.");
    } finally {
      setIsTogglingPrivacy(false);
    }
  };

  // Format Join Date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not Recorded";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-rose-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-600/15 blur-[140px] pointer-events-none" />

      {/* ── Top Luxury Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-2xl border-b border-neutral-800/80">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-neutral-400 hover:text-white transition-colors group px-3 py-1.5 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold tracking-wide">Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              User Profile & Account Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/customize"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              NFC Studio Customizer
            </Link>
            {username && (
              <Link
                href={`/p/${username}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-500/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Public Card
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Layout ── */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Sidebar: Account Identity & Status Card ── */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-neutral-900/90 border border-neutral-800/80 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-rose-500/20 via-orange-500/20 to-amber-500/20 border-b border-neutral-800/50" />
              
              {/* Profile Avatar */}
              <div className="relative pt-12 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 p-[2px] shadow-xl mb-4">
                  <div className="w-full h-full bg-neutral-950 rounded-3xl flex items-center justify-center overflow-hidden">
                    {user.profile?.profilePicture ? (
                      <img
                        src={user.profile.profilePicture}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black bg-gradient-to-tr from-rose-400 to-amber-300 bg-clip-text text-transparent">
                        {(user.profile?.displayName || user.email || "U").substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {user.profile?.displayName || user.email.split("@")[0]}
                </h2>
                <p className="text-sm font-medium text-rose-400 mt-1">
                  @{username || "user"}
                </p>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-800/80 border border-neutral-700/60 text-neutral-300">
                    <Shield className="w-3 h-3 text-amber-400" />
                    Role: {user.role || "USER"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-300">
                    <CreditCard className="w-3 h-3 text-rose-400" />
                    Tier: {user.subscriptionTier}
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 my-6" />

              {/* Account Metrics & Sign-up Details */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-500" /> Join Date:
                  </span>
                  <span className="font-semibold text-neutral-200">{formatDate(user.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Key className="w-4 h-4 text-neutral-500" /> Auth Provider:
                  </span>
                  <span className="font-semibold text-neutral-200 capitalize">
                    {user.authProvider || "Email & Password"}
                  </span>
                </div>

                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60">
                  <span className="text-neutral-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400" /> Total NFC Taps:
                  </span>
                  <span className="font-bold text-rose-400 text-base">{user.profile?.tapCount || 0}</span>
                </div>
              </div>

              {/* Privacy Toggle Action */}
              <div className="mt-6 pt-6 border-t border-neutral-800/80 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Public Profile Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      status === "STEALTH"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {status === "STEALTH" ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {status === "STEALTH" ? "Stealth / Hidden" : "Active / Visible"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleTogglePrivacy}
                  disabled={isTogglingPrivacy}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-700 hover:border-neutral-500 bg-neutral-800/50 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTogglingPrivacy ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-neutral-400" />
                  ) : status === "STEALTH" ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  )}
                  {status === "STEALTH" ? "Make Profile Public (Active)" : "Switch to Stealth (Hidden)"}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 flex flex-col gap-2">
                {username && (
                  <a
                    href={`/api/v1/profile/${username}/vcard`}
                    download
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950/80 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-rose-400" />
                    Download vCard (.vcf)
                  </a>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of Account
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Column: Sign-Up Data & Profile Details Form ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Account Credentials & Registration Data Card (Read-Only Security Section) */}
            <div className="bg-neutral-900/90 border border-neutral-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Account & Sign-Up Credentials</h3>
                  <p className="text-xs text-neutral-400">Security details established when your account was registered.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-950/60 p-6 rounded-2xl border border-neutral-800/60">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Registered Email Address (Login ID)
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-sm select-all">
                    <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">Used for authentication, notifications, and security recovery.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    NFC Profile Username (Unique ID)
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-sm">
                    <span className="text-rose-400 font-bold shrink-0">tagit.lk/p/</span>
                    <span className="truncate font-bold text-white">{username}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">Unique slug linked directly to your NFC chip identifier.</p>
                </div>
              </div>
            </div>

            {/* 2. Editable Profile & Contact Form */}
            <form onSubmit={handleSaveProfile} className="bg-neutral-900/90 border border-neutral-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800/80 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Public Profile Information</h3>
                    <p className="text-xs text-neutral-400">Update the personal and contact data displayed on your public NFC tap page.</p>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Profile Updated!
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Display Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">This name is highlighted at the top of your digital business card.</p>
                </div>

                {/* Bio / Headline */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Professional Bio / Elevator Pitch
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-4 top-3.5 text-neutral-500" />
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Share what you do, your achievements, or your company vision..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Public Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Public Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Public Contact Email */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Public Contact Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      value={publicEmail}
                      onChange={(e) => setPublicEmail(e.target.value)}
                      placeholder="contact@company.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="TAGIT Smart Solutions"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Job Title / Designation
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Chief Executive Officer"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                    Primary Website / Portfolio URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://www.tagit.lk"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-rose-500 text-white placeholder-neutral-600 text-sm focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-6 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Save Account & Profile
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

        </div>
      </main>
    </div>
  );
}
