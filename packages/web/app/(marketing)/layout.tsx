"use client";

import { SmartphoneNfc } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NavbarAuthButtons } from "../../components/NavbarAuthButtons";
import { useTheme } from "../../context/ThemeContext";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLight } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { href: "/products", label: "Cards" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <div
      className={`relative z-10 min-h-screen font-sans overflow-hidden transition-colors duration-500 ${
        isLight
          ? "bg-white text-neutral-950"
          : "bg-[#08080a] text-neutral-100 selection:bg-rose-500 selection:text-white"
      }`}
    >
      {/* Ambient background gradients & mesh */}
      {isLight ? (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] -z-10 animate-pulse-slow bg-rose-50" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] -z-10 animate-float bg-orange-50" />
        </>
      ) : (
        <>
          <div className="absolute top-[-15%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-600/20 via-orange-600/10 to-transparent blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
          <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-indigo-600/15 via-purple-600/10 to-transparent blur-[140px] pointer-events-none -z-10 animate-float" />
          <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-rose-600/10 via-amber-600/10 to-transparent blur-[160px] pointer-events-none -z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0c_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-10 opacity-70" />
        </>
      )}

      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-2xl transition-all duration-300 ${
          isLight
            ? "bg-white/90 border-b border-neutral-200/80 shadow-xs"
            : "bg-[#090812]/80 border-b border-white/[0.12] shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]"
        }`}
      >
        {!isLight && (
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-rose-500/35 to-transparent pointer-events-none" />
        )}
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-0.5 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 shadow-md shadow-rose-500/20 group-hover:scale-105 group-hover:shadow-rose-500/35 transition-all duration-300">
              <div className="w-9 h-9 rounded-[14px] bg-neutral-950 flex items-center justify-center relative overflow-hidden">
                <SmartphoneNfc className="text-white w-5 h-5 z-10 group-hover:rotate-6 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xl font-black tracking-tight transition-colors ${
                    isLight
                      ? "text-neutral-950 group-hover:text-rose-600"
                      : "text-white group-hover:text-rose-400"
                  }`}
                >
                  TAGIT
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-600 text-[9px] font-black tracking-widest uppercase border border-rose-500/20">
                  NFC™
                </span>
              </div>
              <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase -mt-1 hidden md:block">
                Smart Studio
              </span>
            </div>
          </Link>

          {/* Center Nav Pills */}
          <nav
            className={`hidden md:flex items-center gap-1.5 p-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 ${
              isLight
                ? "bg-neutral-100/85 border-neutral-200/70 shadow-inner"
                : "bg-gradient-to-r from-white/[0.08] via-white/[0.05] to-white/[0.08] border-white/15 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
            }`}
          >
            {/* Regular nav links with active detection */}
            {navLinks.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active
                      ? isLight
                        ? "bg-white text-neutral-950 shadow-sm font-bold"
                        : "bg-white/20 text-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                      : isLight
                        ? "text-neutral-600 hover:bg-white/70 hover:text-neutral-950 hover:shadow-xs"
                        : "text-neutral-400 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* NFC Studio PRO — styled separately */}
            <Link
              href="/customize"
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-1.5 group/nav ${
                isActive("/customize")
                  ? isLight
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                    : "bg-rose-500/30 text-rose-300 border border-rose-400/60 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                  : isLight
                    ? "text-rose-600 hover:bg-white hover:text-rose-700 hover:shadow-xs"
                    : "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.18)]"
              }`}
            >
              <span>NFC Studio</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-black group-hover/nav:scale-105 transition-transform ${
                  isActive("/customize") && isLight
                    ? "bg-white text-rose-600"
                    : "bg-rose-500 text-white"
                }`}
              >
                PRO
              </span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="shrink-0">
            <NavbarAuthButtons />
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-20">{children}</div>

      {/* ── Footer ── */}
      <footer
        className={`border-t py-14 px-6 transition-colors relative overflow-hidden ${
          isLight
            ? "border-neutral-200 bg-neutral-50"
            : "border-white/[0.08] bg-[#060608]"
        }`}
      >
        {!isLight && (
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-gradient-to-b from-rose-500/10 via-orange-500/5 to-transparent blur-3xl pointer-events-none" />
        )}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <SmartphoneNfc className="text-rose-500 w-5 h-5" />
            <span
              className={`text-lg font-bold ${
                isLight ? "text-neutral-950" : "text-white"
              }`}
            >
              TAGIT
            </span>
          </div>
          <div className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} TAGIT Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
            <Link
              href="#"
              className={isLight ? "hover:text-neutral-950" : "hover:text-white"}
            >
              Privacy
            </Link>
            <Link
              href="#"
              className={isLight ? "hover:text-neutral-950" : "hover:text-white"}
            >
              Terms
            </Link>
            <Link
              href="#"
              className={isLight ? "hover:text-neutral-950" : "hover:text-white"}
            >
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
