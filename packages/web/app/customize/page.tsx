import React from "react";
import Link from "next/link";
import { SmartphoneNfc, ArrowLeft } from "lucide-react";
import ThreeDCardCustomizer from "@/components/ThreeDCardCustomizer";

export const metadata = {
  title: "TAGIT | Luxury Customizer",
  description: "Design your premium NFC digital business card in real-time 3D with next-level luxury.",
};

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-950 flex flex-col font-sans relative overflow-hidden">
      {/* Light Theme ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />

      {/* ── Light Premium Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-neutral-200">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              href="/products" 
              className="flex items-center gap-3 text-neutral-500 hover:text-neutral-950 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center group-hover:border-neutral-300 bg-white transition-colors shadow-sm">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-sm font-medium tracking-wide hidden sm:inline uppercase text-xs">Back</span>
            </Link>
            
            <div className="h-8 w-px bg-neutral-200 hidden sm:block"></div>
            
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 p-[1px] shadow-sm">
                 <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                    <SmartphoneNfc className="text-rose-500 w-5 h-5" />
                 </div>
              </div>
              <span className="text-2xl font-extrabold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-600 uppercase">TAGIT</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline text-xs font-semibold tracking-widest text-neutral-400 uppercase">Studio Mode</span>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold uppercase tracking-widest hover:shadow-lg hover:shadow-rose-500/30 transition-all active:scale-95">
              Complete Design
            </button>
          </div>
        </div>
      </header>

      {/* ── 3D Customizer Interface ── */}
      <main className="flex-grow flex items-center justify-center">
        <ThreeDCardCustomizer />
      </main>
    </div>
  );
}
