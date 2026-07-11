'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getAdminAnalytics } from '../../services/api';
import { AdminThemeProvider, useAdminTheme } from './AdminThemeContext';
import { Sun, Moon } from 'lucide-react';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, toggleTheme, isLight } = useAdminTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState<{
    pendingOrders?: number;
    pendingVerifications?: number;
    lowStockAlerts?: number;
  }>({});

  useEffect(() => {
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
      badge: metrics.lowStockAlerts ? `${metrics.lowStockAlerts}` : null,
      badgeColor: isLight
        ? 'bg-red-500/10 text-red-700 border-red-300'
        : 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    { name: 'Provision Cards', href: '/admin/cards', icon: '🪪', badge: null },
    {
      name: 'Order Management',
      href: '/admin/orders',
      icon: '🚚',
      badge: metrics.pendingOrders ? `${metrics.pendingOrders}` : null,
      badgeColor: isLight
        ? 'bg-amber-500/15 text-amber-800 border-amber-300'
        : 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    { name: 'Users & Roles', href: '/admin/users', icon: '👥', badge: null },
    {
      name: 'Profile Moderation',
      href: '/admin/verifications',
      icon: '🛡️',
      badge: metrics.pendingVerifications ? `${metrics.pendingVerifications}` : null,
      badgeColor: isLight
        ? 'bg-amber-500/15 text-amber-800 border-amber-300'
        : 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
  ];

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors ${
          isLight ? 'bg-neutral-50 text-neutral-900' : 'bg-[#0A0A0E] text-white'
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-500 tracking-wider uppercase font-mono">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-screen flex flex-col lg:flex-row selection:bg-amber-500/30 font-sans overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-neutral-50 text-neutral-900 selection:text-amber-900' : 'bg-[#0A0A0E] text-white selection:text-amber-200'
      }`}
    >
      {/* ── Mobile Header ──────────────────────────────────────── */}
      <header
        className={`lg:hidden flex items-center justify-between px-5 py-4 border-b backdrop-blur-xl sticky top-0 z-50 transition-colors ${
          isLight
            ? 'bg-white/90 border-neutral-200 text-neutral-900 shadow-sm'
            : 'bg-[#12121A]/80 border-white/10 text-white'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-amber-500/20">
            T
          </div>
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-amber-600 via-neutral-700 to-amber-500 dark:from-white dark:via-neutral-200 dark:to-amber-400 bg-clip-text text-transparent">
            TAGIT{' '}
            <span
              className={`text-xs px-2 py-0.5 rounded border font-mono ${
                isLight
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              ERP
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isLight
                ? 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
            }`}
            title="Toggle Theme"
          >
            {isLight ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl border ${
              isLight
                ? 'bg-neutral-100 border-neutral-300 text-neutral-700 hover:bg-neutral-200'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
            }`}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* ── Sidebar Navigation ─────────────────────────────────── */}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen z-40 w-72 backdrop-blur-2xl
          border-r flex flex-col transition-all duration-300 ease-out shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${
            isLight
              ? 'bg-white/95 border-neutral-200/80 shadow-xl'
              : 'bg-[#101018]/95 lg:bg-[#101018]/60 border-white/10'
          }
        `}
      >
        {/* Brand Logo */}
        <div className={`hidden lg:flex items-center justify-between p-6 border-b ${isLight ? 'border-neutral-200/80' : 'border-white/10'}`}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-black text-xl shadow-xl shadow-amber-500/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <div>
              <div
                className={`font-extrabold tracking-tight text-xl flex items-center gap-2 ${
                  isLight ? 'text-neutral-900' : 'bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent'
                }`}
              >
                TAGIT
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-semibold uppercase ${
                    isLight
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-800'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}
                >
                  Admin Hub
                </span>
              </div>
              <p className={`text-xs font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Enterprise Management Suite
              </p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className={`px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
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
                    ? isLight
                      ? 'bg-amber-500/15 text-amber-900 border-l-4 border-amber-600 font-bold shadow-sm'
                      : 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-400 border-l-4 border-amber-400 font-semibold shadow-lg shadow-amber-500/5'
                    : isLight
                      ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
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
                      item.badgeColor || (isLight ? 'bg-neutral-200 text-neutral-800' : 'bg-white/10 text-white')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className={`pt-6 px-3 pb-2 text-[11px] font-mono font-semibold uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Quick Shortcuts
          </div>
          <Link
            href="/customize"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
              isLight ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎨</span>
            <span>Profile Customizer</span>
          </Link>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-colors ${
              isLight ? 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🌐</span>
            <span>View Public Store</span>
          </Link>
        </nav>

        {/* User Footer */}
        <div className={`p-4 border-t flex flex-col gap-3 ${isLight ? 'border-neutral-200/80 bg-neutral-100/50' : 'border-white/10 bg-[#0D0D14]/80'}`}>
          <div className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border ${isLight ? 'bg-white border-neutral-200 shadow-sm' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-bold uppercase ${
                  isLight
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-800'
                    : 'bg-gradient-to-br from-neutral-700 to-neutral-900 border-white/10 text-amber-400'
                }`}
              >
                {user?.email?.slice(0, 2) || 'AD'}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                  {user?.email || 'Administrator'}
                </p>
                <p className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
                  Super Admin
                </p>
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
              className={`p-1.5 rounded-lg transition-colors ${
                isLight ? 'hover:bg-red-500/10 text-neutral-400 hover:text-red-600' : 'hover:bg-red-500/20 text-neutral-400 hover:text-red-400'
              }`}
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col h-full lg:h-screen overflow-hidden">
        {/* Top Action Bar */}
        <header
          className={`hidden lg:flex items-center justify-between px-8 py-4 border-b backdrop-blur-xl sticky top-0 z-30 transition-colors ${
            isLight
              ? 'bg-white/80 border-neutral-200 text-neutral-900 shadow-sm'
              : 'bg-[#12121A]/40 border-white/10 text-white'
          }`}
        >
          <div className="flex items-center gap-4">
            <h1 className={`text-sm font-semibold font-mono ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
              ⚡ SYSTEM STATUS: <span className="text-emerald-600 dark:text-emerald-400 font-bold">OPERATIONAL & SYNCED</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {metrics.lowStockAlerts ? (
              <Link
                href="/admin/inventory"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors animate-pulse ${
                  isLight
                    ? 'bg-red-500/10 border-red-300 text-red-700 hover:bg-red-500/20'
                    : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                }`}
              >
                <span>⚠️</span>
                <span>{metrics.lowStockAlerts} SKUs Low Stock</span>
              </Link>
            ) : null}
            {metrics.pendingOrders ? (
              <Link
                href="/admin/orders"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-colors ${
                  isLight
                    ? 'bg-amber-500/15 border-amber-300 text-amber-800 hover:bg-amber-500/25'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <span>📦</span>
                <span>{metrics.pendingOrders} Pending Shipments</span>
              </Link>
            ) : null}
            <div className={`h-4 w-[1px] ${isLight ? 'bg-neutral-300' : 'bg-white/10'}`} />
            
            {/* Top Navbar Icon Theme Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-amber-500 shadow-sm'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-indigo-300 hover:text-white'
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <Link
              href="/"
              className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all font-medium ${
                isLight
                  ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white'
              }`}
            >
              Back to Home
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
