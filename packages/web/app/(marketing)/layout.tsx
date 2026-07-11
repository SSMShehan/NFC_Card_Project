import { SmartphoneNfc, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { NavbarAuthButtons } from "../../components/NavbarAuthButtons";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen bg-white text-neutral-950 font-sans overflow-hidden">
      {/* Abstract light background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-50 blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-50 blur-[120px] -z-10 animate-float" />

      {/* ── Ultra-Premium Edge-to-Edge Glassmorphic Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-2xl border-b border-neutral-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          
          {/* 1. Brand Logo Emblem (Icon Eke Idan) */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="p-0.5 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 shadow-md shadow-rose-500/20 group-hover:scale-105 group-hover:shadow-rose-500/35 transition-all duration-300">
              <div className="w-9 h-9 rounded-[14px] bg-neutral-950 flex items-center justify-center relative overflow-hidden">
                <SmartphoneNfc className="text-white w-5 h-5 z-10 group-hover:rotate-6 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-neutral-950 group-hover:text-rose-600 transition-colors">
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

          {/* 2. Center Interactive Navigation Pill Bar (Piliwelata Links) */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/80 p-1.5 rounded-full border border-neutral-200/60 shadow-inner text-xs font-bold text-neutral-600">
            <Link
              href="/products"
              className="px-4 py-2 rounded-full hover:bg-white hover:text-neutral-950 hover:shadow-sm transition-all"
            >
              Products
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-full hover:bg-white hover:text-neutral-950 hover:shadow-sm transition-all"
            >
              Pricing
            </Link>
            <Link
              href="/customize"
              className="px-4 py-2 rounded-full hover:bg-white hover:text-neutral-950 hover:shadow-sm transition-all flex items-center gap-1.5 text-rose-600 group/nav"
            >
              <span>NFC Studio</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black group-hover/nav:scale-105 transition-transform">
                PRO
              </span>
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 rounded-full hover:bg-white hover:text-neutral-950 hover:shadow-sm transition-all"
            >
              About Us
            </Link>
          </nav>

          {/* 3. User Pill & Auth Actions */}
          <div className="shrink-0">
            <NavbarAuthButtons />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20">
        {children}
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <SmartphoneNfc className="text-rose-500 w-5 h-5" />
            <span className="text-lg font-bold text-neutral-950">TAGIT</span>
          </div>
          <div className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} TAGIT Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-400">
            <Link href="#" className="hover:text-neutral-950">Privacy</Link>
            <Link href="#" className="hover:text-neutral-950">Terms</Link>
            <Link href="#" className="hover:text-neutral-950">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
