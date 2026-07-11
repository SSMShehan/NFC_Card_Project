// ============================================================
//  NEXUS — 404 Not Found Page
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile Not Found | TAGIT',
  description: 'The TAGIT digital business card you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12">
      <div className="glass-card w-full max-w-sm rounded-3xl p-10 flex flex-col items-center text-center gap-6 animate-scale-in">

        {/* 404 Indicator */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, rgba(100,81,250,0.15) 0%, transparent 70%)' }}
        >
          <span className="gradient-text text-4xl font-black">404</span>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-black tracking-tight text-white">Card Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            This NFC digital business card link is either invalid, inactive, or has been deleted by the owner.
          </p>
        </div>

        <Link 
          href="/"
          className="btn-cta inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-glow"
        >
          <Home className="w-5 h-5" />
          Back to TAGIT
        </Link>

        <div className="pt-4 border-t border-white/10 w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-slate-500" />
            <span className="gradient-text text-lg font-black tracking-wider">TAGIT</span>
          </div>
        </div>
      </div>
    </main>
  );
}
