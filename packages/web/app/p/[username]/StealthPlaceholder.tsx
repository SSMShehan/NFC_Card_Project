'use client';
// ============================================================
//  NEXUS — Stealth/Suspended Placeholder Component
//  Shown when the profile status is STEALTH or SUSPENDED.
//  Does not reveal any user information.
// ============================================================

import React from 'react';

interface StealthPlaceholderProps {
  isSuspended?: boolean;
}

export function StealthPlaceholder({ isSuspended = false }: StealthPlaceholderProps) {
  return (
    <main
      className="min-h-dvh flex flex-col items-center justify-center px-6 py-12"
      role="main"
    >
      <div
        className="glass-card w-full max-w-sm rounded-3xl p-10 flex flex-col items-center
                   text-center gap-6 animate-scale-in"
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
          style={{
            background: isSuspended
              ? 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 100%)'
              : 'radial-gradient(circle, rgba(100,81,250,0.2) 0%, rgba(100,81,250,0.05) 100%)',
          }}
          aria-hidden="true"
        >
          {isSuspended ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(239,68,68,0.8)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              width={36}
              height={36}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(100,81,250,0.9)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              width={36}
              height={36}
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold text-white/90 mb-2">
            {isSuspended ? 'Profile Unavailable' : 'Profile is Private'}
          </h1>
          <p className="text-sm text-white/50 leading-relaxed">
            {isSuspended
              ? 'This profile has been suspended and is not currently available.'
              : 'The owner of this card has activated Stealth Mode. Their profile is temporarily hidden.'}
          </p>
        </div>

        {/* NEXUS Branding */}
        <div className="mt-2 pt-6 border-t border-white/10 w-full flex flex-col items-center gap-2">
          <p className="text-xs text-white/30">Powered by</p>
          <span className="gradient-text text-lg font-black tracking-wider">
            NEXUS
          </span>
        </div>
      </div>
    </main>
  );
}
