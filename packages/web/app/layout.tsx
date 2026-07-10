// ============================================================
//  NEXUS — Root Layout
//  Applies global font, metadata defaults, and background.
// ============================================================

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | NEXUS Cards',
    default: 'NEXUS — Digital NFC Business Cards',
  },
  description:
    'Premium NFC digital business cards. Tap, connect, share. Instant contact sharing with a single tap.',
  keywords: ['NFC card', 'digital business card', 'contact sharing', 'NEXUS'],
  authors: [{ name: 'NEXUS' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    siteName: 'NEXUS Cards',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0818',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {/* Atmospheric background — fixed, behind all content */}
        <div className="nexus-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
