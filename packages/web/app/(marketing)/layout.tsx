import { SmartphoneNfc } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 min-h-screen bg-white text-neutral-950 font-sans overflow-hidden">
      {/* Abstract light background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-50 blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-50 blur-[100px] -z-10 animate-float" />

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <SmartphoneNfc className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-950">TAGIT</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
            <Link href="/products" className="hover:text-rose-500 transition-colors">Products</Link>
            <Link href="/pricing" className="hover:text-rose-500 transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-rose-500 transition-colors">About Us</Link>
          </nav>
          <button className="px-5 py-2.5 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-900 transition-colors shadow-md shadow-neutral-200">
            Get Your Card
          </button>
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
