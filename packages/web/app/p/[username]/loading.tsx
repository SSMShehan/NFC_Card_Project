// ============================================================
//  TAGIT — Profile Page Skeleton Loading State
//  Shown by Next.js Suspense while the server component fetches data.
// ============================================================

import React from 'react';

export default function ProfileLoading() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-start px-4 py-8">
      <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden">

        {/* Header Banner Skeleton */}
        <div className="w-full h-28 skeleton" />

        {/* Avatar Skeleton */}
        <div className="flex flex-col items-center -mt-14 px-6">
          <div className="w-24 h-24 rounded-full skeleton" style={{ border: '3px solid rgba(255,255,255,0.1)' }} />

          {/* Name Skeleton */}
          <div className="text-center mt-4 flex flex-col items-center gap-2 w-full">
            <div className="skeleton h-7 w-40 rounded-lg" />
            <div className="skeleton h-4 w-52 rounded-lg" />
            <div className="skeleton h-4 w-64 rounded-lg mt-1" />
            <div className="skeleton h-4 w-56 rounded-lg" />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 mt-6 mb-0 h-px bg-white/5" />

        {/* Links Section Skeleton */}
        <div className="px-4 pt-4 pb-2">
          <div className="skeleton h-3 w-16 rounded-lg mb-3" />
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="skeleton rounded-2xl"
                style={{ height: '56px', animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* CTA Button Skeleton */}
        <div className="px-4 pt-4 pb-6">
          <div className="skeleton h-14 w-full rounded-2xl" />
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="mt-8 flex flex-col items-center gap-1">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-24 rounded" />
      </div>
    </main>
  );
}
