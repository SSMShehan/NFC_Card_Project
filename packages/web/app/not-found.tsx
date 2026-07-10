// ============================================================
//  NEXUS — 404 Not Found Page
// ============================================================

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Profile Not Found | NEXUS',
  description: 'The NEXUS digital business card you are looking for does not exist.',
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

        <div>
          <h1 className="text-xl font-bold text-white/90 mb-2">Card Not Found</h1>
          <p className="text-sm text-white/50 leading-relaxed">
            We couldn&apos;t find a NEXUS card at this address. It may have been removed or the link might be incorrect.
          </p>
        </div>

        <Link
          href="/"
          className="btn-cta px-8 py-3 rounded-xl font-semibold text-white text-sm"
        >
          Back to NEXUS
        </Link>

        <div className="pt-4 border-t border-white/10 w-full flex flex-col items-center gap-2">
          <p className="text-xs text-white/30">Powered by</p>
          <span className="gradient-text text-lg font-black tracking-wider">NEXUS</span>
        </div>
      </div>
    </main>
  );
}
