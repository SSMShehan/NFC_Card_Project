"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User as UserIcon, LogOut, ChevronDown, Sparkles, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function NavbarAuthButtons() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isLight, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 animate-pulse">
        <div className="w-9 h-9 rounded-full bg-neutral-200" />
        <div className="w-14 h-8 rounded-full bg-neutral-200" />
        <div className="w-24 h-9 rounded-full bg-neutral-300" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const displayName = user.profile?.displayName || user.email.split("@")[0];

    return (
      <div className="relative flex items-center gap-3">
        {/* Dark / Light Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-full border transition-all flex items-center justify-center shrink-0 group ${
            isLight
              ? "bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-amber-500 shadow-2xs hover:scale-105"
              : "bg-white/10 hover:bg-white/20 border-white/15 text-indigo-300 shadow-2xs hover:scale-105"
          }`}
          title="Toggle Light / Dark Mode"
        >
          {isLight ? (
            <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:rotate-12" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>

        {/* Glowing Gradient Ring Container around User Pill */}
        <div className="p-[1.5px] rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 shadow-md shadow-rose-500/15 hover:shadow-lg hover:shadow-rose-500/25 transition-all">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2.5 pr-4 py-1.5 rounded-full bg-white/95 hover:bg-white text-sm font-bold text-neutral-900 transition-all active:scale-[0.98]"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 text-white flex items-center justify-center text-xs font-black uppercase shadow-inner">
              {displayName.charAt(0)}
            </div>
            <span className="max-w-[130px] truncate tracking-tight">{displayName}</span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180 text-rose-500" : ""
              }`}
            />
          </button>
        </div>

        {/* Ultra-Premium Glassmorphic Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 rounded-3xl bg-white/95 backdrop-blur-2xl border border-neutral-200/80 shadow-2xl shadow-rose-500/10 p-2.5 z-50 text-neutral-800 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="px-4 py-3 border-b border-neutral-100 mb-1">
              <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">Signed in as</div>
              <div className="text-xs font-bold text-neutral-900 truncate font-mono mt-0.5">{user.email}</div>
            </div>

            <div className="py-1 space-y-1">
              {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                <Link
                  href="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-amber-500/10 text-amber-600 hover:text-amber-700 transition-all group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">📊</span>
                  <span>Admin Dashboard</span>
                </Link>
              )}
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm hover:bg-rose-50/80 hover:text-rose-600 transition-all font-bold text-neutral-800 group"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-rose-500/10 flex items-center justify-center text-neutral-500 group-hover:text-rose-600 transition-colors">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>User Profile & Account</span>
              </Link>
            </div>

            <div className="border-t border-neutral-100 pt-1 mt-1">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-rose-600 hover:bg-rose-50/80 transition-all font-bold text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* Dark / Light Theme Switcher */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-full border transition-all flex items-center justify-center shrink-0 group ${
          isLight
            ? "bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-amber-500 shadow-2xs hover:scale-105"
            : "bg-white/10 hover:bg-white/20 border-white/15 text-indigo-300 shadow-2xs hover:scale-105"
        }`}
        title="Toggle Light / Dark Mode"
      >
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </button>

      <Link
        href="/login"
        className="text-sm font-bold text-neutral-600 hover:text-rose-600 transition-colors py-2 relative group ml-1"
      >
        <span>Sign In</span>
        <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-300 group-hover:w-full" />
      </Link>
      <Link
        href="/register"
        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white text-sm font-bold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 group border border-white/20"
      >
        <span>Get Your Card</span>
        <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
      </Link>
    </div>
  );
}
