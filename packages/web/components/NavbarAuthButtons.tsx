"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User as UserIcon, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function NavbarAuthButtons() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-14 h-8 rounded-full bg-neutral-200" />
        <div className="w-24 h-9 rounded-full bg-neutral-300" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const displayName = user.profile?.displayName || user.email.split("@")[0];

    return (
      <div className="relative flex items-center gap-3">
        {/* Tier Badge if Premium */}
        {user.subscriptionTier !== "FREE" && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[11px] font-bold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3 h-3 text-rose-500 fill-rose-500" />
            {user.subscriptionTier}
          </span>
        )}

        {/* User Pill Button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 pl-3 pr-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/60 text-sm font-semibold text-neutral-800 transition-all shadow-xs"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center text-xs font-bold uppercase">
            {displayName.charAt(0)}
          </div>
          <span className="max-w-[120px] truncate">{displayName}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50 text-neutral-700 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2.5 border-b border-neutral-100">
              <div className="text-xs text-neutral-400 font-medium">Signed in as</div>
              <div className="text-xs font-bold text-neutral-900 truncate">{user.email}</div>
            </div>

            <div className="py-1">
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold hover:bg-amber-500/10 text-amber-600 hover:text-amber-700 transition-colors border-b border-neutral-100"
                >
                  <span className="text-base">📊</span>
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-neutral-50 hover:text-rose-600 transition-colors font-medium text-neutral-800"
              >
                <UserIcon className="w-4 h-4 text-neutral-500" />
                User Profile & Account
              </Link>
            </div>

            <div className="border-t border-neutral-100 pt-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/60 transition-colors font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      <Link
        href="/login"
        className="text-sm font-semibold text-neutral-600 hover:text-neutral-950 transition-colors py-2"
      >
        Sign In
      </Link>
      <Link
        href="/register"
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-rose-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
      >
        Get Your Card
      </Link>
    </div>
  );
}
