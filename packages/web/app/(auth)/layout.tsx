"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SmartphoneNfc, ArrowLeft, Star, ShieldCheck, Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-white text-neutral-950 flex flex-col lg:grid lg:grid-cols-12 overflow-hidden font-sans relative z-20 shadow-2xl">
      {/* ── Left Column: Showcase & Brand (7 cols on Desktop) ── */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-gradient-to-br from-[#FFF5F7] via-white to-[#FFF9F2] border-r border-neutral-200/80 p-8 xl:p-12 flex-col justify-between h-full overflow-hidden">
        {/* Animated Soft Glowing Orbs */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-rose-300/40 via-orange-200/40 to-purple-300/20 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-6 right-0 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-amber-200/40 via-rose-300/30 to-indigo-200/30 blur-[110px] pointer-events-none"
        />

        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: `32px 32px`
          }}
        />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <SmartphoneNfc className="text-white w-4.5 h-4.5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-neutral-950">TAGIT</span>
          </Link>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-neutral-200 shadow-sm text-xs font-bold text-neutral-800 backdrop-blur-xl">
            <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> Instant Contact Sharing
          </div>
        </div>

        {/* Center Floating Graphic — Sleek Obsidian Card for High Luxury Contrast */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-4">
          <motion.div
            animate={{ y: [-6, 6, -6], rotateZ: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-72 h-44 sm:w-80 sm:h-48 rounded-2xl bg-gradient-to-tr from-neutral-950 via-[#16132b] to-[#251e54] p-5 border border-neutral-800 shadow-[0_25px_80px_-20px_rgba(244,63,94,0.3)] flex flex-col justify-between overflow-hidden group"
          >
            {/* Glare effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-70 pointer-events-none" />
            
            {/* Top row of card */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 p-[1.5px]">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <SmartphoneNfc className="w-3 h-3 text-rose-400" />
                  </div>
                </div>
                <span className="font-bold tracking-widest text-xs text-neutral-200">TAGIT CARD</span>
              </div>
              <span className="text-[9px] uppercase font-semibold tracking-wider text-neutral-300 px-2 py-0.5 rounded-full bg-white/10 border border-white/15">
                PREMIUM
              </span>
            </div>

            {/* Middle subtle wave */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
              <div className="w-64 h-64 border border-rose-500/40 rounded-full animate-ping-slow" />
            </div>

            {/* Bottom row of card */}
            <div className="flex items-end justify-between relative z-10">
              <div>
                <div className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase mb-0.5">Tap or Scan</div>
                <div className="text-sm font-extrabold text-white tracking-wider">NFC READY • NO APP REQUIRED</div>
              </div>
              {/* Gold Chip */}
              <div className="w-8 h-5 rounded bg-gradient-to-br from-amber-200 via-yellow-500 to-amber-700 border border-yellow-300/50 shadow-sm flex flex-col justify-evenly px-0.5 opacity-95">
                <div className="w-full h-[0.5px] bg-black/30" />
                <div className="w-full h-[0.5px] bg-black/30" />
              </div>
            </div>
          </motion.div>

          {/* Floating Feature Badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 grid grid-cols-2 gap-3 max-w-md w-full"
          >
            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px]">
                <div className="font-black text-neutral-950 text-xs">Bank Security</div>
                <div className="text-neutral-600 font-medium">Encrypted JWT</div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0 shadow-2xs">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-[11px]">
                <div className="font-black text-neutral-950 text-xs">Instant Sync</div>
                <div className="text-neutral-600 font-medium">All mobile devices</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Testimonial */}
        <div className="relative z-10 pt-4 border-t border-neutral-200/80 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-neutral-800 italic max-w-xs font-semibold leading-relaxed">
              &ldquo;The absolute best networking investment I&apos;ve made. One tap and my portfolio is shared.&rdquo;
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-neutral-950 tracking-tight">50,000+</div>
            <div className="text-[11px] font-bold text-neutral-600">Active Professionals</div>
          </div>
        </div>
      </div>

      {/* ── Right Column: Form Container (5 cols on Desktop) ── */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 lg:p-8 xl:p-10 h-[100dvh] bg-white lg:bg-[#FCFCFD] relative z-10 overflow-hidden">
        {/* Mobile-only header */}
        <div className="flex lg:hidden items-center justify-between shrink-0 mb-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-xs">
              <SmartphoneNfc className="text-white w-3.5 h-3.5" />
            </div>
            <span className="text-lg font-black tracking-tight text-neutral-950">TAGIT</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-rose-600 transition-colors py-1 px-3 rounded-full bg-neutral-100 border border-neutral-200"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
        </div>

        {/* Desktop top bar navigation */}
        <div className="hidden lg:flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-rose-600 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Return to Website
          </Link>
          <div className="text-[11px] font-mono font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/80">SECURE AUTH v1.0</div>
        </div>

        {/* Form Area — centered vertically with invisible auto-scroll safety net */}
        <div className="w-full max-w-md mx-auto my-auto overflow-y-auto no-scrollbar max-h-[calc(100dvh-110px)] py-1">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] font-semibold text-neutral-500 shrink-0 pt-3 border-t border-neutral-200">
          © {new Date().getFullYear()} TAGIT Technologies Inc. All rights reserved. •{" "}
          <Link href="#" className="text-neutral-800 hover:text-rose-600 font-bold underline decoration-neutral-300">Privacy</Link> •{" "}
          <Link href="#" className="text-neutral-800 hover:text-rose-600 font-bold underline decoration-neutral-300">Terms</Link>
        </div>
      </div>
    </div>
  );
}
