'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getAdminAnalytics } from '../../services/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<{
    pendingOrders?: number;
    pendingVerifications?: number;
    lowStockAlerts?: number;
  }>({});

  useEffect(() => {
    // Check if user is authenticated and has admin privileges
    if (!isLoading && !isAuthenticated) {
      router.push('/login?returnUrl=/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      getAdminAnalytics()
        .then((res: any) => {
          if (res.success && res.data?.metrics) {
            setMetrics(res.data.metrics);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  const navItems = [
    { name: 'Analytics Dashboard', href: '/admin', icon: '📊', badge: null },
    {
      name: 'Card Inventory',
      href: '/admin/inventory',
      icon: '📦',
      badge: metrics.lowStockAlerts ? `${metrics.lowStockAlerts} Low` : null,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    { name: 'NFC Batch Encoder', href: '/admin/cards', icon: '💳', badge: null },
    {
      name: 'Orders Pipeline',
      href: '/admin/orders',
      icon: '🛒',
      badge: metrics.pendingOrders ? `${metrics.pendingOrders} New` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    { name: 'Customer CRM', href: '/admin/users', icon: '👥', badge: null },
    {
      name: 'Profile Moderation',
      href: '/admin/verifications',
      icon: '🛡️',
      badge: metrics.pendingVerifications ? `${metrics.pendingVerifications}` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400 tracking-wider uppercase font-mono">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-white flex flex-col lg:flex-row selection:bg-amber-500/30 selection:text-amber-200 font-sans">
      {/* ── Mobile Header ──────────────────────────────────────── */}
      <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#12121A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-amber-500/20">
            T
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-white via-neutral-200 to-amber-400 bg-clip-text text-transparent">
            TAGIT <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono">ERP</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* ── Sidebar Navigation ─────────────────────────────────── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#101018]/95 lg:bg-[#101018]/60 backdrop-blur-2xl
          border-r border-white/10 flex flex-col transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Logo */}
        <div className="hidden lg:flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-black text-xl shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-xl bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent flex items-center gap-2">
                TAGIT
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-semibold uppercase">
                  Admin Hub
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono">Enterprise Management Suite</p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Core Modules
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-400 border-l-4 border-amber-400 font-semibold shadow-lg shadow-amber-500/5'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full border font-mono font-bold uppercase tracking-wider ${
                      item.badgeColor || 'bg-white/10 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-500">
            Quick Shortcuts
          </div>
          <Link
            href="/customize"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>🎨</span>
            <span>Profile Customizer</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span>🌐</span>
            <span>View Public Store</span>
          </Link>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0D0D14]/80">
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 flex items-center justify-center text-xs font-bold text-amber-400 uppercase">
                {user?.email?.slice(0, 2) || 'AD'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.email || 'Administrator'}</p>
                <p className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">Super Admin</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                  window.location.href = '/login';
                }
              }}
              title="Sign Out"
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Action Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#12121A]/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-neutral-300 font-mono">
              ⚡ SYSTEM STATUS: <span className="text-emerald-400">OPERATIONAL & SYNCED</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {metrics.lowStockAlerts ? (
              <Link
                href="/admin/inventory"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-medium hover:bg-red-500/20 transition-colors animate-pulse"
              >
                <span>⚠️</span>
                <span>{metrics.lowStockAlerts} SKUs Low Stock</span>
              </Link>
            ) : null}
            {metrics.pendingOrders ? (
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium hover:bg-amber-500/20 transition-colors"
              >
                <span>📦</span>
                <span>{metrics.pendingOrders} Pending Shipments</span>
              </Link>
            ) : null}
            <div className="h-4 w-[1px] bg-white/10" />
            <Link
              href="/customize"
              className="text-xs px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition-all font-medium"
            >
              Back to App
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
